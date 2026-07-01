-- 1. Adicionar coluna image_url na tabela offers
--    (estava no código TypeScript mas faltava no schema)
alter table public.offers
  add column if not exists image_url text;

-- 2. Corrigir RLS: visitante anônimo precisa ler offers/questions/rules
--    de SmartBios publicadas (status = 'published').
--
--    Política anterior só permitia tenant members — isso bloqueava
--    completamente a página pública /s/:slug para visitantes reais.

drop policy if exists "offers_select_members" on public.offers;
drop policy if exists "offers_select" on public.offers;
create policy "offers_select" on public.offers
  for select using (
    public.is_tenant_member(tenant_id)
    or exists (
      select 1 from public.smartbios sb
      where sb.id = offers.smartbio_id
        and sb.status = 'published'
    )
  );

drop policy if exists "quiz_questions_select_members" on public.quiz_questions;
drop policy if exists "quiz_questions_select" on public.quiz_questions;
create policy "quiz_questions_select" on public.quiz_questions
  for select using (
    public.is_tenant_member(tenant_id)
    or exists (
      select 1 from public.smartbios sb
      where sb.id = quiz_questions.smartbio_id
        and sb.status = 'published'
    )
  );

drop policy if exists "recommendation_rules_select_members" on public.recommendation_rules;
drop policy if exists "recommendation_rules_select" on public.recommendation_rules;
create policy "recommendation_rules_select" on public.recommendation_rules
  for select using (
    public.is_tenant_member(tenant_id)
    or exists (
      select 1 from public.smartbios sb
      where sb.id = recommendation_rules.smartbio_id
        and sb.status = 'published'
    )
  );
