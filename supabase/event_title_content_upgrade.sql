-- Muheeb event title size and editable default event detail title.
-- Run once in Supabase SQL Editor.

alter table public.events
add column if not exists title_size text not null default 'normal';

insert into public.site_content
    (content_key, label, value, input_type, group_name, sort_order)
values
    (
        'event_default_section_title',
        'عنوان القسم الافتراضي في أسفل الفعالية',
        'تفاصيل التجربة',
        'text',
        'صفحة الفعالية',
        181
    )
on conflict (content_key) do update
set
    label = excluded.label,
    input_type = excluded.input_type,
    group_name = excluded.group_name,
    sort_order = excluded.sort_order;
