-- Muheeb Supabase schema
-- Run this file in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
    user_id uuid primary key references auth.users(id) on delete cascade,
    created_at timestamptz not null default now()
);

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
    );
$$;

create table if not exists public.leads (
    id bigint generated always as identity primary key,
    name text not null,
    country_code text not null default '966',
    phone text not null,
    service text not null default 'استشارة عامة',
    source text not null,
    message text,
    status text not null default 'new' check (status in ('new', 'contacted', 'done', 'archived')),
    admin_notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.events (
    id bigint generated always as identity primary key,
    title text not null,
    category text not null check (category in ('event', 'marketing', 'identity', 'operation')),
    location text,
    event_date text,
    description text not null,
    highlights text[] not null default '{}',
    cover_image text,
    published boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.event_images (
    id bigint generated always as identity primary key,
    event_id bigint not null references public.events(id) on delete cascade,
    image_path text not null,
    alt_text text,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.leads enable row level security;
alter table public.events enable row level security;
alter table public.event_images enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Anyone can create leads" on public.leads;
create policy "Anyone can create leads"
on public.leads
for insert
to anon, authenticated
with check (
    length(trim(name)) > 0
    and length(trim(phone)) >= 8
    and length(trim(source)) > 0
);

drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
on public.leads
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
on public.leads
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins can create events" on public.events;
create policy "Admins can create events"
on public.events
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
on public.events
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read images for published events" on public.event_images;
create policy "Public can read images for published events"
on public.event_images
for select
to anon, authenticated
using (
    exists (
        select 1
        from public.events
        where events.id = event_images.event_id
        and (events.published = true or public.is_admin())
    )
);

drop policy if exists "Admins can create event images" on public.event_images;
create policy "Admins can create event images"
on public.event_images
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update event images" on public.event_images;
create policy "Admins can update event images"
on public.event_images
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete event images" on public.event_images;
create policy "Admins can delete event images"
on public.event_images
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'event-images',
    'event-images',
    true,
    10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read event image files" on storage.objects;
create policy "Public can read event image files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'event-images');

drop policy if exists "Admins can upload event image files" on storage.objects;
create policy "Admins can upload event image files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'event-images' and public.is_admin());

drop policy if exists "Admins can update event image files" on storage.objects;
create policy "Admins can update event image files"
on storage.objects
for update
to authenticated
using (bucket_id = 'event-images' and public.is_admin())
with check (bucket_id = 'event-images' and public.is_admin());

drop policy if exists "Admins can delete event image files" on storage.objects;
create policy "Admins can delete event image files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'event-images' and public.is_admin());

insert into public.events
    (title, category, location, event_date, description, highlights, cover_image, published, sort_order)
select *
from (
    values
        (
            'المؤتمرات والمعارض',
            'event',
            'المدينة المنورة',
            'تخطيط وتشغيل',
            'إدارة تجربة الحضور، المسارات، نقاط التسجيل، وتطبيق الهوية داخل مساحة الحدث.',
            array['تجربة حضور', 'تنسيق ميداني', 'هوية المكان'],
            'assets/identity-wall-clean.png',
            true,
            1
        ),
        (
            'الحملات التسويقية',
            'marketing',
            'السعودية',
            'فكرة ورسالة',
            'بناء فكرة الحملة ورسائلها، وتنسيق الظهور البصري عبر القنوات والمواد.',
            array['خطة ظهور', 'مسار بصري', 'محتوى تسويقي'],
            'assets/brand-palette.jpg',
            true,
            2
        ),
        (
            'التطبيقات البصرية',
            'identity',
            'حسب نطاق المشروع',
            'تصميم واعتماد',
            'مطبوعات، بطاقات، لوحات، وأدوات تعريف تحفظ اتساق العلامة في كل نقطة تواصل.',
            array['شعار واضح', 'نظام ألوان', 'ملفات جاهزة'],
            'assets/identity-cards-clean.png',
            true,
            3
        ),
        (
            'التنفيذ والتوثيق',
            'operation',
            'مواقع الفعاليات',
            'تشغيل وتوثيق',
            'إدارة التفاصيل التشغيلية، اعتماد المواد، وتوثيق المخرجات لتظهر الفعالية بصورة محترفة.',
            array['متابعة دقيقة', 'اعتماد مخرجات', 'تنسيق شركاء'],
            'assets/identity-stamp-clean.png',
            true,
            4
        )
) as seed_events(title, category, location, event_date, description, highlights, cover_image, published, sort_order)
where not exists (
    select 1
    from public.events
    where events.title = seed_events.title
    and events.category = seed_events.category
);

-- Optional CMS upgrade:
-- To enable editing all public-site texts, site images, and interest options
-- from the admin panel, run supabase/cms_upgrade.sql after this schema.
