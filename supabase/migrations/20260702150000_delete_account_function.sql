-- ============================================================
-- Migration: função para exclusão de conta pelo próprio usuário
-- Data: 2026-07-02
-- ============================================================

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Deleta perfil (cascata para tenants → tenant_members → smartbios → offers → etc.)
  DELETE FROM public.profiles WHERE id = v_user_id;

  -- Deleta usuário do Supabase Auth
  -- SECURITY DEFINER faz a função rodar com privilégios do owner (postgres)
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
