-- Bucket público para avatars de SmartBio
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Usuário autenticado pode fazer upload (upsert)
drop policy if exists "avatars_insert_auth" on storage.objects;
create policy "avatars_insert_auth"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

drop policy if exists "avatars_update_auth" on storage.objects;
create policy "avatars_update_auth"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

-- Leitura pública (necessária para a página pública da SmartBio)
drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Dono pode deletar (pasta = user_id)
drop policy if exists "avatars_delete_auth" on storage.objects;
create policy "avatars_delete_auth"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
