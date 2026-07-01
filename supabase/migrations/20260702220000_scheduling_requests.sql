-- ============================================================
-- Migration: agenda nativa — scheduling_requests + agenda_config
-- Data: 2026-07-02
-- Modelo: intenção de agendamento (não reserva confirmada)
-- ============================================================

-- Coluna de configuração de agenda na SmartBio
ALTER TABLE public.smartbios
  ADD COLUMN IF NOT EXISTS agenda_config jsonb NOT NULL DEFAULT '{}';

-- Tabela de solicitações de agendamento
CREATE TABLE IF NOT EXISTS public.scheduling_requests (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id     uuid        NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  smartbio_id   uuid        NOT NULL REFERENCES public.smartbios(id) ON DELETE CASCADE,
  visitor_name  text        NOT NULL,
  visitor_phone text        NOT NULL,
  visitor_email text,
  service_name  text,
  preferred_date date       NOT NULL,
  preferred_time text       NOT NULL,
  notes         text,
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at    timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS scheduling_requests_tenant_idx
  ON public.scheduling_requests(tenant_id);
CREATE INDEX IF NOT EXISTS scheduling_requests_smartbio_idx
  ON public.scheduling_requests(smartbio_id);
CREATE INDEX IF NOT EXISTS scheduling_requests_date_idx
  ON public.scheduling_requests(preferred_date);

-- RLS
ALTER TABLE public.scheduling_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_read_scheduling" ON public.scheduling_requests;
CREATE POLICY "tenant_read_scheduling" ON public.scheduling_requests
  FOR SELECT USING (is_tenant_member(tenant_id));

DROP POLICY IF EXISTS "tenant_update_scheduling" ON public.scheduling_requests;
CREATE POLICY "tenant_update_scheduling" ON public.scheduling_requests
  FOR UPDATE USING (is_tenant_member(tenant_id));

DROP POLICY IF EXISTS "public_insert_scheduling" ON public.scheduling_requests;
CREATE POLICY "public_insert_scheduling" ON public.scheduling_requests
  FOR INSERT WITH CHECK (true);
