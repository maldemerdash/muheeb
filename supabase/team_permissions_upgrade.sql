-- Muheeb team permissions upgrade
-- Run once in Supabase Dashboard > SQL Editor after schema.sql and cms_upgrade.sql.

alter table public.admin_users
add column if not exists full_name text,
add column if not exists phone text,
add column if not exists email text,
add column if not exists role text not null default 'user' check (role in ('owner', 'user')),
add column if not exists permissions jsonb not null default '{}'::jsonb,
add column if not exists active boolean not null default true,
add column if not exists updated_at timestamptz not null default now();

update public.admin_users
set role = 'owner',
    permissions = jsonb_build_object(
        'overview', true,
        'leads', true,
        'content', true,
        'site_images', true,
        'interest_options', true,
        'events', true,
        'users', true,
        'security', true,
        'delete_leads', true,
        'assign_notes', true
    ),
    active = true
where role = 'user'
and permissions = '{}'::jsonb;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.admin_users
        where user_id = auth.uid()
        and active = true
    );
$$;

create or replace function public.admin_has_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.admin_users
        where user_id = auth.uid()
        and active = true
        and (
            role = 'owner'
            or coalesce((permissions ->> permission_key)::boolean, false) = true
            or coalesce((permissions ->> 'all')::boolean, false) = true
        )
    );
$$;

create table if not exists public.admin_notifications (
    id bigint generated always as identity primary key,
    actor_user_id uuid references auth.users(id) on delete set null,
    target_user_id uuid references auth.users(id) on delete set null,
    lead_id bigint references public.leads(id) on delete cascade,
    note_id text,
    kind text not null default 'note_done',
    title text not null,
    message text not null,
    read_by uuid[] not null default '{}',
    created_at timestamptz not null default now()
);

create table if not exists public.lead_notes (
    id uuid primary key default gen_random_uuid(),
    lead_id bigint not null references public.leads(id) on delete cascade,
    body text not null,
    created_by uuid references auth.users(id) on delete set null,
    assigned_to uuid references auth.users(id) on delete set null,
    done boolean not null default false,
    done_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.admin_notifications enable row level security;
alter table public.lead_notes enable row level security;

drop trigger if exists set_lead_notes_updated_at on public.lead_notes;
create trigger set_lead_notes_updated_at
before update on public.lead_notes
for each row execute function public.set_updated_at();

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Managers can create admin users" on public.admin_users;
create policy "Managers can create admin users"
on public.admin_users
for insert
to authenticated
with check (public.admin_has_permission('users'));

drop policy if exists "Managers can update admin users" on public.admin_users;
create policy "Managers can update admin users"
on public.admin_users
for update
to authenticated
using (public.admin_has_permission('users') or user_id = auth.uid())
with check (public.admin_has_permission('users') or user_id = auth.uid());

drop policy if exists "Managers can delete admin users" on public.admin_users;
create policy "Managers can delete admin users"
on public.admin_users
for delete
to authenticated
using (public.admin_has_permission('users') and user_id <> auth.uid());

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads
for select
to authenticated
using (public.admin_has_permission('leads'));

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads
for update
to authenticated
using (public.admin_has_permission('leads'))
with check (public.admin_has_permission('leads'));

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
on public.leads
for delete
to authenticated
using (public.admin_has_permission('delete_leads'));

drop policy if exists "Admins can create events" on public.events;
create policy "Admins can create events"
on public.events
for insert
to authenticated
with check (public.admin_has_permission('events'));

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
on public.events
for update
to authenticated
using (public.admin_has_permission('events'))
with check (public.admin_has_permission('events'));

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (public.admin_has_permission('events'));

drop policy if exists "Admins can create event images" on public.event_images;
create policy "Admins can create event images"
on public.event_images
for insert
to authenticated
with check (public.admin_has_permission('events'));

drop policy if exists "Admins can update event images" on public.event_images;
create policy "Admins can update event images"
on public.event_images
for update
to authenticated
using (public.admin_has_permission('events'))
with check (public.admin_has_permission('events'));

drop policy if exists "Admins can delete event images" on public.event_images;
create policy "Admins can delete event images"
on public.event_images
for delete
to authenticated
using (public.admin_has_permission('events'));

drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
on public.site_content
for all
to authenticated
using (public.admin_has_permission('content'))
with check (public.admin_has_permission('content'));

drop policy if exists "Admins can manage site images" on public.site_images;
create policy "Admins can manage site images"
on public.site_images
for all
to authenticated
using (public.admin_has_permission('site_images'))
with check (public.admin_has_permission('site_images'));

drop policy if exists "Admins can manage interest options" on public.interest_options;
create policy "Admins can manage interest options"
on public.interest_options
for all
to authenticated
using (public.admin_has_permission('interest_options'))
with check (public.admin_has_permission('interest_options'));

drop policy if exists "Admins can upload event image files" on storage.objects;
create policy "Admins can upload event image files"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'event-images'
    and (
        public.admin_has_permission('events')
        or public.admin_has_permission('site_images')
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
        or public.admin_has_permission('site_images')
    )
)
with check (
    bucket_id = 'event-images'
    and (
        public.admin_has_permission('events')
        or public.admin_has_permission('site_images')
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
        or public.admin_has_permission('site_images')
    )
);

drop policy if exists "Admins can read notifications" on public.admin_notifications;
create policy "Admins can read notifications"
on public.admin_notifications
for select
to authenticated
using (
    public.is_admin()
    and (
        target_user_id is null
        or target_user_id = auth.uid()
        or public.admin_has_permission('leads')
        or public.admin_has_permission('users')
    )
);

drop policy if exists "Admins can create notifications" on public.admin_notifications;
create policy "Admins can create notifications"
on public.admin_notifications
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Assigned users can read lead notes" on public.lead_notes;
create policy "Assigned users can read lead notes"
on public.lead_notes
for select
to authenticated
using (
    public.is_admin()
    and (
        assigned_to = auth.uid()
        or created_by = auth.uid()
        or public.admin_has_permission('assign_notes')
        or public.admin_has_permission('users')
    )
);

drop policy if exists "Admins can create assigned lead notes" on public.lead_notes;
create policy "Admins can create assigned lead notes"
on public.lead_notes
for insert
to authenticated
with check (
    public.admin_has_permission('leads')
    and (
        assigned_to = auth.uid()
        or public.admin_has_permission('assign_notes')
        or public.admin_has_permission('users')
    )
);

drop policy if exists "Assigned users can complete lead notes" on public.lead_notes;
create policy "Assigned users can complete lead notes"
on public.lead_notes
for update
to authenticated
using (
    public.is_admin()
    and (
        assigned_to = auth.uid()
        or public.admin_has_permission('assign_notes')
        or public.admin_has_permission('users')
    )
)
with check (
    public.is_admin()
    and (
        assigned_to = auth.uid()
        or public.admin_has_permission('assign_notes')
        or public.admin_has_permission('users')
    )
);

drop policy if exists "Admins can update notification reads" on public.admin_notifications;
create policy "Admins can update notification reads"
on public.admin_notifications
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());
