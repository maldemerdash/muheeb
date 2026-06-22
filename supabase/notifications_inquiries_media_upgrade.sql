-- Muheeb notifications, inquiries replies, and media keys upgrade
-- Run once in Supabase Dashboard > SQL Editor after the previous upgrade files.

alter table public.lead_note_inquiries
add column if not exists reply_body text,
add column if not exists reply_by uuid references auth.users(id) on delete set null,
add column if not exists reply_at timestamptz;

alter table public.interest_options
add column if not exists option_type text not null default 'interest';

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

update public.admin_users
set permissions = permissions || jsonb_build_object(
    'manage_note_inquiries', true,
    'site_images', true,
    'interest_options', true
)
where role = 'owner'
or coalesce((permissions ->> 'all')::boolean, false) = true;

insert into public.site_images
    (image_key, label, group_name, image_path, alt_text, published, sort_order)
values
    ('footer_logo', 'شعار الفوتر', 'footer', 'assets/logo-meheib.png', 'شعار مهيب', true, 70),
    ('admin_login_background', 'خلفية شاشة دخول المشرف', 'admin_login', 'assets/brand-palette.jpg', 'خلفية لوحة التحكم', true, 80)
on conflict (image_key) do update
set label = excluded.label,
    group_name = excluded.group_name,
    image_path = coalesce(nullif(public.site_images.image_path, ''), excluded.image_path),
    alt_text = excluded.alt_text,
    published = excluded.published,
    sort_order = excluded.sort_order;

insert into public.interest_options
    (label, value, option_type, published, sort_order)
values
    ('فعاليات', 'event', 'event_category', true, 1),
    ('تسويق', 'marketing', 'event_category', true, 2),
    ('هوية', 'identity', 'event_category', true, 3),
    ('تشغيل', 'operation', 'event_category', true, 4)
on conflict (value) do update
set label = excluded.label,
    option_type = excluded.option_type,
    published = excluded.published,
    sort_order = excluded.sort_order;
