-- Muheeb event categories and dropdown lists upgrade.
-- Run once in Supabase Dashboard > SQL Editor.

alter table public.events
drop constraint if exists events_category_check;

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

alter table public.interest_options
add column if not exists option_type text not null default 'interest';

update public.interest_options
set option_type = 'interest'
where option_type is null
or option_type = '';

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
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.site_content
    (content_key, label, value, input_type, group_name, sort_order)
values
    ('nav_home_label', 'اسم رابط الرئيسية', 'الرئيسية', 'text', 'الهيدر', 1),
    ('nav_about_label', 'اسم رابط عن مهيب', 'عن مهيب', 'text', 'الهيدر', 2),
    ('nav_services_label', 'اسم رابط الخدمات', 'الخدمات', 'text', 'الهيدر', 3),
    ('nav_projects_label', 'اسم رابط أعمالنا', 'أعمالنا', 'text', 'الهيدر', 4),
    ('nav_execution_label', 'اسم رابط رحلة التنفيذ', 'رحلة التنفيذ', 'text', 'الهيدر', 5),
    ('nav_interest_label', 'اسم رابط تسجيل اهتمام', 'تسجيل اهتمام', 'text', 'الهيدر', 6),
    ('nav_contact_label', 'اسم رابط تواصل معنا', 'تواصل معنا', 'text', 'الهيدر', 7),
    ('event_about_eyebrow', 'عنوان صغير لقسم عن الفعالية', 'عن الفعالية', 'text', 'صفحة الفعالية', 170),
    ('event_highlights_eyebrow', 'عنوان صغير للنقاط المختصرة', 'نقاط مختصرة للعرض', 'text', 'صفحة الفعالية', 171),
    ('event_highlights_title', 'عنوان النقاط المختصرة', 'ملخص سريع لما يميز الفعالية', 'text', 'صفحة الفعالية', 172),
    ('event_achievements_eyebrow', 'عنوان صغير للإنجازات', 'الإنجازات المحققة', 'text', 'صفحة الفعالية', 173),
    ('event_achievements_title', 'عنوان الإنجازات', 'نتائج ومخرجات الفعالية', 'text', 'صفحة الفعالية', 174),
    ('event_gallery_eyebrow', 'عنوان صغير لمعرض صور الفعالية', 'معرض الصور', 'text', 'صفحة الفعالية', 175),
    ('event_gallery_title', 'عنوان معرض صور الفعالية', 'مشاهد من الفعالية', 'text', 'صفحة الفعالية', 176),
    ('event_partners_eyebrow', 'عنوان صغير للجهات المشاركة', 'الجهات والشركاء', 'text', 'صفحة الفعالية', 177),
    ('event_partners_title', 'عنوان الجهات المشاركة', 'الجهات المشاركة أو الداعمة', 'text', 'صفحة الفعالية', 178),
    ('event_sections_eyebrow', 'عنوان صغير لأقسام الفعالية', 'تفاصيل إضافية', 'text', 'صفحة الفعالية', 179),
    ('event_sections_title', 'عنوان أقسام الفعالية', 'كل ما يتعلق بالفعالية', 'text', 'صفحة الفعالية', 180)
on conflict (content_key) do update
set label = excluded.label,
    input_type = excluded.input_type,
    group_name = excluded.group_name,
    sort_order = excluded.sort_order,
    updated_at = now();
