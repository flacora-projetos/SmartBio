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
  whatsapp: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  site: '',
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
  diagnosticQuestion3: '',
  diagnosticOptions3: ['', '', ''],
  diagnosticQuestion4: '',
  diagnosticOptions4: ['', '', ''],
  diagnosticQuestion5: '',
  diagnosticOptions5: ['', '', ''],
  conversionDestination: 'whatsapp',
  buttonText: 'Falar no WhatsApp',
  conversionMessage: '',
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
  const [numQuestionsShown, setNumQuestionsShown] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const { tenant, user } = useAuth();
  const step = mockOnboardingSteps[currentStep];

  // Inicializa avatar do usuário (metadados Supabase Auth)
  useEffect(() => {
    const metaAvatar = user?.user_metadata?.avatar_url as string | undefined;
    if (metaAvatar && !avatarPreview) {
      setAvatarPreview(metaAvatar);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Carrega respostas salvas do Supabase quando não há rascunho local
  useEffect(() => {
    if (!tenant || !user) return;
    if (localStorage.getItem(DRAFT_KEY)) return;

    async function loadFromSupabase() {
      const { data, error } = await supabase
        .from('onboarding_answers')
        .select('step_id, answer')
        .eq('tenant_id', tenant!.id);

      if (error || !data || data.length === 0) return;

      const merged: Partial<OnboardingDraftAnswers> = {};
      let hasQ2 = false, hasQ3 = false, hasQ4 = false, hasQ5 = false;

      for (const row of data) {
        const ans = row.answer as Record<string, unknown>;
        switch (row.step_id) {
          case 'step_identity':
            if (ans.brandName) merged.brandName = String(ans.brandName);
            if (ans.shortBio) merged.shortBio = String(ans.shortBio);
            if (ans.niche) merged.niche = String(ans.niche);
            if (ans.whatsapp) merged.whatsapp = String(ans.whatsapp);
            if (ans.instagram) merged.instagram = String(ans.instagram);
            if (ans.tiktok) merged.tiktok = String(ans.tiktok);
            if (ans.youtube) merged.youtube = String(ans.youtube);
            if (ans.site) merged.site = String(ans.site);
            if (ans.avatarUrl) {
              merged.avatarUrl = String(ans.avatarUrl);
              setAvatarPreview(String(ans.avatarUrl));
            }
            break;
          case 'step_objective':
            if (ans.objective) merged.objective = String(ans.objective);
            break;
          case 'step_audience':
            if (ans.audience) merged.audience = String(ans.audience);
            if (ans.pain) merged.pain = String(ans.pain);
            break;
          case 'step_offers':
            if (ans.title) merged.offerTitle = String(ans.title);
            if (ans.description) merged.offerDescription = String(ans.description);
            break;
          case 'step_diagnostic':
            if (ans.title) merged.diagnosticTitle = String(ans.title);
            if (ans.question) merged.diagnosticQuestion = String(ans.question);
            if (Array.isArray(ans.options)) merged.diagnosticOptions = ans.options.map(String);
            if (ans.question2) { merged.diagnosticQuestion2 = String(ans.question2); hasQ2 = true; }
            if (Array.isArray(ans.options2)) merged.diagnosticOptions2 = ans.options2.map(String);
            if (ans.question3) { merged.diagnosticQuestion3 = String(ans.question3); hasQ3 = true; }
            if (Array.isArray(ans.options3)) merged.diagnosticOptions3 = ans.options3.map(String);
            if (ans.question4) { merged.diagnosticQuestion4 = String(ans.question4); hasQ4 = true; }
            if (Array.isArray(ans.options4)) merged.diagnosticOptions4 = ans.options4.map(String);
            if (ans.question5) { merged.diagnosticQuestion5 = String(ans.question5); hasQ5 = true; }
            if (Array.isArray(ans.options5)) merged.diagnosticOptions5 = ans.options5.map(String);
            break;
          case 'step_conversion':
            if (ans.destination) merged.conversionDestination = String(ans.destination);
            if (ans.buttonText) merged.buttonText = String(ans.buttonText);
            if (ans.message) merged.conversionMessage = String(ans.message);
            break;
          case 'step_style':
            if (ans.theme) merged.theme = String(ans.theme) as 'light' | 'dark';
            if (ans.accentColor) merged.accentColor = String(ans.accentColor);
            break;
        }
      }

      if (Object.keys(merged).length > 0) {
        setAnswers(prev => ({ ...prev, ...merged }));
        const nShown = hasQ5 ? 5 : hasQ4 ? 4 : hasQ3 ? 3 : hasQ2 ? 2 : 1;
        setNumQuestionsShown(nShown);
      }
    }

    loadFromSupabase();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id, user?.id]);

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

  const updateDiagnosticOption3 = (index: number, value: string) => {
    const nextOptions = [...answers.diagnosticOptions3];
    nextOptions[index] = value;
    updateAnswer('diagnosticOptions3', nextOptions);
  };

  const updateDiagnosticOption4 = (index: number, value: string) => {
    const nextOptions = [...answers.diagnosticOptions4];
    nextOptions[index] = value;
    updateAnswer('diagnosticOptions4', nextOptions);
  };

  const updateDiagnosticOption5 = (index: number, value: string) => {
    const nextOptions = [...answers.diagnosticOptions5];
    nextOptions[index] = value;
    updateAnswer('diagnosticOptions5', nextOptions);
  };

  const removeQuestion = (n: number) => {
    setNumQuestionsShown(n - 1);
    if (n === 2) { updateAnswer('diagnosticQuestion2', ''); updateAnswer('diagnosticOptions2', ['', '', '']); }
    if (n === 3) { updateAnswer('diagnosticQuestion3', ''); updateAnswer('diagnosticOptions3', ['', '', '']); }
    if (n === 4) { updateAnswer('diagnosticQuestion4', ''); updateAnswer('diagnosticOptions4', ['', '', '']); }
    if (n === 5) { updateAnswer('diagnosticQuestion5', ''); updateAnswer('diagnosticOptions5', ['', '', '']); }
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

            <div className="space-y-3 pt-2 border-t border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contato e redes sociais</p>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">WhatsApp <span className="text-destructive">*</span></label>
                <input
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={answers.whatsapp}
                  onChange={(e) => updateAnswer('whatsapp', e.target.value)}
                  placeholder="5511999999999 (com DDD, sem espaços)"
                  type="tel"
                />
                <p className="text-xs text-muted-foreground">Usado no botão do WhatsApp da página pública.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Instagram</label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={answers.instagram}
                    onChange={(e) => updateAnswer('instagram', e.target.value)}
                    placeholder="@seuhandle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">TikTok <span className="text-muted-foreground text-xs">(opcional)</span></label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={answers.tiktok}
                    onChange={(e) => updateAnswer('tiktok', e.target.value)}
                    placeholder="@seuhandle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">YouTube <span className="text-muted-foreground text-xs">(opcional)</span></label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={answers.youtube}
                    onChange={(e) => updateAnswer('youtube', e.target.value)}
                    placeholder="https://youtube.com/@canal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink">Site <span className="text-muted-foreground text-xs">(opcional)</span></label>
                  <input
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={answers.site}
                    onChange={(e) => updateAnswer('site', e.target.value)}
                    placeholder="https://seusite.com.br"
                  />
                </div>
              </div>
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

            {/* Perguntas adicionais (2-5) */}
            {([
              { n: 2, question: answers.diagnosticQuestion2, options: answers.diagnosticOptions2, updateQ: (v: string) => updateAnswer('diagnosticQuestion2', v), updateO: updateDiagnosticOption2, prevQuestion: answers.diagnosticQuestion },
              { n: 3, question: answers.diagnosticQuestion3, options: answers.diagnosticOptions3, updateQ: (v: string) => updateAnswer('diagnosticQuestion3', v), updateO: updateDiagnosticOption3, prevQuestion: answers.diagnosticQuestion2 },
              { n: 4, question: answers.diagnosticQuestion4, options: answers.diagnosticOptions4, updateQ: (v: string) => updateAnswer('diagnosticQuestion4', v), updateO: updateDiagnosticOption4, prevQuestion: answers.diagnosticQuestion3 },
              { n: 5, question: answers.diagnosticQuestion5, options: answers.diagnosticOptions5, updateQ: (v: string) => updateAnswer('diagnosticQuestion5', v), updateO: updateDiagnosticOption5, prevQuestion: answers.diagnosticQuestion4 },
            ] as const).map(({ n, question, options, updateQ, updateO, prevQuestion }) => (
              numQuestionsShown >= n ? (
                <div key={n} className="space-y-3 p-4 rounded-2xl border border-border bg-surface/50">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pergunta {n}</p>
                    {n === numQuestionsShown && (
                      <button type="button" onClick={() => removeQuestion(n)} className="text-xs text-destructive hover:underline cursor-pointer">
                        Remover
                      </button>
                    )}
                  </div>
                  <input
                    className={inputClass}
                    value={question}
                    onChange={(e) => updateQ(e.target.value)}
                    placeholder="Ex: Qual é o seu nível de experiência?"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Opções de resposta</p>
                    {options.map((option, index) => (
                      <input
                        key={index}
                        className={inputClass}
                        value={option}
                        onChange={(e) => updateO(index, e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                numQuestionsShown === n - 1 && prevQuestion?.trim() && numQuestionsShown < 5 ? (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNumQuestionsShown(n)}
                    className="w-full py-2.5 rounded-2xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    + Adicionar pergunta {n} <span className="text-xs opacity-60">(máx. 5)</span>
                  </button>
                ) : null
              )
            ))}
          </div>
        );
      }

      case 'conversion': {
        const destOptions: { value: string; label: string; buttonDefault: string }[] = [
          { value: 'whatsapp', label: 'WhatsApp', buttonDefault: 'Falar no WhatsApp' },
          { value: 'agenda', label: 'Agenda', buttonDefault: 'Agendar agora' },
          { value: 'formulario', label: 'Formulário', buttonDefault: 'Preencher formulário' },
          { value: 'checkout', label: 'Checkout', buttonDefault: 'Comprar agora' },
        ];

        const ctaFieldLabel: Record<string, string> = {
          whatsapp: 'Mensagem de abertura',
          agenda: 'Link da agenda (Calendly, Cal.com, etc.)',
          formulario: 'Link do formulário',
          checkout: 'Link do checkout',
        };

        const ctaFieldPlaceholder: Record<string, string> = {
          whatsapp: 'Ex: Olá! Acabei de fazer o diagnóstico e gostaria de saber mais.',
          agenda: 'https://calendly.com/seuperfil',
          formulario: 'https://forms.google.com/...',
          checkout: 'https://pay.hotmart.com/...',
        };

        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Destino final do CTA</label>
              <div className="grid grid-cols-2 gap-3">
                {destOptions.map(({ value, label, buttonDefault }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAnswers(prev => ({
                      ...prev,
                      conversionDestination: value,
                      buttonText: buttonDefault,
                      conversionMessage: value === 'whatsapp' ? '' : '',
                    }))}
                    className={`p-3 rounded-xl border-2 text-center cursor-pointer text-sm font-medium ${answers.conversionDestination === value ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface hover:border-primary/50 text-ink'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {answers.conversionDestination === 'whatsapp' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink">Número do WhatsApp</label>
                <input
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={answers.whatsapp}
                  onChange={(e) => updateAnswer('whatsapp', e.target.value)}
                  placeholder="5511999999999 (com DDD, sem espaços)"
                  type="tel"
                />
                <p className="text-xs text-muted-foreground">Sincronizado com o número informado na identidade.</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">
                {ctaFieldLabel[answers.conversionDestination] ?? 'Destino do CTA'}
              </label>
              {answers.conversionDestination === 'whatsapp' ? (
                <textarea
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 h-24"
                  value={answers.conversionMessage}
                  onChange={(e) => updateAnswer('conversionMessage', e.target.value)}
                  placeholder={ctaFieldPlaceholder.whatsapp}
                />
              ) : (
                <input
                  className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={answers.conversionMessage}
                  onChange={(e) => updateAnswer('conversionMessage', e.target.value)}
                  placeholder={ctaFieldPlaceholder[answers.conversionDestination] ?? ''}
                  type="url"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Texto do botão final</label>
              <input
                className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={answers.buttonText}
                onChange={(e) => updateAnswer('buttonText', e.target.value)}
              />
            </div>
          </div>
        );
      }

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
                { label: 'Diagnostico', value: (() => { const n = [answers.diagnosticQuestion, answers.diagnosticQuestion2, answers.diagnosticQuestion3, answers.diagnosticQuestion4, answers.diagnosticQuestion5].filter(q => q?.trim()).length; return n > 0 ? `${n} pergunta${n > 1 ? 's' : ''}` : 'Pendente'; })() },
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
                    { q: answers.diagnosticQuestion, opts: answers.diagnosticOptions },
                    { q: answers.diagnosticQuestion2, opts: answers.diagnosticOptions2 },
                    { q: answers.diagnosticQuestion3, opts: answers.diagnosticOptions3 },
                    { q: answers.diagnosticQuestion4, opts: answers.diagnosticOptions4 },
                    { q: answers.diagnosticQuestion5, opts: answers.diagnosticOptions5 },
                  ]
                    .filter(({ q }) => q?.trim())
                    .map(({ q, opts }) => ({ question: q, options: opts.filter(Boolean) } as unknown as PublicSmartBioData['quizQuestions'][0])),
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
