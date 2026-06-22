-- Muheeb precision admin cleanup
-- Run once after the latest admin update.

update public.site_images
set published = false,
    updated_at = now()
where image_key = 'footer_main_image';

insert into public.site_content
    (content_key, label, value, input_type, group_name, sort_order)
values
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
    sort_order = excluded.sort_order;

drop policy if exists "Admins can read notifications" on public.admin_notifications;
create policy "Admins can read notifications"
on public.admin_notifications
for select
using (
    public.is_admin()
    and (
        target_user_id is null
        or target_user_id = auth.uid()
    )
);

drop policy if exists "Admins can create notifications" on public.admin_notifications;
create policy "Admins can create notifications"
on public.admin_notifications
for insert
with check (public.is_admin());

drop policy if exists "Admins can update notification reads" on public.admin_notifications;
create policy "Admins can update notification reads"
on public.admin_notifications
for update
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
