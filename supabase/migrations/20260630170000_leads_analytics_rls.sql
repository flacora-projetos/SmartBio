-- Habilita RLS nas tabelas que ainda não tinham
alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;

-- ── leads ────────────────────────────────────────────────────

-- Página pública pode inserir leads (visitante anônimo)
drop policy if exists "leads_insert_anon" on public.leads;
create policy "leads_insert_anon" on public.leads
  for insert with check (true);

-- Dono do tenant lê e atualiza seus próprios leads
drop policy if exists "leads_select_owner" on public.leads;
create policy "leads_select_owner" on public.leads
  for select using (
    exists (
      select 1 from public.tenant_members tm
      where tm.tenant_id = leads.tenant_id
        and tm.user_id = auth.uid()
    )
  );

drop policy if exists "leads_update_owner" on public.leads;
create policy "leads_update_owner" on public.leads
  for update using (
    exists (
      select 1 from public.tenant_members tm
      where tm.tenant_id = leads.tenant_id
        and tm.user_id = auth.uid()
    )
  );

-- ── analytics_events ─────────────────────────────────────────

-- Página pública pode inserir eventos (visitante anônimo)
drop policy if exists "analytics_events_insert_anon" on public.analytics_events;
create policy "analytics_events_insert_anon" on public.analytics_events
  for insert with check (true);

-- Dono do tenant lê seus próprios eventos
drop policy if exists "analytics_events_select_owner" on public.analytics_events;
create policy "analytics_events_select_owner" on public.analytics_events
  for select using (
    exists (
      select 1 from public.tenant_members tm
      where tm.tenant_id = analytics_events.tenant_id
        and tm.user_id = auth.uid()
    )
  );
