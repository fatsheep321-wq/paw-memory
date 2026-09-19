-- 前提：在 Supabase 專案中使用 Dashboard 的 SQL Editor，以專案擁有者權限
-- 一次執行整份檔案。Auth 與 Storage schema 必須已存在。
-- 本檔不啟用 Anonymous Sign-Ins；需在 Authentication 控制台另行開啟。
--
-- 安全恢復：整份腳本位於同一交易中，任何錯誤会使本次执行回滚。
-- 若先前只执行部分段落，请先检查错误并确认既有 memories 结构相容，
-- 修正后重新执行整份文件。本脚本不会 DROP table、bucket 或既有资料；
-- bucket 使用 upsert，policy、trigger 与 publish function 仅重建定义。

begin;

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null
    default auth.uid()
    references auth.users(id)
    on delete cascade,
  pet_name text not null
    check (char_length(btrim(pet_name)) between 1 and 60),
  warm_message text not null
    check (char_length(btrim(warm_message)) between 1 and 1000),
  photo_path text,
  video_path text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  share_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,

  constraint published_memory_complete check (
    status = 'draft'
    or (
      share_confirmed = true
      and photo_path is not null
      and video_path is not null
      and published_at is not null
    )
  ),
  constraint photo_path_belongs_to_memory check (
    photo_path is null
    or photo_path like owner_id::text || '/' || id::text || '/%'
  ),
  constraint video_path_belongs_to_memory check (
    video_path is null
    or video_path like owner_id::text || '/' || id::text || '/%'
  )
);

create index if not exists memories_owner_id_idx
  on public.memories (owner_id);

create index if not exists memories_published_idx
  on public.memories (status, created_at desc)
  where status = 'published';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at
before update on public.memories
for each row
execute function public.set_updated_at();

alter table public.memories enable row level security;

revoke all on public.memories from anon, authenticated;
grant select on public.memories to anon, authenticated;
grant insert, update, delete on public.memories to authenticated;

drop policy if exists "published memories or own memories are readable"
  on public.memories;
create policy "published memories or own memories are readable"
on public.memories
for select
to anon, authenticated
using (
  status = 'published'
  or owner_id = (select auth.uid())
);

drop policy if exists "authenticated creators insert own memories"
  on public.memories;
create policy "authenticated creators insert own memories"
on public.memories
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  and status = 'draft'
);

drop policy if exists "creators update own draft memories"
  on public.memories;
create policy "creators update own draft memories"
on public.memories
for update
to authenticated
using (
  owner_id = (select auth.uid())
  and status = 'draft'
)
with check (
  owner_id = (select auth.uid())
  and status = 'draft'
);

drop policy if exists "creators delete own draft memories"
  on public.memories;
create policy "creators delete own draft memories"
on public.memories
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  and status = 'draft'
);

-- 移除旧版策略名称，避免从旧 setup.sql 升级时留下较宽松权限。
drop policy if exists "creators update own memories"
  on public.memories;
drop policy if exists "creators delete own memories"
  on public.memories;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'pet-images',
    'pet-images',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']::text[]
  ),
  (
    'pet-videos',
    'pet-videos',
    false,
    52428800,
    array['video/mp4', 'video/webm']::text[]
  )
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "creators upload assets for own memories"
  on storage.objects;
create policy "creators upload assets for own memories"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('pet-images', 'pet-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.memories m
    where m.id::text = (storage.foldername(name))[2]
      and m.owner_id = (select auth.uid())
      and m.status = 'draft'
  )
);

drop policy if exists "owners and public visitors read permitted assets"
  on storage.objects;
create policy "owners and public visitors read permitted assets"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id in ('pet-images', 'pet-videos')
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1
      from public.memories m
      where m.status = 'published'
        and (
          (bucket_id = 'pet-images' and m.photo_path = name)
          or (bucket_id = 'pet-videos' and m.video_path = name)
        )
    )
  )
);

drop policy if exists "creators update unreferenced own assets"
  on storage.objects;
create policy "creators update unreferenced own assets"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('pet-images', 'pet-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and not exists (
    select 1
    from public.memories m
    where m.status = 'published'
      and (m.photo_path = name or m.video_path = name)
  )
)
with check (
  bucket_id in ('pet-images', 'pet-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.memories m
    where m.id::text = (storage.foldername(name))[2]
      and m.owner_id = (select auth.uid())
      and m.status = 'draft'
  )
);

drop policy if exists "creators delete unreferenced own assets"
  on storage.objects;
create policy "creators delete unreferenced own assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('pet-images', 'pet-videos')
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and not exists (
    select 1
    from public.memories m
    where m.status = 'published'
      and (m.photo_path = name or m.video_path = name)
  )
);

-- 移除旧版较宽松的 Storage 策略。
drop policy if exists "creators update own assets"
  on storage.objects;
drop policy if exists "creators delete own assets"
  on storage.objects;

create or replace function public.publish_memory(
  p_memory_id uuid,
  p_pet_name text,
  p_warm_message text,
  p_photo_path text,
  p_video_path text,
  p_photo_size bigint,
  p_video_size bigint,
  p_photo_mime text,
  p_video_mime text,
  p_share_confirmed boolean
)
returns table (
  id uuid,
  status text,
  photo_path text,
  video_path text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_memory public.memories%rowtype;
  v_photo storage.objects%rowtype;
  v_video storage.objects%rowtype;
begin
  if v_owner_id is null then
    raise exception 'Authentication required';
  end if;

  select m.*
  into v_memory
  from public.memories m
  where m.id = p_memory_id
    and m.owner_id = v_owner_id
  for update;

  if not found then
    raise exception 'Draft not found';
  end if;

  if v_memory.status <> 'draft' then
    raise exception 'Memory is already published';
  end if;

  if char_length(btrim(p_pet_name)) not between 1 and 60
     or char_length(btrim(p_warm_message)) not between 1 and 1000
     or p_share_confirmed is not true then
    raise exception 'Invalid publish fields';
  end if;

  if p_photo_path not like v_owner_id::text || '/' || p_memory_id::text || '/%'
     or p_video_path not like v_owner_id::text || '/' || p_memory_id::text || '/%' then
    raise exception 'Invalid object path';
  end if;

  if p_photo_size <= 0 or p_photo_size > 10485760
     or p_video_size <= 0 or p_video_size > 52428800
     or p_photo_mime not in ('image/jpeg', 'image/png', 'image/webp')
     or p_video_mime not in ('video/mp4', 'video/webm') then
    raise exception 'Invalid object metadata';
  end if;

  select o.*
  into v_photo
  from storage.objects o
  where o.bucket_id = 'pet-images'
    and o.name = p_photo_path;

  if not found
     or coalesce((v_photo.metadata ->> 'size')::bigint, 0) <> p_photo_size
     or lower(coalesce(v_photo.metadata ->> 'mimetype', '')) <> lower(p_photo_mime) then
    raise exception 'Photo object is missing or does not match';
  end if;

  select o.*
  into v_video
  from storage.objects o
  where o.bucket_id = 'pet-videos'
    and o.name = p_video_path;

  if not found
     or coalesce((v_video.metadata ->> 'size')::bigint, 0) <> p_video_size
     or lower(coalesce(v_video.metadata ->> 'mimetype', '')) <> lower(p_video_mime) then
    raise exception 'Video object is missing or does not match';
  end if;

  return query
  update public.memories as m
  set
    pet_name = btrim(p_pet_name),
    warm_message = btrim(p_warm_message),
    photo_path = p_photo_path,
    video_path = p_video_path,
    share_confirmed = true,
    status = 'published',
    published_at = now()
  where m.id = p_memory_id
    and m.owner_id = v_owner_id
    and m.status = 'draft'
  returning m.id, m.status, m.photo_path, m.video_path;
end;
$$;

revoke all on function public.publish_memory(
  uuid, text, text, text, text, bigint, bigint, text, text, boolean
) from public, anon, authenticated;

grant execute on function public.publish_memory(
  uuid, text, text, text, text, bigint, bigint, text, text, boolean
) to authenticated;

commit;
