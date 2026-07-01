-- 1. Adicionar trial_ends_at na tabela tenants
alter table public.tenants
  add column if not exists trial_ends_at timestamptz;

-- 2. Definir trial para tenants existentes (7 dias a partir da criação)
update public.tenants
  set trial_ends_at = created_at + interval '7 days'
  where trial_ends_at is null;

-- 3. Trigger: novos tenants recebem trial de 7 dias automaticamente
create or replace function public.set_tenant_trial()
returns trigger
language plpgsql
as $$
begin
  if new.trial_ends_at is null then
    new.trial_ends_at = now() + interval '7 days';
  end if;
  return new;
end;
$$;

drop trigger if exists set_tenants_trial_ends_at on public.tenants;
create trigger set_tenants_trial_ends_at
  before insert on public.tenants
  for each row execute function public.set_tenant_trial();

-- 4. Função pública para verificar se um tenant tem acesso ativo
--    (trial vigente OU assinatura ativa). Usada pela página pública /s/:slug
--    via RPC com anon key — security definer permite bypass do RLS.
create or replace function public.check_smartbio_access(p_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((
    select
      t.is_active = true
      and (
        t.trial_ends_at is null
        or t.trial_ends_at > now()
        or exists (
          select 1 from public.subscriptions s
          where s.tenant_id = t.id
            and s.status in ('active', 'trialing')
        )
      )
    from public.tenants t
    where t.id = p_tenant_id
  ), false);
$$;
