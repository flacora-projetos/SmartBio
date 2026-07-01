create table if not exists public.onboarding_answers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  smartbio_id uuid not null references public.smartbios(id) on delete cascade,
  step_id text not null,
  answer jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, smartbio_id, step_id)
);

create trigger set_onboarding_answers_updated_at
before update on public.onboarding_answers
for each row execute function public.set_updated_at();

alter table public.onboarding_answers enable row level security;

create policy "onboarding_answers_select_members"
on public.onboarding_answers
for select using (public.is_tenant_member(tenant_id));

create policy "onboarding_answers_write_members"
on public.onboarding_answers
for all using (public.is_tenant_member(tenant_id))
with check (public.is_tenant_member(tenant_id));

create index if not exists onboarding_answers_tenant_id_idx
on public.onboarding_answers(tenant_id);

create index if not exists onboarding_answers_smartbio_id_idx
on public.onboarding_answers(smartbio_id);
