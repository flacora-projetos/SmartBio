import { supabase } from './supabase';

export type DbAsset = {
  id: string;
  smartbio_id: string;
  type: 'link' | 'product' | 'video' | 'podcast' | 'post' | 'whatsapp' | 'calendar';
  title: string;
  subtitle: string | null;
  url: string | null;
  phone: string | null;
  message_template: string | null;
  image_url: string | null;
  sort_order: number;
  status: 'active' | 'draft';
  created_at: string;
};

export type AssetPayload = {
  smartbio_id: string;
  type: DbAsset['type'];
  title: string;
  subtitle?: string | null;
  url?: string | null;
  phone?: string | null;
  message_template?: string | null;
  image_url?: string | null;
  sort_order?: number;
  status?: 'active' | 'draft';
};

export async function fetchAssets(smartbioId: string): Promise<DbAsset[]> {
  const { data, error } = await supabase
    .from('smartbio_assets')
    .select('*')
    .eq('smartbio_id', smartbioId)
    .order('sort_order');
  if (error) throw new Error(error.message);
  return (data ?? []) as DbAsset[];
}

export async function createAsset(payload: AssetPayload): Promise<DbAsset> {
  const { data, error } = await supabase
    .from('smartbio_assets')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as DbAsset;
}

export async function updateAsset(id: string, payload: Partial<AssetPayload>): Promise<void> {
  const { error } = await supabase
    .from('smartbio_assets')
    .update(payload)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteAsset(id: string): Promise<void> {
  const { error } = await supabase
    .from('smartbio_assets')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
