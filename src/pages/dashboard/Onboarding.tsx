import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, Loader2, Eye, X, Check, Plus } from 'lucide-react';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
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

// ── Passos do assistente ──────────────────────────────────────────────────────
// Um assunto por tela, linguagem simples, sem jargão.

type StepDef = {
  id: string;
  type: 'who' | 'about' | 'contacts' | 'objective' | 'audience' | 'offer' | 'quiz' | 'conversion' | 'style' | 'review';
  title: string;
  subtitle: string;
};

const STEPS: StepDef[] = [
  {
    id: 'who',
    type: 'who',
    title: 'Como você quer aparecer?',
    subtitle: 'Sua foto e seu nome ficam no topo da página, como no seu perfil do Instagram.',
  },
  {
    id: 'about',
    type: 'about',
    title: 'O que você faz?',
    subtitle: 'Escreva como se estivesse explicando para um cliente: o que você faz e para quem.',
  },
  {
    id: 'contacts',
    type: 'contacts',
    title: 'Como falam com você?',
    subtitle: 'O WhatsApp é por onde seus clientes vão chegar. As redes sociais aparecem como botões na página.',
  },
  {
    id: 'objective',
    type: 'objective',
    title: 'O que essa página deve fazer por você?',
    subtitle: 'Escolha o resultado mais importante. A página inteira será montada em torno disso.',
  },
  {
    id: 'audience',
    type: 'audience',
    title: 'Quem é o seu cliente?',
    subtitle: 'Pense na pessoa que costuma te chamar no WhatsApp. Quanto mais real a descrição, melhor a página fica.',
  },
  {
    id: 'offer',
    type: 'offer',
    title: 'O que você vende ou oferece?',
    subtitle: 'Comece pelo principal — depois você pode adicionar outros produtos e serviços.',
  },
  {
    id: 'quiz',
    type: 'quiz',
    title: 'Perguntas para conhecer o visitante',
    subtitle: 'Sua página faz essas perguntas a quem chega e recomenda a opção certa para cada pessoa. Já deixamos um exemplo pronto — pode usar assim mesmo.',
  },
  {
    id: 'conversion',
    type: 'conversion',
    title: 'Para onde o visitante vai no final?',
    subtitle: 'Depois de responder às perguntas, o visitante toca em um botão. Escolha o que acontece.',
  },
  {
    id: 'style',
    type: 'style',
    title: 'Deixe com a sua cara',
    subtitle: 'Escolha as cores da página. Dá para mudar quando quiser.',
  },
  {
    id: 'review',
    type: 'review',
    title: 'Tudo pronto. Vamos revisar?',
    subtitle: 'Confira se está tudo certo. Depois você ainda vê a página pronta antes de publicar.',
  },
];

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

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 placeholder:text-muted-foreground/60';

function Field({
  label,
  hint,
  optional,
  children,
}: {
  label: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-ink flex items-center gap-2">
        {label}
        {optional && <span className="text-xs font-normal text-muted-foreground">(se quiser)</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
    </div>
  );
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
  const [showMoreSocial, setShowMoreSocial] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { tenant, user } = useAuth();
  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  // A página já foi gerada/publicada? Então isto é uma edição, não uma criação.
  useEffect(() => {
    if (!tenant?.id) return;
    supabase
      .from('smartbios')
      .select('status')
      .eq('tenant_id', tenant.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        const s = data?.status;
        if (s === 'published' || s === 'preview_pending_approval') setIsEditMode(true);
      });
  }, [tenant?.id]);

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

  // Ao trocar de passo, volta o scroll para o topo do conteúdo
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  const updateAnswer = <Key extends keyof OnboardingDraftAnswers>(key: Key, value: OnboardingDraftAnswers[Key]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  // Validação leve por passo: só o essencial é obrigatório
  const stepBlockReason = (() => {
    if (step.type === 'who' && !answers.brandName.trim()) {
      return 'Preencha seu nome ou o nome da sua marca para continuar.';
    }
    if (step.type === 'contacts' && !answers.whatsapp.trim()) {
      return 'Informe seu WhatsApp — é por ele que seus clientes vão falar com você.';
    }
    return null;
  })();

  const handleNext = async () => {
    setErrorMessage(null);
    if (stepBlockReason) return;

    if (!isLastStep) {
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
      setErrorMessage(`Erro ao gerar sua página: ${extractMessage(error)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    }
  };

  const updateOptionAt = (key: 'diagnosticOptions' | 'diagnosticOptions2' | 'diagnosticOptions3' | 'diagnosticOptions4' | 'diagnosticOptions5', index: number, value: string) => {
    const next = [...answers[key]];
    next[index] = value;
    updateAnswer(key, next);
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

  // ── Conteúdo de cada passo ─────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step.type) {
      case 'who':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
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
                className="w-28 h-28 rounded-full bg-surface border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors shrink-0 overflow-hidden relative"
              >
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="Sua foto" className="w-full h-full object-cover" />
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isUploadingAvatar ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7 mb-1" />}
                    {!isUploadingAvatar && <span className="text-xs font-medium">Adicionar foto</span>}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary font-medium hover:underline"
              >
                {avatarPreview ? 'Trocar foto' : 'Escolher da galeria'}
              </button>
            </div>

            <Field
              label="Seu nome ou o nome da sua marca"
              hint="É o título da sua página. Ex: Ana Souza, Studio Bella, Clínica Vida."
            >
              <input
                className={inputClass}
                value={answers.brandName}
                onChange={(event) => updateAnswer('brandName', event.target.value)}
                placeholder="Ex: Ana Souza Consultoria"
                autoFocus
              />
            </Field>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <Field
              label="Descreva o que você faz em uma ou duas frases"
              hint="Essa frase aparece logo abaixo do seu nome, como a bio do Instagram."
            >
              <textarea
                className={`${inputClass} min-h-[110px] resize-none`}
                value={answers.shortBio}
                onChange={(event) => updateAnswer('shortBio', event.target.value)}
                placeholder="Ex: Ajudo mulheres a se sentirem confiantes com roupas sob medida. Atendo em Goiânia e envio para todo o Brasil."
              />
            </Field>
            <Field
              label="Qual é a sua área?"
              hint="Ex: moda feminina, odontologia, imóveis, comida saudável, estética..."
            >
              <input
                className={inputClass}
                value={answers.niche}
                onChange={(event) => updateAnswer('niche', event.target.value)}
                placeholder="Ex: moda feminina"
              />
            </Field>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-6">
            <Field
              label="Seu WhatsApp"
              hint="Digite com DDD, só números. Ex: 62999465725. É para ele que os clientes serão enviados."
            >
              <input
                className={inputClass}
                value={answers.whatsapp}
                onChange={(e) => updateAnswer('whatsapp', e.target.value)}
                placeholder="62999999999"
                type="tel"
                inputMode="numeric"
              />
            </Field>

            <Field label="Seu Instagram" optional>
              <input
                className={inputClass}
                value={answers.instagram}
                onChange={(e) => updateAnswer('instagram', e.target.value)}
                placeholder="@seuperfil"
              />
            </Field>

            {!showMoreSocial ? (
              <button
                type="button"
                onClick={() => setShowMoreSocial(true)}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> Adicionar TikTok, YouTube ou site
              </button>
            ) : (
              <div className="space-y-4 p-4 rounded-2xl bg-surface border border-border">
                <Field label="TikTok" optional>
                  <input
                    className={inputClass}
                    value={answers.tiktok}
                    onChange={(e) => updateAnswer('tiktok', e.target.value)}
                    placeholder="@seuperfil"
                  />
                </Field>
                <Field label="YouTube" optional>
                  <input
                    className={inputClass}
                    value={answers.youtube}
                    onChange={(e) => updateAnswer('youtube', e.target.value)}
                    placeholder="https://youtube.com/@seucanal"
                  />
                </Field>
                <Field label="Site" optional>
                  <input
                    className={inputClass}
                    value={answers.site}
                    onChange={(e) => updateAnswer('site', e.target.value)}
                    placeholder="https://seusite.com.br"
                  />
                </Field>
              </div>
            )}
          </div>
        );

      case 'objective':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { value: 'Vender uma oferta', label: 'Vender', desc: 'Levar o visitante direto para a compra' },
                { value: 'Captar leads', label: 'Receber contatos', desc: 'Guardar nome e interesse de quem visita' },
                { value: 'Qualificar interessados', label: 'Filtrar interessados', desc: 'Saber o que cada visitante procura' },
                { value: 'Agendar atendimento', label: 'Agendar horários', desc: 'Receber pedidos de agendamento' },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateAnswer('objective', value)}
                  className={`p-4 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
                    answers.objective === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-surface hover:border-primary/40'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${answers.objective === value ? 'text-primary' : 'text-ink'}`}>{label}</span>
                    {answers.objective === value && <Check className="w-4 h-4 text-primary" />}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</span>
                </button>
              ))}
            </div>
            <Field label="Ou escreva com suas palavras" optional>
              <input
                className={inputClass}
                value={answers.objective}
                onChange={(e) => updateAnswer('objective', e.target.value)}
                placeholder="Ex: quero agendar consultas para meu consultório"
              />
            </Field>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-6">
            <Field
              label="Quem costuma te procurar?"
              hint="Ex: mulheres de 30 a 50 anos que querem emagrecer com saúde."
            >
              <input
                className={inputClass}
                value={answers.audience}
                onChange={(event) => updateAnswer('audience', event.target.value)}
                placeholder="Ex: noivas procurando vestido sob medida"
              />
            </Field>
            <Field
              label="Qual é a maior dúvida ou dificuldade dessa pessoa?"
              hint="É o que ela está sentindo quando chega na sua página."
            >
              <input
                className={inputClass}
                value={answers.pain}
                onChange={(event) => updateAnswer('pain', event.target.value)}
                placeholder="Ex: não sabe qual modelo combina com o corpo dela"
              />
            </Field>
          </div>
        );

      case 'offer':
        return (
          <div className="space-y-6">
            <Field
              label="Nome do seu principal produto ou serviço"
              hint="É o que a página vai recomendar para os visitantes."
            >
              <input
                className={inputClass}
                value={answers.offerTitle}
                onChange={(event) => updateAnswer('offerTitle', event.target.value)}
                placeholder="Ex: Consulta de avaliação, Vestido sob medida, Plano mensal"
              />
            </Field>
            <Field
              label="Explique em poucas frases o que ele resolve"
              hint="Escreva como você explicaria para um cliente no WhatsApp."
            >
              <textarea
                className={`${inputClass} min-h-[120px] resize-none`}
                value={answers.offerDescription}
                onChange={(event) => updateAnswer('offerDescription', event.target.value)}
                placeholder="Ex: Uma conversa de 30 minutos onde eu entendo o que você precisa e monto um plano personalizado."
              />
            </Field>
          </div>
        );

      case 'quiz': {
        const questionBlocks = [
          { n: 1, question: answers.diagnosticQuestion, optKey: 'diagnosticOptions' as const, options: answers.diagnosticOptions, qKey: 'diagnosticQuestion' as const },
          { n: 2, question: answers.diagnosticQuestion2, optKey: 'diagnosticOptions2' as const, options: answers.diagnosticOptions2, qKey: 'diagnosticQuestion2' as const },
          { n: 3, question: answers.diagnosticQuestion3, optKey: 'diagnosticOptions3' as const, options: answers.diagnosticOptions3, qKey: 'diagnosticQuestion3' as const },
          { n: 4, question: answers.diagnosticQuestion4, optKey: 'diagnosticOptions4' as const, options: answers.diagnosticOptions4, qKey: 'diagnosticQuestion4' as const },
          { n: 5, question: answers.diagnosticQuestion5, optKey: 'diagnosticOptions5' as const, options: answers.diagnosticOptions5, qKey: 'diagnosticQuestion5' as const },
        ];

        return (
          <div className="space-y-5">
            {questionBlocks.map(({ n, question, optKey, options, qKey }) => {
              if (n > numQuestionsShown) {
                const prev = questionBlocks[n - 2];
                const canAdd = n === numQuestionsShown + 1 && prev.question?.trim();
                return canAdd ? (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNumQuestionsShown(n)}
                    className="w-full py-3 rounded-2xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Adicionar outra pergunta
                  </button>
                ) : null;
              }
              return (
                <div key={n} className="space-y-3 p-4 sm:p-5 rounded-2xl border border-border bg-surface">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Pergunta {n}</p>
                    {n > 1 && n === numQuestionsShown && (
                      <button type="button" onClick={() => removeQuestion(n)} className="text-xs text-destructive hover:underline cursor-pointer">
                        Remover
                      </button>
                    )}
                  </div>
                  <input
                    className={inputClass}
                    value={question}
                    onChange={(e) => updateAnswer(qKey, e.target.value)}
                    placeholder="Ex: O que você está procurando hoje?"
                  />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Respostas que o visitante pode escolher</p>
                    {options.map((option, index) => (
                      <input
                        key={index}
                        className={inputClass}
                        value={option}
                        onChange={(e) => updateOptionAt(optKey, index, e.target.value)}
                        placeholder={`Resposta ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      case 'conversion': {
        const destOptions: { value: string; label: string; desc: string; buttonDefault: string }[] = [
          { value: 'whatsapp', label: 'WhatsApp', desc: 'O visitante abre uma conversa com você', buttonDefault: 'Falar no WhatsApp' },
          { value: 'agenda', label: 'Agenda', desc: 'O visitante marca um horário', buttonDefault: 'Agendar agora' },
          { value: 'formulario', label: 'Formulário', desc: 'O visitante preenche seus dados', buttonDefault: 'Preencher formulário' },
          { value: 'checkout', label: 'Página de compra', desc: 'O visitante vai direto para pagar', buttonDefault: 'Comprar agora' },
        ];

        const ctaFieldLabel: Record<string, string> = {
          whatsapp: 'Mensagem que o visitante já vai enviar pronta',
          agenda: 'Link da sua agenda (Calendly, Cal.com...)',
          formulario: 'Link do seu formulário',
          checkout: 'Link da página de compra',
        };

        const ctaFieldPlaceholder: Record<string, string> = {
          whatsapp: 'Ex: Olá! Vim pela sua página e quero saber mais.',
          agenda: 'https://calendly.com/seuperfil',
          formulario: 'https://forms.google.com/...',
          checkout: 'https://pay.hotmart.com/...',
        };

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destOptions.map(({ value, label, desc, buttonDefault }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAnswers(prev => ({
                    ...prev,
                    conversionDestination: value,
                    buttonText: buttonDefault,
                  }))}
                  className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-colors ${
                    answers.conversionDestination === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-surface hover:border-primary/40'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${answers.conversionDestination === value ? 'text-primary' : 'text-ink'}`}>{label}</span>
                    {answers.conversionDestination === value && <Check className="w-4 h-4 text-primary" />}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</span>
                </button>
              ))}
            </div>

            <Field label={ctaFieldLabel[answers.conversionDestination] ?? 'Destino do botão'}>
              {answers.conversionDestination === 'whatsapp' ? (
                <textarea
                  className={`${inputClass} h-24 resize-none`}
                  value={answers.conversionMessage}
                  onChange={(e) => updateAnswer('conversionMessage', e.target.value)}
                  placeholder={ctaFieldPlaceholder.whatsapp}
                />
              ) : (
                <input
                  className={inputClass}
                  value={answers.conversionMessage}
                  onChange={(e) => updateAnswer('conversionMessage', e.target.value)}
                  placeholder={ctaFieldPlaceholder[answers.conversionDestination] ?? ''}
                  type="url"
                />
              )}
            </Field>

            <Field label="Texto do botão" hint="É o botão que o visitante toca no final.">
              <input
                className={inputClass}
                value={answers.buttonText}
                onChange={(e) => updateAnswer('buttonText', e.target.value)}
              />
            </Field>
          </div>
        );
      }

      case 'style':
        return (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-ink">Fundo da página</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => updateAnswer('theme', 'light')} className={`p-5 rounded-2xl border-2 ${answers.theme === 'light' ? 'border-primary ring-2 ring-primary/20' : 'border-border'} bg-white cursor-pointer flex flex-col items-center gap-2`}>
                  <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm" />
                  <span className="text-sm font-bold text-neutral-900">Claro</span>
                </button>
                <button type="button" onClick={() => updateAnswer('theme', 'dark')} className={`p-5 rounded-2xl border-2 ${answers.theme === 'dark' ? 'border-primary ring-2 ring-primary/20' : 'border-border'} bg-neutral-900 cursor-pointer flex flex-col items-center gap-2`}>
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700" />
                  <span className="text-sm font-bold text-white">Escuro</span>
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-ink">Cor da sua marca</label>
              <div className="flex gap-3 flex-wrap">
                {['#000000', '#2563EB', '#16A34A', '#D97706', '#DB2777', '#7C3AED', '#DC2626'].map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={color}
                    onClick={() => updateAnswer('accentColor', color)}
                    className={`w-11 h-11 rounded-full cursor-pointer transition-all hover:scale-110 ${answers.accentColor.toUpperCase() === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="color"
                  value={answers.accentColor}
                  onChange={(e) => updateAnswer('accentColor', e.target.value)}
                  className="w-12 h-12 rounded-xl border border-border cursor-pointer p-1 bg-transparent shrink-0"
                  title="Escolher outra cor"
                />
                <p className="text-xs text-muted-foreground">
                  Não achou a sua cor? Toque no quadrado para escolher qualquer uma.
                </p>
              </div>
            </div>
          </div>
        );

      case 'review': {
        const numQuestions = [answers.diagnosticQuestion, answers.diagnosticQuestion2, answers.diagnosticQuestion3, answers.diagnosticQuestion4, answers.diagnosticQuestion5].filter(q => q?.trim()).length;
        const destLabels: Record<string, string> = {
          whatsapp: 'WhatsApp', agenda: 'Agenda', formulario: 'Formulário', checkout: 'Página de compra',
        };
        const reviewItems = [
          { label: 'Nome', value: answers.brandName || '— preencher', ok: Boolean(answers.brandName.trim()), goTo: 0 },
          { label: 'O que você faz', value: answers.shortBio || 'A plataforma escreve para você', ok: true, goTo: 1 },
          { label: 'WhatsApp', value: answers.whatsapp || '— preencher', ok: Boolean(answers.whatsapp.trim()), goTo: 2 },
          { label: 'Objetivo', value: answers.objective, ok: true, goTo: 3 },
          { label: 'Produto ou serviço', value: answers.offerTitle || 'A plataforma monta um exemplo inicial', ok: true, goTo: 5 },
          { label: 'Perguntas do quiz', value: `${numQuestions} pergunta${numQuestions !== 1 ? 's' : ''}`, ok: numQuestions > 0, goTo: 6 },
          { label: 'Botão final', value: `${answers.buttonText} → ${destLabels[answers.conversionDestination] ?? answers.conversionDestination}`, ok: true, goTo: 7 },
          { label: 'Aparência', value: answers.theme === 'light' ? 'Fundo claro' : 'Fundo escuro', ok: true, goTo: 8 },
        ];

        return (
          <div className="space-y-3">
            {reviewItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => setCurrentStep(item.goTo)}
                className="w-full p-4 rounded-2xl border border-border bg-surface flex items-center justify-between gap-3 text-left hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-bold text-ink truncate">{item.value}</p>
                </div>
                <span className={`text-xs font-medium shrink-0 ${item.ok ? 'text-success' : 'text-warning'}`}>
                  {item.ok ? <Check className="w-4 h-4" /> : 'revisar'}
                </span>
              </button>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Toque em qualquer item para voltar e ajustar.
            </p>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ── Preview data ───────────────────────────────────────────────────────────

  const previewData = {
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
  };

  const progressPct = Math.round(((currentStep + 1) / STEPS.length) * 100);
  const finalButtonLabel = isEditMode ? 'Salvar e ver como ficou' : 'Criar minha página';
  const generatingLabel = isEditMode ? 'Salvando...' : 'Montando sua página...';

  // ── Layout ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Barra superior */}
      <header className="h-14 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2 font-heading font-bold text-ink">
          <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">SB</div>
          <span className="hidden sm:inline">SmartBio</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs text-muted-foreground transition-opacity duration-500 ${draftSaved ? 'opacity-100' : 'opacity-0'}`}>
            Salvo ✓
          </span>
          <Link
            to="/app"
            className="text-sm text-muted-foreground hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{isEditMode ? 'Sair da edição' : 'Continuar depois'}</span>
          </Link>
        </div>
      </header>

      {/* Barra de progresso */}
      <div className="shrink-0 bg-surface border-b border-border px-4 sm:px-6 py-3 sticky top-14 z-30">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <p className="text-xs font-bold text-primary whitespace-nowrap">
            Passo {currentStep + 1} de {STEPS.length}
          </p>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-5xl flex gap-10 items-start">

          {/* Coluna do formulário */}
          <div className="flex-1 max-w-xl mx-auto lg:mx-0" ref={contentRef}>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ink leading-tight">{step.title}</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2 leading-relaxed">{step.subtitle}</p>
            </div>

            {renderStepContent()}

            {/* Erros e navegação — barra fixa no mobile, inline no desktop */}
            <div className="mt-8 pb-32 lg:pb-8">
              <div className="fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border p-3 space-y-2 lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:space-y-3">
                {errorMessage && (
                  <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
                    {errorMessage}
                  </p>
                )}
                {stepBlockReason && (
                  <p className="text-xs text-muted-foreground text-center">{stepBlockReason}</p>
                )}
                <div className="flex items-center gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 px-4 sm:px-5 shrink-0"
                      onClick={handlePrev}
                      disabled={isGenerating}
                      aria-label="Voltar"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline sm:ml-2">Voltar</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-xl h-12 px-4 shrink-0 lg:hidden"
                    onClick={() => setShowMobilePreview(true)}
                    disabled={isGenerating}
                    aria-label="Ver prévia da página"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    className="flex-1 rounded-xl h-12 bg-primary text-primary-foreground text-base font-bold"
                    onClick={handleNext}
                    disabled={isGenerating || Boolean(stepBlockReason)}
                  >
                    {isLastStep ? (
                      isGenerating ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {generatingLabel}</>
                      ) : (
                        finalButtonLabel
                      )
                    ) : (
                      <>Continuar <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview — desktop */}
          <div className="hidden lg:flex w-[340px] shrink-0 flex-col items-center sticky top-32">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Sua página vai ficando pronta
            </p>
            <div className="transform scale-[0.85] origin-top">
              <SmartBioPreviewMock data={previewData} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay de preview — mobile */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setShowMobilePreview(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center"
            aria-label="Fechar prévia"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-4">
            Assim está a sua página
          </p>
          <div className="transform scale-[0.85] origin-top max-h-[80vh]">
            <SmartBioPreviewMock data={previewData} />
          </div>
        </div>
      )}
    </div>
  );
}
