-- ============================================================
-- Migration: ativos, links sociais e CTA por oferta
-- Data: 2026-07-02
-- ============================================================

-- 1. smartbios: adicionar social_links (WhatsApp, Instagram, etc.)
ALTER TABLE public.smartbios
  ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}';

-- 2. offers: adicionar cta_url e image_url
ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS cta_url TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Nova tabela: smartbio_assets
-- Tipos: product | video | podcast | post | whatsapp | link | calendar
CREATE TABLE IF NOT EXISTS public.smartbio_assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smartbio_id     UUID NOT NULL REFERENCES public.smartbios(id) ON DELETE CASCADE,
  type            TEXT NOT NULL DEFAULT 'link',
  title           TEXT NOT NULL,
  subtitle        TEXT,
  url             TEXT,
  image_url       TEXT,
  phone           TEXT,
  message_template TEXT,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS smartbio_assets_tenant_idx    ON public.smartbio_assets(tenant_id);
CREATE INDEX IF NOT EXISTS smartbio_assets_smartbio_idx  ON public.smartbio_assets(smartbio_id);
CREATE INDEX IF NOT EXISTS smartbio_assets_status_idx    ON public.smartbio_assets(status);

-- RLS
ALTER TABLE public.smartbio_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assets_select_members" ON public.smartbio_assets;
DROP POLICY IF EXISTS "assets_insert_members" ON public.smartbio_assets;
DROP POLICY IF EXISTS "assets_update_members" ON public.smartbio_assets;
DROP POLICY IF EXISTS "assets_delete_members" ON public.smartbio_assets;
DROP POLICY IF EXISTS "assets_public_read"    ON public.smartbio_assets;

CREATE POLICY "assets_select_members" ON public.smartbio_assets
  FOR SELECT USING (public.is_tenant_member(tenant_id));

CREATE POLICY "assets_insert_members" ON public.smartbio_assets
  FOR INSERT WITH CHECK (public.is_tenant_member(tenant_id));

CREATE POLICY "assets_update_members" ON public.smartbio_assets
  FOR UPDATE USING (public.is_tenant_member(tenant_id));

CREATE POLICY "assets_delete_members" ON public.smartbio_assets
  FOR DELETE USING (public.is_tenant_member(tenant_id));

-- Acesso público (página /s/:slug pode ler ativos sem autenticação)
CREATE POLICY "assets_public_read" ON public.smartbio_assets
  FOR SELECT USING (status = 'active');
