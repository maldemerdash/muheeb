-- Muheeb live chat and granular permissions upgrade
-- Run once in Supabase Dashboard > SQL Editor after the previous upgrade files.

alter table public.admin_users
add column if not exists full_name text,
add column if not exists phone text,
add column if not exists email text,
add column if not exists role text not null default 'user',
add column if not exists permissions jsonb not null default '{}'::jsonb,
add column if not exists active boolean not null default true,
add column if not exists updated_at timestamptz not null default now();

create table if not exists public.admin_chat_messages (
    id bigint generated always as identity primary key,
    sender_user_id uuid not null references auth.users(id) on delete cascade,
    recipient_user_id uuid not null references auth.users(id) on delete cascade,
    body text not null default '',
    attachment jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    constraint admin_chat_messages_has_content check (
        length(trim(body)) > 0
        or attachment <> '{}'::jsonb
    )
);

create index if not exists admin_chat_messages_sender_recipient_idx
on public.admin_chat_messages (sender_user_id, recipient_user_id, created_at);

create index if not exists admin_chat_messages_recipient_sender_idx
on public.admin_chat_messages (recipient_user_id, sender_user_id, created_at);

alter table public.admin_chat_messages enable row level security;

grant select, insert on table public.admin_chat_messages to authenticated;

do $$
begin
    if exists (
        select 1
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public'
        and c.relname = 'admin_chat_messages_id_seq'
        and c.relkind = 'S'
    ) then
        grant usage, select on sequence public.admin_chat_messages_id_seq to authenticated;
    end if;
end $$;

drop policy if exists "Admins can read their chat messages" on public.admin_chat_messages;
create policy "Admins can read their chat messages"
on public.admin_chat_messages
for select
to authenticated
using (
    public.is_admin()
    and (
        sender_user_id = auth.uid()
        or recipient_user_id = auth.uid()
    )
);

drop policy if exists "Admins can send chat messages" on public.admin_chat_messages;
create policy "Admins can send chat messages"
on public.admin_chat_messages
for insert
to authenticated
with check (
    public.is_admin()
    and (
        public.admin_has_permission('chat')
        or public.admin_has_permission('users')
        or public.admin_has_permission('all')
    )
    and sender_user_id = auth.uid()
    and recipient_user_id <> auth.uid()
);

drop policy if exists "Managers can create admin users" on public.admin_users;
create policy "Managers can create admin users"
on public.admin_users
for insert
to authenticated
with check (
    public.admin_has_permission('users')
    or public.admin_has_permission('users_add')
);

drop policy if exists "Managers can update admin users" on public.admin_users;
create policy "Managers can update admin users"
on public.admin_users
for update
to authenticated
using (
    public.admin_has_permission('users')
    or public.admin_has_permission('users_edit')
    or user_id = auth.uid()
)
with check (
    public.admin_has_permission('users')
    or public.admin_has_permission('users_edit')
    or user_id = auth.uid()
);

drop policy if exists "Managers can delete admin users" on public.admin_users;
create policy "Managers can delete admin users"
on public.admin_users
for delete
to authenticated
using (
    user_id <> auth.uid()
    and (
        public.admin_has_permission('users')
        or public.admin_has_permission('users_delete')
    )
);

drop policy if exists "Admins can read events" on public.events;
create policy "Admins can read events"
on public.events
for select
to authenticated
using (
    public.admin_has_permission('events')
    or public.admin_has_permission('events_gallery_images')
);

drop policy if exists "Admins can create event images" on public.event_images;
create policy "Admins can create event images"
on public.event_images
for insert
to authenticated
with check (
    public.admin_has_permission('events')
    or public.admin_has_permission('events_gallery_images')
);

drop policy if exists "Admins can update event images" on public.event_images;
create policy "Admins can update event images"
on public.event_images
for update
to authenticated
using (
    public.admin_has_permission('events')
    or public.admin_has_permission('events_gallery_images')
)
with check (
    public.admin_has_permission('events')
    or public.admin_has_permission('events_gallery_images')
);

drop policy if exists "Admins can delete event images" on public.event_images;
create policy "Admins can delete event images"
on public.event_images
for delete
to authenticated
using (
    public.admin_has_permission('events')
    or public.admin_has_permission('events_gallery_images')
);

drop policy if exists "Admins can upload event image files" on storage.objects;
create policy "Admins can upload event image files"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'event-images'
    and (
        public.admin_has_permission('events')
        or public.admin_has_permission('events_gallery_images')
        or public.admin_has_permission('site_images')
        or public.admin_has_permission('chat')
    )
);

drop policy if exists "Admins can update event image files" on storage.objects;
create policy "Admins can update event image files"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'event-images'
    and (
        public.admin_has_permission('events')
        or public.admin_has_permission('events_gallery_images')
        or public.admin_has_permission('site_images')
        or public.admin_has_permission('chat')
    )
)
with check (
    bucket_id = 'event-images'
    and (
        public.admin_has_permission('events')
        or public.admin_has_permission('events_gallery_images')
        or public.admin_has_permission('site_images')
        or public.admin_has_permission('chat')
    )
);

drop policy if exists "Admins can delete event image files" on storage.objects;
create policy "Admins can delete event image files"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'event-images'
    and (
        public.admin_has_permission('events')
        or public.admin_has_permission('events_gallery_images')
        or public.admin_has_permission('site_images')
        or public.admin_has_permission('chat')
    )
);

do $$
begin
    alter publication supabase_realtime add table public.admin_chat_messages;
exception
    when duplicate_object then null;
    when undefined_object then null;
end $$;

update public.admin_users
set permissions = coalesce(permissions, '{}'::jsonb) || jsonb_build_object(
    'overview', true,
    'chat', true,
    'leads', true,
    'leads_view_all', true,
    'leads_assigned_only', true,
    'leads_view_phone', true,
    'delete_leads', true,
    'assign_notes', true,
    'manage_note_inquiries', true,
    'content', true,
    'content_header', true,
    'content_hero', true,
    'content_about', true,
    'content_services', true,
    'content_works', true,
    'content_journey', true,
    'content_form', true,
    'content_contact', true,
    'content_footer', true,
    'site_images', true,
    'site_images_core', true,
    'site_images_identity', true,
    'site_images_services', true,
    'site_images_footer', true,
    'site_images_admin_login', true,
    'site_images_custom', true,
    'interest_options', true,
    'interest_options_interest', true,
    'interest_options_event_category', true,
    'events', true,
    'events_manage', true,
    'events_details', true,
    'events_partners', true,
    'events_gallery_images', true,
    'events_sections', true,
    'users', true,
    'users_add', true,
    'users_edit', true,
    'users_delete', true,
    'security', true,
    'profile_requests', true
)
where role = 'owner'
or coalesce((permissions ->> 'all')::boolean, false) = true;
