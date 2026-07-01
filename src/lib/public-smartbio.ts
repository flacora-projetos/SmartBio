import { supabase } from '@/lib/supabase';

export type PublicSmartBio = {
  id: string;
  tenant_id: string;
  title: string;
  short_bio: string | null;
  slug: string;
  public_config: Record<string, unknown>;
  theme_config: Record<string, unknown>;
};

export type PublicOffer = {
  id: string;
  title: string;
  description: string | null;
  price_label: string | null;
  recommended_cta: string | null;
  cta_destination: string | null;
  image_url: string | null;
};

export type PublicQuestion = {
  id: string;
  question: string;
  options: string[];
  type: string;
  sort_order: number;
  is_required: boolean;
};

export type PublicRule = {
  id: string;
  condition: Record<string, unknown>;
  recommended_offer_id: string | null;
  recommendation_reason: string | null;
  final_cta: string | null;
};

export type PublicPageData = {
  smartbio: PublicSmartBio;
  offers: PublicOffer[];
  questions: PublicQuestion[];
  rules: PublicRule[];
};

export type PausedPageData = {
  paused: true;
  title: string;
};

export async function fetchPublicSmartBio(slug: string): Promise<PublicPageData | PausedPageData | null> {
  const { data: smartbio, error } = await supabase
    .from('smartbios')
    .select('id, tenant_id, title, short_bio, slug, public_config, theme_config')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !smartbio) return null;

  // Verifica se o tenant ainda tem acesso (trial ativo ou assinatura)
  const { data: accessible } = await supabase.rpc('check_smartbio_access', {
    p_tenant_id: smartbio.tenant_id,
  });

  if (!accessible) {
    return { paused: true, title: smartbio.title };
  }

  const [offersRes, questionsRes, rulesRes] = await Promise.all([
    supabase
      .from('offers')
      .select('id, title, description, price_label, recommended_cta, cta_destination, image_url')
      .eq('smartbio_id', smartbio.id)
      .eq('status', 'active')
      .order('sort_order'),
    supabase
      .from('quiz_questions')
      .select('id, question, options, type, sort_order, is_required')
      .eq('smartbio_id', smartbio.id)
      .eq('status', 'active')
      .order('sort_order'),
    supabase
      .from('recommendation_rules')
      .select('id, condition, recommended_offer_id, recommendation_reason, final_cta')
      .eq('smartbio_id', smartbio.id)
      .eq('status', 'active'),
  ]);

  return {
    smartbio: smartbio as PublicSmartBio,
    offers: (offersRes.data ?? []) as PublicOffer[],
    questions: (questionsRes.data ?? []) as PublicQuestion[],
    rules: (rulesRes.data ?? []) as PublicRule[],
  };
}

export function findMatchingRule(rules: PublicRule[], answers: string[]): PublicRule | null {
  for (const rule of rules) {
    const cond = rule.condition as { answer_contains?: string };
    if (cond.answer_contains) {
      const hit = answers.some(a =>
        a.toLowerCase().includes(cond.answer_contains!.toLowerCase())
      );
      if (hit) return rule;
    }
  }
  return rules[0] ?? null;
}

export function buildCtaUrl(ctaType: string | null, destination: string | null): string {
  if (!destination) return '#';
  if (ctaType === 'whatsapp') {
    const number = destination.replace(/\D/g, '');
    return `https://wa.me/${number}`;
  }
  if (destination.startsWith('http')) return destination;
  return `https://${destination}`;
}

export function trackEvent(
  tenantId: string,
  smartbioId: string,
  eventType: string,
  metadata: Record<string, unknown> = {}
): void {
  supabase.from('analytics_events').insert({
    tenant_id: tenantId,
    smartbio_id: smartbioId,
    event_type: eventType,
    metadata,
  });
}

export function insertLead(
  tenantId: string,
  smartbioId: string,
  recommendedOfferId: string | null,
  answers: string[],
  ctaClicked: string
): void {
  supabase.from('leads').insert({
    tenant_id: tenantId,
    smartbio_id: smartbioId,
    recommended_offer_id: recommendedOfferId,
    answers: { quiz_answers: answers },
    cta_clicked: ctaClicked,
    source: 'smartbio_public',
  });
}
