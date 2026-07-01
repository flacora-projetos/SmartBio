import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AppTenant = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  plan_key: string;
  is_active: boolean;
  trial_ends_at: string | null;
};

function normalizeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
}

export function tenantNameFromUser(user: User) {
  const fullName = user.user_metadata?.full_name as string | undefined;
  if (fullName?.trim()) return fullName.trim();
  if (user.email) return user.email.split('@')[0];
  return 'Minha SmartBio';
}

export async function getOrCreateTenant(user: User): Promise<AppTenant> {
  const { data: existingTenant, error: selectError } = await supabase
    .from('tenants')
    .select('id, owner_id, name, slug, plan_key, is_active, trial_ends_at')
    .limit(1)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existingTenant) return existingTenant as AppTenant;

  const name = tenantNameFromUser(user);
  const baseSlug = normalizeSlug(name) || 'minha-smartbio';
  const slug = `${baseSlug}-${user.id.slice(0, 8)}`;

  // Gera o ID no cliente para evitar o deadlock de RLS:
  // INSERT ... RETURNING exige SELECT, mas o usuário ainda não está em
  // tenant_members — então o RETURNING falha com policy violation.
  // Solução: INSERT sem .select(), depois insere em tenant_members,
  // e só então faz o SELECT (agora is_tenant_member já retorna true).
  const tenantId = crypto.randomUUID();

  const { error: insertTenantError } = await supabase
    .from('tenants')
    .insert({
      id: tenantId,
      owner_id: user.id,
      name,
      slug,
      plan_key: 'essential',
    });

  if (insertTenantError) throw insertTenantError;

  const { error: memberError } = await supabase
    .from('tenant_members')
    .insert({
      tenant_id: tenantId,
      user_id: user.id,
      role: 'owner',
    });

  if (memberError) throw memberError;

  // SELECT agora funciona: is_tenant_member(tenantId) retorna true
  const { data: newTenant, error: refetchError } = await supabase
    .from('tenants')
    .select('id, owner_id, name, slug, plan_key, is_active, trial_ends_at')
    .eq('id', tenantId)
    .single();

  if (refetchError) throw refetchError;
  return newTenant as AppTenant;
}
