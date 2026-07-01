-- Adiciona coluna tracking_config à tabela smartbios
-- Armazena IDs de rastreamento: Meta Pixel, GA4, GTM
ALTER TABLE smartbios
  ADD COLUMN IF NOT EXISTS tracking_config jsonb NOT NULL DEFAULT '{}'::jsonb;
