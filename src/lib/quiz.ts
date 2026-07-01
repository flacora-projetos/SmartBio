import { supabase } from '@/lib/supabase';

export type DbQuestion = {
  id: string;
  tenant_id: string;
  smartbio_id: string | null;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text';
  options: string[];
  intention: string | null;
  status: string;
  is_required: boolean;
  sort_order: number;
  created_at: string;
};

export type DbRule = {
  id: string;
  tenant_id: string;
  smartbio_id: string | null;
  name: string;
  description: string | null;
  condition: Record<string, unknown>;
  recommended_offer_id: string | null;
  recommendation_reason: string | null;
  final_cta: string | null;
  status: 'active' | 'draft' | 'paused';
  created_at: string;
};

const Q_FIELDS = 'id, tenant_id, smartbio_id, question, type, options, intention, status, is_required, sort_order, created_at';
const R_FIELDS = 'id, tenant_id, smartbio_id, name, description, condition, recommended_offer_id, recommendation_reason, final_cta, status, created_at';

// ── Questions ────────────────────────────────────────────────

export async function fetchQuestions(tenantId: string): Promise<DbQuestion[]> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select(Q_FIELDS)
    .eq('tenant_id', tenantId)
    .order('sort_order')
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as DbQuestion[];
}

export async function createQuestion(
  q: Omit<DbQuestion, 'id' | 'created_at'>
): Promise<DbQuestion> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .insert(q)
    .select(Q_FIELDS)
    .single();
  if (error) throw error;
  return data as DbQuestion;
}

export async function updateQuestion(
  id: string,
  updates: Partial<Omit<DbQuestion, 'id' | 'created_at'>>
): Promise<DbQuestion> {
  const { data, error } = await supabase
    .from('quiz_questions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(Q_FIELDS)
    .single();
  if (error) throw error;
  return data as DbQuestion;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
  if (error) throw error;
}

// ── Rules ────────────────────────────────────────────────────

export async function fetchRules(tenantId: string): Promise<DbRule[]> {
  const { data, error } = await supabase
    .from('recommendation_rules')
    .select(R_FIELDS)
    .eq('tenant_id', tenantId)
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as DbRule[];
}

export async function createRule(
  r: Omit<DbRule, 'id' | 'created_at'>
): Promise<DbRule> {
  const { data, error } = await supabase
    .from('recommendation_rules')
    .insert(r)
    .select(R_FIELDS)
    .single();
  if (error) throw error;
  return data as DbRule;
}

export async function updateRule(
  id: string,
  updates: Partial<Omit<DbRule, 'id' | 'created_at'>>
): Promise<DbRule> {
  const { data, error } = await supabase
    .from('recommendation_rules')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(R_FIELDS)
    .single();
  if (error) throw error;
  return data as DbRule;
}

export async function deleteRule(id: string): Promise<void> {
  const { error } = await supabase.from('recommendation_rules').delete().eq('id', id);
  if (error) throw error;
}
