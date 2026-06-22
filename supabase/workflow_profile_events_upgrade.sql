-- Muheeb workflow, profile, and event details upgrade
-- Run once in Supabase Dashboard > SQL Editor after team_permissions_upgrade.sql.

alter table public.events
add column if not exists venue_name text,
add column if not exists map_url text,
add column if not exists date_from date,
add column if not exists date_to date,
add column if not exists time_from text,
add column if not exists time_to text,
add column if not exists participants text[] not null default '{}',
add column if not exists achievements text[] not null default '{}',
add column if not exists support_logos text[] not null default '{}',
add column if not exists detail_sections jsonb not null default '[]'::jsonb;

update public.admin_users
set permissions = permissions || jsonb_build_object(
    'overview', true,
    'leads', true,
    'leads_view_all', true,
    'leads_assigned_only', true,
    'leads_view_phone', true,
    'content', true,
    'site_images', true,
    'interest_options', true,
    'events', true,
    'users', true,
    'security', true,
    'delete_leads', true,
    'assign_notes', true,
    'manage_note_inquiries', true,
    'profile_requests', true
)
where role = 'owner'
or coalesce((permissions ->> 'all')::boolean, false) = true;

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

create or replace function public.admin_can_view_lead(target_lead_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select public.is_admin()
    and (
        public.admin_has_permission('leads')
        or public.admin_has_permission('leads_view_all')
        or exists (
            select 1
            from public.lead_notes
            where lead_id = target_lead_id
            and assigned_to = auth.uid()
        )
    );
$$;

create table if not exists public.lead_note_inquiries (
    id uuid primary key default gen_random_uuid(),
    lead_id bigint not null references public.leads(id) on delete cascade,
    note_id uuid not null references public.lead_notes(id) on delete cascade,
    body text not null,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    reply_body text,
    reply_by uuid references auth.users(id) on delete set null,
    reply_at timestamptz
);

alter table public.lead_note_inquiries
add column if not exists reply_body text,
add column if not exists reply_by uuid references auth.users(id) on delete set null,
add column if not exists reply_at timestamptz;

create table if not exists public.profile_change_requests (
    id bigint generated always as identity primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    requested_full_name text,
    requested_phone text,
    requested_email text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    reviewer_id uuid references auth.users(id) on delete set null,
    reviewer_note text,
    created_at timestamptz not null default now(),
    reviewed_at timestamptz
);

alter table public.lead_note_inquiries enable row level security;
alter table public.profile_change_requests enable row level security;

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads
for select
to authenticated
using (public.admin_can_view_lead(id));

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads
for update
to authenticated
using (public.admin_has_permission('leads') or public.admin_has_permission('leads_view_all'))
with check (public.admin_has_permission('leads') or public.admin_has_permission('leads_view_all'));

drop policy if exists "Assigned users can read lead notes" on public.lead_notes;
create policy "Assigned users can read lead notes"
on public.lead_notes
for select
to authenticated
using (public.admin_can_view_lead(lead_id));

drop policy if exists "Admins can create assigned lead notes" on public.lead_notes;
create policy "Admins can create assigned lead notes"
on public.lead_notes
for insert
to authenticated
with check (
    public.admin_has_permission('assign_notes')
    or public.admin_has_permission('leads')
    or public.admin_has_permission('leads_view_all')
);

drop policy if exists "Assigned users can complete lead notes" on public.lead_notes;
create policy "Assigned users can complete lead notes"
on public.lead_notes
for update
to authenticated
using (
    assigned_to = auth.uid()
    or public.admin_has_permission('assign_notes')
    or public.admin_has_permission('users')
)
with check (
    assigned_to = auth.uid()
    or public.admin_has_permission('assign_notes')
    or public.admin_has_permission('users')
);

drop policy if exists "Lead note inquiry readers" on public.lead_note_inquiries;
create policy "Lead note inquiry readers"
on public.lead_note_inquiries
for select
to authenticated
using (
    public.admin_can_view_lead(lead_id)
    or public.admin_has_permission('manage_note_inquiries')
);

drop policy if exists "Assigned users can create note inquiries" on public.lead_note_inquiries;
create policy "Assigned users can create note inquiries"
on public.lead_note_inquiries
for insert
to authenticated
with check (
    public.is_admin()
    and exists (
        select 1
        from public.lead_notes
        where lead_notes.id = note_id
        and lead_notes.assigned_to = auth.uid()
    )
);

drop policy if exists "Managers can reply to note inquiries" on public.lead_note_inquiries;
create policy "Managers can reply to note inquiries"
on public.lead_note_inquiries
for update
to authenticated
using (
    public.admin_has_permission('manage_note_inquiries')
    or public.admin_has_permission('assign_notes')
    or public.admin_has_permission('leads')
    or public.admin_has_permission('leads_view_all')
)
with check (
    public.admin_has_permission('manage_note_inquiries')
    or public.admin_has_permission('assign_notes')
    or public.admin_has_permission('leads')
    or public.admin_has_permission('leads_view_all')
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
    )
);

drop policy if exists "Admins can update notification reads" on public.admin_notifications;
create policy "Admins can update notification reads"
on public.admin_notifications
for update
to authenticated
using (
    public.is_admin()
    and (
        target_user_id is null
        or target_user_id = auth.uid()
    )
)
with check (
    public.is_admin()
    and (
        target_user_id is null
        or target_user_id = auth.uid()
    )
);

drop policy if exists "Users can create profile change requests" on public.profile_change_requests;
create policy "Users can create profile change requests"
on public.profile_change_requests
for insert
to authenticated
with check (public.is_admin() and user_id = auth.uid());

drop policy if exists "Users can read own profile requests" on public.profile_change_requests;
create policy "Users can read own profile requests"
on public.profile_change_requests
for select
to authenticated
using (
    user_id = auth.uid()
    or public.admin_has_permission('users')
    or public.admin_has_permission('profile_requests')
);

drop policy if exists "Managers can review profile requests" on public.profile_change_requests;
create policy "Managers can review profile requests"
on public.profile_change_requests
for update
to authenticated
using (public.admin_has_permission('users') or public.admin_has_permission('profile_requests'))
with check (public.admin_has_permission('users') or public.admin_has_permission('profile_requests'));

insert into public.site_content
    (content_key, label, value, input_type, group_name, sort_order)
values
    ('commercial_registration', 'رقم السجل التجاري', 'رقم السجل التجاري: يضاف من لوحة التحكم', 'text', 'البيانات الرسمية', 120),
    ('tax_number', 'الرقم الضريبي', 'الرقم الضريبي: يضاف من لوحة التحكم', 'text', 'البيانات الرسمية', 121),
    ('bank_account', 'رقم الحساب البنكي', 'رقم الحساب البنكي: يضاف من لوحة التحكم', 'text', 'البيانات الرسمية', 122),
    ('footer_tagline', 'العبارة أسفل الشعار في الفوتر', 'حضور بصري وتجارب مؤثرة في التسويق وتنظيم الفعاليات', 'textarea', 'التواصل والفوتر', 108)
on conflict (content_key) do update
set label = excluded.label,
    input_type = excluded.input_type,
    group_name = excluded.group_name,
    sort_order = excluded.sort_order;
