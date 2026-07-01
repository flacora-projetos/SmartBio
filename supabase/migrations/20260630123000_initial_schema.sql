create extension if not exists "pgcrypto";

create type public.tenant_role as enum ('owner', 'admin', 'member');
create type public.smartbio_status as enum ('draft', 'generating', 'preview_pending_approval', 'published', 'archived');
create type public.offer_status as enum ('active', 'draft', 'paused');
create type public.question_type as enum ('single_choice', 'multiple_choice', 'text');
create type public.rule_status as enum ('active', 'draft', 'paused');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  plan_key text not null default 'essential',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenant_members (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.tenant_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan_key text not null,
  status public.subscription_status not null default 'incomplete',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.smartbios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  slug text not null unique,
  short_bio text,
  status public.smartbio_status not null default 'draft',
  public_config jsonb not null default '{}'::jsonb,
  theme_config jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  smartbio_id uuid references public.smartbios(id) on delete cascade,
  title text not null,
  description text,
  objective text,
  target_pain text,
  ideal_audience text,
  maturity_level text,
  format text,
  price_label text,
  recommended_cta text,
  cta_destination text,
  status public.offer_status not null default 'draft',
  is_connected_to_rule boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  smartbio_id uuid references public.smartbios(id) on delete cascade,
  question text not null,
  type public.question_type not null default 'single_choice',
  options jsonb not null default '[]'::jsonb,
  intention text,
  status text not null default 'active',
  is_required boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recommendation_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  smartbio_id uuid references public.smartbios(id) on delete cascade,
  name text not null,
  description text,
  condition jsonb not null default '{}'::jsonb,
  recommended_offer_id uuid references public.offers(id) on delete set null,
  recommendation_reason text,
  final_cta text,
  status public.rule_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  smartbio_id uuid references public.smartbios(id) on delete set null,
  name text,
  email text,
  phone text,
  answers jsonb not null default '{}'::jsonb,
  recommended_offer_id uuid references public.offers(id) on delete set null,
  cta_clicked text,
  source text,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  smartbio_id uuid references public.smartbios(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  smartbio_id uuid references public.smartbios(id) on delete cascade,
  generation_type text not null,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  model text,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_tenants_updated_at before update on public.tenants for each row execute function public.set_updated_at();
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger set_smartbios_updated_at before update on public.smartbios for each row execute function public.set_updated_at();
create trigger set_offers_updated_at before update on public.offers for each row execute function public.set_updated_at();
create trigger set_quiz_questions_updated_at before update on public.quiz_questions for each row execute function public.set_updated_at();
create trigger set_recommendation_rules_updated_at before update on public.recommendation_rules for each row execute function public.set_updated_at();
create trigger set_leads_updated_at before update on public.leads for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_tenant_member(target_tenant_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = target_tenant_id
      and tm.user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_members enable row level security;
alter table public.subscriptions enable row level security;
alter table public.smartbios enable row level security;
alter table public.offers enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.recommendation_rules enable row level security;
alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;
alter table public.ai_generations enable row level security;

create policy "profiles_select_self" on public.profiles for select using (id = auth.uid());
create policy "profiles_update_self" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "tenants_select_members" on public.tenants for select using (public.is_tenant_member(id));
create policy "tenants_insert_owner" on public.tenants for insert with check (owner_id = auth.uid());
create policy "tenants_update_members" on public.tenants for update using (public.is_tenant_member(id)) with check (public.is_tenant_member(id));

create policy "tenant_members_select_members" on public.tenant_members for select using (public.is_tenant_member(tenant_id));
create policy "tenant_members_insert_owner" on public.tenant_members for insert with check (
  exists (
    select 1 from public.tenants t
    where t.id = tenant_id
      and t.owner_id = auth.uid()
  )
);

create policy "subscriptions_select_members" on public.subscriptions for select using (public.is_tenant_member(tenant_id));
create policy "subscriptions_write_members" on public.subscriptions for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy "smartbios_select_members_or_published" on public.smartbios for select using (public.is_tenant_member(tenant_id) or status = 'published');
create policy "smartbios_write_members" on public.smartbios for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy "offers_select_members" on public.offers for select using (public.is_tenant_member(tenant_id));
create policy "offers_write_members" on public.offers for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy "quiz_questions_select_members" on public.quiz_questions for select using (public.is_tenant_member(tenant_id));
create policy "quiz_questions_write_members" on public.quiz_questions for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy "recommendation_rules_select_members" on public.recommendation_rules for select using (public.is_tenant_member(tenant_id));
create policy "recommendation_rules_write_members" on public.recommendation_rules for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy "leads_select_members" on public.leads for select using (public.is_tenant_member(tenant_id));
create policy "leads_insert_public" on public.leads for insert with check (true);
create policy "leads_update_members" on public.leads for update using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create policy "analytics_events_select_members" on public.analytics_events for select using (public.is_tenant_member(tenant_id));
create policy "analytics_events_insert_public" on public.analytics_events for insert with check (true);

create policy "ai_generations_select_members" on public.ai_generations for select using (public.is_tenant_member(tenant_id));
create policy "ai_generations_write_members" on public.ai_generations for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id));

create index tenants_owner_id_idx on public.tenants(owner_id);
create index tenant_members_user_id_idx on public.tenant_members(user_id);
create index smartbios_tenant_id_idx on public.smartbios(tenant_id);
create index offers_tenant_id_idx on public.offers(tenant_id);
create index quiz_questions_tenant_id_idx on public.quiz_questions(tenant_id);
create index recommendation_rules_tenant_id_idx on public.recommendation_rules(tenant_id);
create index leads_tenant_id_idx on public.leads(tenant_id);
create index analytics_events_tenant_id_idx on public.analytics_events(tenant_id);
create index analytics_events_event_type_idx on public.analytics_events(event_type);
