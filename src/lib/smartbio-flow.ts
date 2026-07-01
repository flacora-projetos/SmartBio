import { supabase } from '@/lib/supabase';
import type { AppTenant } from '@/lib/tenant';
import type { PublicSmartBioData, SmartBioStatus } from '@/types';

export type WorkspaceSmartBio = {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  short_bio: string | null;
  status: 'draft' | 'generating' | 'preview_pending_approval' | 'published' | 'archived';
  public_config: Record<string, unknown>;
  theme_config: Record<string, unknown>;
  tracking_config: Record<string, unknown>;
  published_at: string | null;
  social_links: Record<string, string>;
};

export type WorkspaceReadiness = {
  hasIdentity: boolean;
  hasOffers: boolean;
  hasQuiz: boolean;
  hasRules: boolean;
  hasPreview: boolean;
  canApprove: boolean;
};

export type WorkspaceCounts = {
  offers: number;
  activeOffers: number;
  questions: number;
  rules: number;
};

export type WorkspaceState = {
  smartbio: WorkspaceSmartBio;
  status: SmartBioStatus;
  readiness: WorkspaceReadiness;
  counts: WorkspaceCounts;
  publicUrl: string;
  previewData: PublicSmartBioData;
};

export type OnboardingDraftAnswers = {
  brandName: string;
  shortBio: string;
  niche: string;
  // Redes sociais / ativos de contato
  whatsapp: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  site: string;
  // Público e objetivo
  objective: string;
  audience: string;
  pain: string;
  // Oferta principal
  offerTitle: string;
  offerDescription: string;
  // Diagnóstico — até 5 perguntas
  diagnosticTitle: string;
  diagnosticQuestion: string;
  diagnosticOptions: string[];
  diagnosticQuestion2: string;
  diagnosticOptions2: string[];
  diagnosticQuestion3: string;
  diagnosticOptions3: string[];
  diagnosticQuestion4: string;
  diagnosticOptions4: string[];
  diagnosticQuestion5: string;
  diagnosticOptions5: string[];
  // Conversão
  conversionDestination: string;
  buttonText: string;
  conversionMessage: string;
  // Estilo
  theme: 'light' | 'dark';
  accentColor: string;
  avatarUrl?: string;
};

function toAppStatus(status: WorkspaceSmartBio['status']): SmartBioStatus {
  if (status === 'draft') return 'onboarding_pending';
  if (status === 'archived') return 'onboarding_pending';
  return status;
}

function slugFromTenant(tenant: AppTenant) {
  return tenant.slug || `smartbio-${tenant.id.slice(0, 8)}`;
}

function slugFromBrandName(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
  return base || 'smartbio';
}

export async function getOrCreateWorkspaceSmartBio(tenant: AppTenant): Promise<WorkspaceSmartBio> {
  const { data: existing, error: selectError } = await supabase
    .from('smartbios')
    .select('id, tenant_id, title, slug, short_bio, status, public_config, theme_config, tracking_config, published_at, social_links')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing as WorkspaceSmartBio;

  const { data: created, error: insertError } = await supabase
    .from('smartbios')
    .insert({
      tenant_id: tenant.id,
      title: tenant.name,
      slug: slugFromTenant(tenant),
      short_bio: null,
      status: 'draft',
      public_config: {},
      theme_config: { tone: 'clean', accent: '#0A0A0A' },
    })
    .select('id, tenant_id, title, slug, short_bio, status, public_config, theme_config, tracking_config, published_at, social_links')
    .single();

  if (insertError) throw insertError;
  return created as WorkspaceSmartBio;
}

async function getCounts(tenantId: string, smartbioId: string): Promise<WorkspaceCounts> {
  const [offers, activeOffers, questions, rules] = await Promise.all([
    supabase.from('offers').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('smartbio_id', smartbioId),
    supabase.from('offers').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('smartbio_id', smartbioId).eq('status', 'active'),
    supabase.from('quiz_questions').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('smartbio_id', smartbioId).eq('status', 'active'),
    supabase.from('recommendation_rules').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('smartbio_id', smartbioId).eq('status', 'active'),
  ]);

  const errors = [offers.error, activeOffers.error, questions.error, rules.error].filter(Boolean);
  if (errors[0]) throw errors[0];

  return {
    offers: offers.count ?? 0,
    activeOffers: activeOffers.count ?? 0,
    questions: questions.count ?? 0,
    rules: rules.count ?? 0,
  };
}

export async function readWorkspaceState(tenant: AppTenant): Promise<WorkspaceState> {
  const smartbio = await getOrCreateWorkspaceSmartBio(tenant);
  const counts = await getCounts(tenant.id, smartbio.id);

  const readiness: WorkspaceReadiness = {
    hasIdentity: Boolean(smartbio.title && smartbio.short_bio),
    hasOffers: counts.activeOffers > 0,
    hasQuiz: counts.questions > 0,
    hasRules: counts.rules > 0,
    hasPreview: smartbio.status === 'preview_pending_approval' || smartbio.status === 'published',
    canApprove: false,
  };
  readiness.canApprove = readiness.hasIdentity && readiness.hasOffers && readiness.hasQuiz && readiness.hasRules && readiness.hasPreview;

  const status = readiness.canApprove ? toAppStatus(smartbio.status) : 'onboarding_pending';

  return {
    smartbio,
    status,
    readiness,
    counts,
    publicUrl: `${window.location.origin}/s/${smartbio.slug}`,
    previewData: {
      tenantName: tenant.name,
      title: smartbio.title,
      bio: smartbio.short_bio,
      theme: 'light',
      avatarUrl: (smartbio.public_config?.avatarUrl as string | null) ?? null,
      socialLinks: smartbio.social_links ?? {},
      offers: [],
      quizQuestions: [],
    },
  };
}

function clean(value: string | undefined, fallback: string) {
  const nextValue = value?.trim();
  return nextValue || fallback;
}

function createGeneratedBio(tenant: AppTenant, answers: OnboardingDraftAnswers) {
  const niche = clean(answers.niche, 'sua area');
  const audience = clean(answers.audience, 'visitantes interessados');
  const objective = clean(answers.objective, 'encontrar o proximo passo certo');

  return `${tenant.name} ajuda ${audience} em ${niche} a ${objective.toLowerCase()} com uma experiencia guiada e recomendacao clara.`;
}

type AiEnrichment = {
  shortBio?: string;
  diagnosticTitle?: string;
  diagnosticQuestion?: string;
  diagnosticOptions?: string[];
  recommendationReason?: string;
};

async function enrichWithAI(answers: OnboardingDraftAnswers): Promise<AiEnrichment> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-smartbio', {
      body: {
        brandName: answers.brandName,
        niche: answers.niche,
        objective: answers.objective,
        audience: answers.audience,
        pain: answers.pain,
        offerTitle: answers.offerTitle,
        offerDescription: answers.offerDescription,
        conversionDestination: answers.conversionDestination,
      },
    });

    if (error || !data || data.error) return {};

    return {
      shortBio: typeof data.shortBio === 'string' ? data.shortBio : undefined,
      diagnosticTitle: typeof data.diagnosticTitle === 'string' ? data.diagnosticTitle : undefined,
      diagnosticQuestion: typeof data.diagnosticQuestion === 'string' ? data.diagnosticQuestion : undefined,
      diagnosticOptions: Array.isArray(data.diagnosticOptions) && data.diagnosticOptions.length > 0 ? data.diagnosticOptions : undefined,
      recommendationReason: typeof data.recommendationReason === 'string' ? data.recommendationReason : undefined,
    };
  } catch {
    return {};
  }
}

async function saveOnboardingAnswers(tenantId: string, smartbioId: string, answers: OnboardingDraftAnswers) {
  const rows = [
    { step_id: 'step_identity', answer: { brandName: answers.brandName, shortBio: answers.shortBio, niche: answers.niche, avatarUrl: answers.avatarUrl || null, whatsapp: answers.whatsapp, instagram: answers.instagram, tiktok: answers.tiktok, youtube: answers.youtube, site: answers.site } },
    { step_id: 'step_objective', answer: { objective: answers.objective } },
    { step_id: 'step_audience', answer: { audience: answers.audience, pain: answers.pain } },
    { step_id: 'step_offers', answer: { title: answers.offerTitle, description: answers.offerDescription } },
    { step_id: 'step_diagnostic', answer: { title: answers.diagnosticTitle, question: answers.diagnosticQuestion, options: answers.diagnosticOptions, question2: answers.diagnosticQuestion2, options2: answers.diagnosticOptions2, question3: answers.diagnosticQuestion3, options3: answers.diagnosticOptions3, question4: answers.diagnosticQuestion4, options4: answers.diagnosticOptions4, question5: answers.diagnosticQuestion5, options5: answers.diagnosticOptions5 } },
    { step_id: 'step_conversion', answer: { destination: answers.conversionDestination, buttonText: answers.buttonText, message: answers.conversionMessage } },
    { step_id: 'step_style', answer: { theme: answers.theme, accentColor: answers.accentColor } },
  ].map((row) => ({
    tenant_id: tenantId,
    smartbio_id: smartbioId,
    ...row,
  }));

  const { error } = await supabase
    .from('onboarding_answers')
    .upsert(rows, { onConflict: 'tenant_id,smartbio_id,step_id' });

  if (error) throw error;
}

export async function generateInitialPreview(tenant: AppTenant, answers: OnboardingDraftAnswers) {
  const smartbio = await getOrCreateWorkspaceSmartBio(tenant);

  // Enriquecimento via IA — falha silenciosamente, nunca bloqueia o fluxo
  const ai = await enrichWithAI(answers);

  const brandName = clean(answers.brandName, tenant.name);
  const shortBio = ai.shortBio || clean(answers.shortBio, createGeneratedBio(tenant, answers));
  const offerTitle = clean(answers.offerTitle, 'Oferta principal');
  const offerDescription = clean(answers.offerDescription, 'Oferta inicial gerada a partir do onboarding. Deve ser revisada antes de publicar.');
  const diagnosticQuestion = ai.diagnosticQuestion || clean(answers.diagnosticQuestion, 'Qual resultado voce busca agora?');
  const rawOptions = ai.diagnosticOptions ?? answers.diagnosticOptions;
  const diagnosticOptions = rawOptions
    .map((option) => option.trim())
    .filter(Boolean)
    .slice(0, 5);
  const options = diagnosticOptions.length > 0
    ? diagnosticOptions
    : ['Entender melhor a solucao', 'Falar com a equipe', 'Comparar opcoes antes de decidir'];
  const aiDiagnosticTitle = ai.diagnosticTitle || answers.diagnosticTitle;

  await saveOnboardingAnswers(tenant.id, smartbio.id, answers);

  const { data: offer } = await supabase
    .from('offers')
    .select('id')
    .eq('tenant_id', tenant.id)
    .eq('smartbio_id', smartbio.id)
    .limit(1)
    .maybeSingle();

  let offerId = offer?.id as string | undefined;

  if (!offerId) {
    const { data: createdOffer, error: offerError } = await supabase
      .from('offers')
      .insert({
        tenant_id: tenant.id,
        smartbio_id: smartbio.id,
        title: offerTitle,
        description: offerDescription,
        objective: clean(answers.objective, 'Converter visitantes qualificados'),
        target_pain: clean(answers.pain, 'Visitante chega sem clareza sobre qual proximo passo tomar'),
        ideal_audience: clean(answers.audience, 'Pessoas interessadas na solucao apresentada'),
        maturity_level: 'inicial',
        format: 'diagnostico',
        recommended_cta: answers.conversionDestination,
        cta_destination: answers.conversionMessage,
        status: 'active',
        sort_order: 1,
      })
      .select('id')
      .single();

    if (offerError) throw offerError;
    offerId = createdOffer.id as string;
  } else {
    const { error: offerUpdateError } = await supabase
      .from('offers')
      .update({
        title: offerTitle,
        description: offerDescription,
        objective: clean(answers.objective, 'Converter visitantes qualificados'),
        target_pain: clean(answers.pain, 'Visitante chega sem clareza sobre qual proximo passo tomar'),
        ideal_audience: clean(answers.audience, 'Pessoas interessadas na solucao apresentada'),
        recommended_cta: answers.conversionDestination,
        cta_destination: answers.conversionMessage,
        status: 'active',
      })
      .eq('id', offerId);

    if (offerUpdateError) throw offerUpdateError;
  }

  const { count: questionCount, error: questionCountError } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .eq('smartbio_id', smartbio.id);

  if (questionCountError) throw questionCountError;

  if (!questionCount) {
    const { error: questionError } = await supabase
      .from('quiz_questions')
      .insert({
        tenant_id: tenant.id,
        smartbio_id: smartbio.id,
        question: diagnosticQuestion,
        type: 'single_choice',
        options,
        intention: 'Identificar o proximo passo de conversao',
        status: 'active',
        is_required: true,
        sort_order: 1,
      });

    if (questionError) throw questionError;
  } else {
    const { error: questionUpdateError } = await supabase
      .from('quiz_questions')
      .update({
        question: diagnosticQuestion,
        options,
        intention: clean(aiDiagnosticTitle, 'Identificar o proximo passo de conversao'),
        status: 'active',
      })
      .eq('tenant_id', tenant.id)
      .eq('smartbio_id', smartbio.id)
      .eq('sort_order', 1);

    if (questionUpdateError) throw questionUpdateError;
  }

  // Perguntas opcionais 2–5
  const q2Text = answers.diagnosticQuestion2.trim();
  if (q2Text) {
    const rawOptions2 = answers.diagnosticOptions2 ?? [];
    const options2 = rawOptions2.map((o) => o.trim()).filter(Boolean);
    const fallbackOptions2 = options2.length > 0 ? options2 : ['Opção A', 'Opção B', 'Opção C'];

    const { data: existingQ2 } = await supabase
      .from('quiz_questions')
      .select('id')
      .eq('tenant_id', tenant.id)
      .eq('smartbio_id', smartbio.id)
      .eq('sort_order', 2)
      .maybeSingle();

    if (!existingQ2) {
      await supabase.from('quiz_questions').insert({
        tenant_id: tenant.id,
        smartbio_id: smartbio.id,
        question: q2Text,
        type: 'single_choice',
        options: fallbackOptions2,
        intention: 'Complementar o diagnóstico',
        status: 'active',
        is_required: false,
        sort_order: 2,
      });
    } else {
      await supabase.from('quiz_questions').update({
        question: q2Text,
        options: fallbackOptions2,
        status: 'active',
      }).eq('id', existingQ2.id);
    }
  }

  // Perguntas 3–5 (mesmo padrão)
  const extraQuestions = [
    { text: answers.diagnosticQuestion3?.trim() ?? '', opts: answers.diagnosticOptions3 ?? [], order: 3 },
    { text: answers.diagnosticQuestion4?.trim() ?? '', opts: answers.diagnosticOptions4 ?? [], order: 4 },
    { text: answers.diagnosticQuestion5?.trim() ?? '', opts: answers.diagnosticOptions5 ?? [], order: 5 },
  ];

  for (const eq of extraQuestions) {
    if (!eq.text) continue;
    const cleanOpts = eq.opts.map(o => o.trim()).filter(Boolean);
    const fallback = cleanOpts.length > 0 ? cleanOpts : ['Opção A', 'Opção B', 'Opção C'];

    const { data: existing } = await supabase
      .from('quiz_questions').select('id')
      .eq('tenant_id', tenant.id).eq('smartbio_id', smartbio.id)
      .eq('sort_order', eq.order).maybeSingle();

    if (!existing) {
      await supabase.from('quiz_questions').insert({
        tenant_id: tenant.id, smartbio_id: smartbio.id,
        question: eq.text, type: 'single_choice', options: fallback,
        intention: 'Complementar o diagnóstico', status: 'active',
        is_required: false, sort_order: eq.order,
      });
    } else {
      await supabase.from('quiz_questions').update({
        question: eq.text, options: fallback, status: 'active',
      }).eq('id', existing.id);
    }
  }

  const { count: ruleCount, error: ruleCountError } = await supabase
    .from('recommendation_rules')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .eq('smartbio_id', smartbio.id);

  if (ruleCountError) throw ruleCountError;

  if (!ruleCount && offerId) {
    const { error: ruleError } = await supabase
      .from('recommendation_rules')
      .insert({
        tenant_id: tenant.id,
        smartbio_id: smartbio.id,
        name: 'Recomendacao inicial',
        description: 'Regra inicial gerada automaticamente para validar o funil.',
        condition: { answer_contains: options[0] },
        recommended_offer_id: offerId,
        recommendation_reason: ai.recommendationReason || `Pelo que voce respondeu, ${offerTitle} parece o melhor proximo passo.`,
        final_cta: clean(answers.buttonText, 'Falar com a equipe'),
        status: 'active',
      });

    if (ruleError) throw ruleError;
  } else if (offerId) {
    const { error: ruleUpdateError } = await supabase
      .from('recommendation_rules')
      .update({
        condition: { answer_contains: options[0] },
        recommended_offer_id: offerId,
        recommendation_reason: ai.recommendationReason || `Pelo que voce respondeu, ${offerTitle} parece o melhor proximo passo.`,
        final_cta: clean(answers.buttonText, 'Falar com a equipe'),
        status: 'active',
      })
      .eq('tenant_id', tenant.id)
      .eq('smartbio_id', smartbio.id);

    if (ruleUpdateError) throw ruleUpdateError;
  }

  // Página publicada mantém o slug: o link já pode estar na bio do Instagram
  // do cliente — mudar o nome da marca não pode quebrar a URL pública.
  const newSlug = smartbio.status === 'published' ? smartbio.slug : slugFromBrandName(brandName);

  // Monta social_links apenas com campos preenchidos
  const social_links: Record<string, string> = {};
  if (answers.whatsapp) social_links.whatsapp = answers.whatsapp.replace(/\D/g, '');
  if (answers.instagram) social_links.instagram = answers.instagram.replace('@', '');
  if (answers.tiktok) social_links.tiktok = answers.tiktok.replace('@', '');
  if (answers.youtube) social_links.youtube = answers.youtube;
  if (answers.site) social_links.site = answers.site;

  // Uma página já publicada continua publicada ao ser editada — rebaixar o
  // status derrubaria a URL pública no ar (as ofertas/quiz já são atualizadas
  // em vigor de qualquer forma; quem edita é o próprio dono que aprova).
  const nextStatus = smartbio.status === 'published' ? 'published' : 'preview_pending_approval';

  const { error: smartbioError } = await supabase
    .from('smartbios')
    .update({
      title: brandName,
      slug: newSlug,
      short_bio: shortBio,
      social_links,
      status: nextStatus,
      public_config: {
        generationMode: 'initial_guided_flow',
        requiresReview: true,
        diagnosticTitle: aiDiagnosticTitle,
        conversionDestination: answers.conversionDestination,
        buttonText: answers.buttonText,
        avatarUrl: answers.avatarUrl || null,
      },
      theme_config: {
        theme: answers.theme,
        accentColor: answers.accentColor,
      },
    })
    .eq('id', smartbio.id);

  if (smartbioError) throw smartbioError;
}

export async function resetSmartBio(tenant: AppTenant): Promise<void> {
  const smartbio = await getOrCreateWorkspaceSmartBio(tenant);

  await Promise.all([
    supabase.from('offers').delete().eq('tenant_id', tenant.id),
    supabase.from('quiz_questions').delete().eq('tenant_id', tenant.id),
    supabase.from('recommendation_rules').delete().eq('tenant_id', tenant.id),
    supabase.from('smartbio_assets').delete().eq('tenant_id', tenant.id),
    supabase.from('onboarding_answers').delete().eq('tenant_id', tenant.id),
  ]);

  await supabase
    .from('smartbios')
    .update({
      status: 'draft',
      short_bio: null,
      public_config: {},
      theme_config: { tone: 'clean', accent: '#0A0A0A' },
      tracking_config: {},
      published_at: null,
    })
    .eq('id', smartbio.id);

  try { localStorage.removeItem('smartbio_onboarding_draft'); } catch {}
}

export async function publishWorkspaceSmartBio(smartbioId: string) {
  const { error } = await supabase
    .from('smartbios')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', smartbioId);

  if (error) throw error;
}
