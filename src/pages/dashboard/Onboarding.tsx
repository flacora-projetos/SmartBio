import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
import { mockOnboardingSteps } from '@/data/mock';
import type { PublicSmartBioData } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getOrCreateTenant } from '@/lib/tenant';
import { generateInitialPreview, type OnboardingDraftAnswers } from '@/lib/smartbio-flow';

const initialAnswers: OnboardingDraftAnswers = {
  brandName: '',
  shortBio: '',
  niche: '',
  objective: 'Captar leads',
  audience: '',
  pain: '',
  offerTitle: '',
  offerDescription: '',
  diagnosticTitle: 'Diagnóstico Inteligente',
  diagnosticQuestion: 'Qual é o seu principal objetivo hoje?',
  diagnosticOptions: ['Organizar meus processos', 'Aumentar minhas vendas', 'Ter acompanhamento direto'],
  diagnosticQuestion2: '',
  diagnosticOptions2: ['', '', ''],
  conversionDestination: 'whatsapp',
  buttonText: 'Falar no WhatsApp',
  conversionMessage: 'Olá! Acabei de fazer o diagnóstico na SmartBio e gostaria de entender o próximo passo.',
  theme: 'light',
  accentColor: '#000000',
};

const DRAFT_KEY = 'smartbio_onboarding_draft';

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.details === 'string') return obj.details;
    if (typeof obj.hint === 'string') return obj.hint;
    return JSON.stringify(obj);
  }
  return String(err);
}

function loadDraft(): Partial<OnboardingDraftAnswers> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<OnboardingDraftAnswers>) : {};
  } catch {
    return {};
  }
}

function saveDraft(answers: OnboardingDraftAnswers) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingDraftAnswers>(() => ({
    ...initialAnswers,
    ...loadDraft(),
  }));
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showSecondQuestion, setShowSecondQuestion] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { tenant, user } = useAuth();
  const step = mockOnboardingSteps[currentStep];

  // Auto-save rascunho no localStorage a cada mudança
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      saveDraft(answers);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 800);
    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [answers]);

  const updateAnswer = <Key extends keyof OnboardingDraftAnswers>(key: Key, value: OnboardingDraftAnswers[Key]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const handleNext = async () => {
    setErrorMessage(null);

    if (currentStep < mockOnboardingSteps.length - 1) {
      setCurrentStep((current) => current + 1);
      return;
    }

    let resolvedTenant = tenant;

    if (!resolvedTenant && user) {
      try {
        resolvedTenant = await getOrCreateTenant(user);
      } catch (err) {
        const msg = extractMessage(err);
        console.error('[Onboarding] Fallback de tenant falhou:', err);
        setErrorMessage(`Erro ao carregar workspace: ${msg}. Recarregue a página e tente novamente.`);
        return;
      }
    }

    if (!resolvedTenant) {
      setErrorMessage(
        user
          ? 'Workspace não encontrado para este usuário. Recarregue a página e tente novamente.'
          : 'Sessão expirada. Faça login novamente.'
      );
      return;
    }

    try {
      setIsGenerating(true);
      await generateInitialPreview(resolvedTenant, answers);
      clearDraft();
      navigate('/app/preview');
    } catch (error) {
      console.error('[Onboarding] generateInitialPreview falhou:', error);
      setErrorMessage(`Erro ao gerar preview: ${extractMessage(error)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    }
  };

  const updateDiagnosticOption = (index: number, value: string) => {
    const nextOptions = [...answers.diagnosticOptions];
    nextOptions[index] = value;
    updateAnswer('diagnosticOptions', nextOptions);
  };

  const updateDiagnosticOption2 = (index: number, value: string) => {
    const nextOptions = [...answers.diagnosticOptions2];
    nextOptions[index] = value;
    updateAnswer('diagnosticOptions2', nextOptions);
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);
    setIsUploadingAvatar(true);

    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      updateAnswer('avatarUrl', publicUrl);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'identity':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="w-20 h-20 rounded-full bg-surface border border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors shrink-0 overflow-hidden relative"
              >
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isUploadingAvatar ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6 mb-1" />}
                    {!isUploadingAvatar && <span className="text-[10px]">Foto</span>}
                  </>
                )}
              </button>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-ink">Nome da marca ou profissional</label>
                <input className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" value={answers.brandName} onChange={(event) => updateAnswer('brandName', event.target.value)} placeholder="Ex: Ana Souza Consultoria" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Bio curta</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" value={answers.shortBio} onChange={(event) => updateAnswer('shortBio', event.target.value)} placeholder="Ex: ajudo empreendedores a venderem mais com clareza e posicionamento" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Nicho ou posicionamento</label>
              <input className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" value={answers.niche} onChange={(event) => updateAnswer('niche', event.target.value)} placeholder="Ex: consultoria imobiliaria, mentoria, clinica, infoproduto" />
            </div>
          </div>
        );

      case 'objective':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['Vender uma oferta', 'Captar leads', 'Qualificar interessados', 'Agendar atendimento'].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => updateAnswer('objective', suggestion)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer ${answers.objective === suggestion ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface hover:border-primary/50 text-muted-foreground'}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Ou descreva com suas próprias palavras</label>
              <input
                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={answers.objective}
                onChange={(e) => updateAnswer('objective', e.target.value)}
                placeholder="Ex: quero agendar consultas para meu consultório odontológico"
              />
            </div>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Visitante ideal</label>
              <input className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" value={answers.audience} onChange={(event) => updateAnswer('audience', event.target.value)} placeholder="Ex: empreendedores que precisam vender com mais clareza" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Principal dor desse visitante</label>
              <input className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" value={answers.pain} onChange={(event) => updateAnswer('pain', event.target.value)} placeholder="Ex: chega interessado, mas nao sabe qual oferta escolher" />
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Oferta principal</label>
              <input className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" value={answers.offerTitle} onChange={(event) => updateAnswer('offerTitle', event.target.value)} placeholder="Ex: Consultoria inicial, diagnostico, mentoria, produto principal" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Descricao da oferta</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]" value={answers.offerDescription} onChange={(event) => updateAnswer('offerDescription', event.target.value)} placeholder="Explique o que essa oferta resolve e para quem ela serve." />
            </div>
          </div>
        );

      case 'diagnostic': {
        const titleSuggestions = [
          'Diagnóstico Inteligente',
          'Qual é o seu perfil?',
          'Me conta sobre você',
          'Encontre sua solução',
          'Para quem é isso?',
        ];
        const inputClass = 'w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm';

        return (
          <div className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Título do diagnóstico</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {titleSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateAnswer('diagnosticTitle', s)}
                    className={`px-3 py-1 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      answers.diagnosticTitle === s
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-surface hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <input className={inputClass} value={answers.diagnosticTitle} onChange={(e) => updateAnswer('diagnosticTitle', e.target.value)} placeholder="Ex: Diagnóstico Inteligente" />
            </div>

            {/* Pergunta 1 */}
            <div className="space-y-3 p-4 rounded-2xl border border-border bg-surface/50">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pergunta 1</p>
              <input
                className={inputClass}
                value={answers.diagnosticQuestion}
                onChange={(e) => updateAnswer('diagnosticQuestion', e.target.value)}
                placeholder="Ex: Qual é o seu principal objetivo hoje?"
              />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Opções de resposta</p>
                {answers.diagnosticOptions.map((option, index) => (
                  <input
                    key={index}
                    className={inputClass}
                    value={option}
                    onChange={(e) => updateDiagnosticOption(index, e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Pergunta 2 */}
            {showSecondQuestion ? (
              <div className="space-y-3 p-4 rounded-2xl border border-border bg-surface/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pergunta 2</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSecondQuestion(false);
                      updateAnswer('diagnosticQuestion2', '');
                      updateAnswer('diagnosticOptions2', ['', '', '']);
                    }}
                    className="text-xs text-destructive hover:underline cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
                <input
                  className={inputClass}
                  value={answers.diagnosticQuestion2}
                  onChange={(e) => updateAnswer('diagnosticQuestion2', e.target.value)}
                  placeholder="Ex: Qual é o seu nível de experiência?"
                />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Opções de resposta</p>
                  {answers.diagnosticOptions2.map((option, index) => (
                    <input
                      key={index}
                      className={inputClass}
                      value={option}
                      onChange={(e) => updateDiagnosticOption2(index, e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSecondQuestion(true)}
                className="w-full py-2.5 rounded-2xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
              >
                + Adicionar segunda pergunta
              </button>
            )}
          </div>
        );
      }

      case 'conversion':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Destino final do CTA</label>
              <div className="grid grid-cols-2 gap-3">
                {['whatsapp', 'agenda', 'formulario', 'checkout'].map((destination) => (
                  <button key={destination} type="button" onClick={() => updateAnswer('conversionDestination', destination)} className={`p-3 rounded-xl border-2 text-center cursor-pointer text-sm font-medium capitalize ${answers.conversionDestination === destination ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface hover:border-primary/50 text-ink'}`}>
                    {destination}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Texto do botao final</label>
              <input className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" value={answers.buttonText} onChange={(event) => updateAnswer('buttonText', event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Mensagem ou destino do CTA</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 h-24" value={answers.conversionMessage} onChange={(event) => updateAnswer('conversionMessage', event.target.value)} />
            </div>
          </div>
        );

      case 'style':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Tema visual</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => updateAnswer('theme', 'light')} className={`p-4 rounded-xl border-2 ${answers.theme === 'light' ? 'border-primary' : 'border-border'} bg-background cursor-pointer flex flex-col items-center gap-2`}>
                  <div className="w-8 h-8 rounded-full bg-background border border-border shadow-sm" />
                  <span className="text-xs font-bold text-primary">Claro</span>
                </button>
                <button type="button" onClick={() => updateAnswer('theme', 'dark')} className={`p-4 rounded-xl border-2 ${answers.theme === 'dark' ? 'border-primary' : 'border-border'} bg-ink cursor-pointer flex flex-col items-center gap-2`}>
                  <div className="w-8 h-8 rounded-full bg-ink border border-surface" />
                  <span className="text-xs font-bold text-surface">Escuro</span>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Cor de destaque da marca</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={answers.accentColor}
                  onChange={(e) => updateAnswer('accentColor', e.target.value)}
                  className="w-12 h-12 rounded-xl border border-border cursor-pointer p-1 bg-transparent"
                />
                <input
                  type="text"
                  value={answers.accentColor.toUpperCase()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) updateAnswer('accentColor', val);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                  placeholder="#000000"
                  maxLength={7}
                />
                <div className="w-12 h-12 rounded-xl border border-border shrink-0" style={{ backgroundColor: answers.accentColor }} />
              </div>
              <p className="text-xs text-muted-foreground">Sugestões rápidas:</p>
              <div className="flex gap-2 flex-wrap">
                {['#000000', '#2563EB', '#16A34A', '#D97706', '#DB2777', '#7C3AED', '#DC2626'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    onClick={() => updateAnswer('accentColor', color)}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${answers.accentColor.toUpperCase() === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Identidade', value: answers.brandName || 'A preencher' },
                { label: 'Objetivo', value: answers.objective },
                { label: 'Oferta', value: answers.offerTitle || 'Oferta inicial sera gerada' },
                { label: 'Diagnostico', value: answers.diagnosticQuestion ? '1 pergunta' : 'Pendente' },
                { label: 'Conversao', value: answers.conversionDestination },
                { label: 'Estilo', value: answers.theme === 'light' ? 'Claro' : 'Escuro' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-bold text-ink">{item.value}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-8 shrink-0">
          <h1 className="text-3xl font-heading font-bold text-ink">Onboarding Guiado</h1>
          <p className="text-muted-foreground mt-2">Responda as perguntas e a SmartBio monta tudo para você.</p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-background/50">
              <OnboardingStepper
                steps={mockOnboardingSteps.map((onboardingStep) => ({ id: onboardingStep.id, title: onboardingStep.title }))}
                currentStepIndex={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>

            <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
              <h2 className="text-xl font-bold font-heading text-ink mb-2">{step.title}</h2>
              {step.type !== 'review' && step.type !== 'offers' && (
                <p className="text-sm text-muted-foreground mb-6">{step.description}</p>
              )}
              {renderStepContent()}
            </div>

            <div className="p-6 border-t border-border bg-background/50 flex flex-col gap-3">
              {errorMessage && (
                <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-2 text-center">
                  {errorMessage}
                </p>
              )}
              <div className="flex items-center justify-between gap-4">
              <Button variant="outline" className="rounded-xl px-6" onClick={handlePrev} disabled={currentStep === 0 || isGenerating}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>

              <span className={`text-xs text-muted-foreground transition-opacity duration-500 ${draftSaved ? 'opacity-100' : 'opacity-0'}`}>
                Rascunho salvo
              </span>

              <Button className="rounded-xl px-8 bg-primary text-primary-foreground" onClick={handleNext} disabled={isGenerating}>
                {currentStep === mockOnboardingSteps.length - 1 ? (
                  isGenerating ? 'Gerando preview...' : 'Gerar preview final'
                ) : (
                  <>Continuar <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col items-center bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">Preview em tempo real</h3>
              <div className="transform scale-[0.8] origin-top h-[480px]">
                <SmartBioPreviewMock data={{
                  tenantName: answers.brandName || 'Sua marca',
                  title: answers.brandName || 'Seu nome aqui',
                  bio: answers.shortBio || null,
                  theme: answers.theme,
                  avatarUrl: avatarPreview || null,
                  socialLinks: {},
                  offers: answers.offerTitle
                    ? [{ title: answers.offerTitle, description: answers.offerDescription } as unknown as PublicSmartBioData['offers'][0]]
                    : [],
                  quizQuestions: [
                    ...(answers.diagnosticQuestion
                      ? [{ question: answers.diagnosticQuestion, options: answers.diagnosticOptions.filter(Boolean) } as unknown as PublicSmartBioData['quizQuestions'][0]]
                      : []),
                    ...(showSecondQuestion && answers.diagnosticQuestion2
                      ? [{ question: answers.diagnosticQuestion2, options: answers.diagnosticOptions2.filter(Boolean) } as unknown as PublicSmartBioData['quizQuestions'][0]]
                      : []),
                  ],
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
