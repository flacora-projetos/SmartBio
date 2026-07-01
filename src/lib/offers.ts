import { supabase } from '@/lib/supabase';

export type DbOffer = {
  id: string;
  tenant_id: string;
  smartbio_id: string | null;
  title: string;
  description: string | null;
  objective: string | null;
  target_pain: string | null;
  ideal_audience: string | null;
  maturity_level: string | null;
  format: string | null;
  price_label: string | null;
  recommended_cta: string | null;
  cta_destination: string | null;
  image_url: string | null;
  status: 'active' | 'draft' | 'paused';
  is_connected_to_rule: boolean;
  sort_order: number;
  created_at: string;
};

const FIELDS = 'id, tenant_id, smartbio_id, title, description, objective, target_pain, ideal_audience, maturity_level, format, price_label, recommended_cta, cta_destination, image_url, status, is_connected_to_rule, sort_order, created_at';

export async function fetchOffers(tenantId: string): Promise<DbOffer[]> {
  const { data, error } = await supabase
    .from('offers')
    .select(FIELDS)
    .eq('tenant_id', tenantId)
    .order('sort_order')
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as DbOffer[];
}

export async function createOffer(
  offer: Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>
): Promise<DbOffer> {
  const { data, error } = await supabase
    .from('offers')
    .insert({ ...offer, is_connected_to_rule: false })
    .select(FIELDS)
    .single();
  if (error) throw error;
  return data as DbOffer;
}

export async function updateOffer(
  id: string,
  updates: Partial<Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>>
): Promise<DbOffer> {
  const { data, error } = await supabase
    .from('offers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(FIELDS)
    .single();
  if (error) throw error;
  return data as DbOffer;
}

export async function deleteOffer(id: string): Promise<void> {
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw error;
}
