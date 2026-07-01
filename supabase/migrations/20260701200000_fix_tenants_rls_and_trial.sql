-- Adiciona trial_ends_at se ainda não existe
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- Corrige policy SELECT de tenants:
-- A policy anterior (is_tenant_member) cria um deadlock no cadastro:
-- o INSERT com RETURNING falha porque o usuário ainda não está em
-- tenant_members. Adicionamos owner_id = auth.uid() para que o owner
-- possa ler seu próprio tenant antes de ser inserido em tenant_members.
DROP POLICY IF EXISTS "tenants_select_members" ON public.tenants;

CREATE POLICY "tenants_select_members_or_owner" ON public.tenants
  FOR SELECT USING (
    owner_id = auth.uid()
    OR public.is_tenant_member(id)
  );
