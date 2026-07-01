-- Campos adicionais na tabela de ofertas para suporte a e-commerce
alter table public.offers
  add column if not exists image_url text,
  add column if not exists external_url text;

-- Leitura pública de ofertas quando a SmartBio está publicada
create policy "offers_select_public_published" on public.offers
  for select using (
    exists (
      select 1 from public.smartbios sb
      where sb.id = offers.smartbio_id
        and sb.status = 'published'
    )
  );

-- Leitura pública de perguntas do quiz quando a SmartBio está publicada
create policy "quiz_questions_select_public_published" on public.quiz_questions
  for select using (
    exists (
      select 1 from public.smartbios sb
      where sb.id = quiz_questions.smartbio_id
        and sb.status = 'published'
    )
  );

-- Leitura pública de regras de recomendação quando a SmartBio está publicada
create policy "recommendation_rules_select_public_published" on public.recommendation_rules
  for select using (
    exists (
      select 1 from public.smartbios sb
      where sb.id = recommendation_rules.smartbio_id
        and sb.status = 'published'
    )
  );

-- Índice para busca de SmartBio por slug (já existe, mas garantindo)
create index if not exists smartbios_slug_idx on public.smartbios(slug);
create index if not exists smartbios_status_idx on public.smartbios(status);
