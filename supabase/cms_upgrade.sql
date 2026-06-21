-- Muheeb CMS upgrade
-- Run this file once in Supabase Dashboard > SQL Editor after the original schema.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create table if not exists public.site_content (
    content_key text primary key,
    label text not null,
    value text not null default '',
    input_type text not null default 'text' check (input_type in ('text', 'textarea', 'url', 'email', 'phone')),
    group_name text not null default 'عام',
    sort_order integer not null default 0,
    updated_at timestamptz not null default now()
);

create table if not exists public.site_images (
    id bigint generated always as identity primary key,
    image_key text not null unique,
    label text not null,
    group_name text not null default 'صور الموقع',
    image_path text not null,
    alt_text text,
    published boolean not null default true,
    sort_order integer not null default 0,
    updated_at timestamptz not null default now()
);

create table if not exists public.interest_options (
    id bigint generated always as identity primary key,
    label text not null,
    value text not null unique,
    published boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists set_site_content_updated_at on public.site_content;
create trigger set_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists set_site_images_updated_at on public.site_images;
create trigger set_site_images_updated_at
before update on public.site_images
for each row execute function public.set_updated_at();

drop trigger if exists set_interest_options_updated_at on public.interest_options;
create trigger set_interest_options_updated_at
before update on public.interest_options
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;
alter table public.site_images enable row level security;
alter table public.interest_options enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage site content" on public.site_content;
create policy "Admins can manage site content"
on public.site_content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published site images" on public.site_images;
create policy "Public can read published site images"
on public.site_images
for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins can manage site images" on public.site_images;
create policy "Admins can manage site images"
on public.site_images
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published interest options" on public.interest_options;
create policy "Public can read published interest options"
on public.interest_options
for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins can manage interest options" on public.interest_options;
create policy "Admins can manage interest options"
on public.interest_options
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_content
    (content_key, label, value, input_type, group_name, sort_order)
values
    ('hero_badge_small', 'عبارة بطاقة الهيرو الصغيرة', 'من الفكرة إلى التجربة', 'text', 'الصفحة الرئيسية', 10),
    ('hero_badge_title', 'عبارة بطاقة الهيرو الكبيرة', 'حضور مؤثر لا يُنسى', 'text', 'الصفحة الرئيسية', 11),
    ('hero_eyebrow', 'وصف أعلى العنوان الرئيسي', 'مهيب للتسويق وتنظيم الفعاليات', 'text', 'الصفحة الرئيسية', 12),
    ('hero_title', 'العنوان الرئيسي', 'نصنع تجارب مؤثرة بحضور يليق باسمك', 'textarea', 'الصفحة الرئيسية', 13),
    ('hero_copy', 'نص العنوان الرئيسي', 'تعكس هوية مهيب مزيجًا من الهيبة والابتكار، وتحول الفكرة إلى حملة أو فعالية متقنة تترك أثرًا قويًا وذكرى لا تُنسى.', 'textarea', 'الصفحة الرئيسية', 14),
    ('hero_primary_button', 'زر الطلب الرئيسي', 'اطلب استشارة', 'text', 'الصفحة الرئيسية', 15),
    ('hero_secondary_button', 'زر استعراض الأعمال', 'استعرض الأعمال', 'text', 'الصفحة الرئيسية', 16),
    ('about_eyebrow', 'عنوان صغير لقسم عن مهيب', 'عن مهيب', 'text', 'عن مهيب', 20),
    ('about_title', 'عنوان قسم عن مهيب', 'هوية مبنية على الهيبة، الاتزان، والابتكار.', 'textarea', 'عن مهيب', 21),
    ('about_text', 'نص تعريف مهيب', 'يمتد خط مهيب بانسيابية عربية متزنة ليجسد رحلة الفعالية أو الحملة من الفكرة إلى التجربة، مع حضور بصري محترف يعزز الثقة ويصنع انطباعًا ثابتًا.', 'textarea', 'عن مهيب', 22),
    ('metric_1_number', 'رقم الإحصائية الأولى', '01', 'text', 'عن مهيب', 23),
    ('metric_1_label', 'نص الإحصائية الأولى', 'تسويق وتجارب', 'text', 'عن مهيب', 24),
    ('metric_2_number', 'رقم الإحصائية الثانية', '02', 'text', 'عن مهيب', 25),
    ('metric_2_label', 'نص الإحصائية الثانية', 'تنظيم فعاليات', 'text', 'عن مهيب', 26),
    ('metric_3_number', 'رقم الإحصائية الثالثة', '03', 'text', 'عن مهيب', 27),
    ('metric_3_label', 'نص الإحصائية الثالثة', 'هوية وتطبيقات', 'text', 'عن مهيب', 28),
    ('identity_eyebrow', 'عنوان صغير لمعرض الهوية', 'تطبيقات الهوية', 'text', 'معرض الهوية', 30),
    ('identity_title', 'عنوان معرض الهوية', 'تفاصيل بصرية تعزز حضور العلامة', 'textarea', 'معرض الهوية', 31),
    ('services_eyebrow', 'عنوان صغير للخدمات', 'خدمات مهيب', 'text', 'الخدمات', 40),
    ('services_title', 'عنوان الخدمات', 'حلول متكاملة للحملات والفعاليات', 'textarea', 'الخدمات', 41),
    ('service_1_title', 'عنوان الخدمة الأولى', 'تنظيم الفعاليات', 'text', 'الخدمات', 42),
    ('service_1_text', 'وصف الخدمة الأولى', 'تخطيط، تشغيل، تنسيق موردين، وإدارة تفاصيل التجربة من البداية حتى لحظة الختام.', 'textarea', 'الخدمات', 43),
    ('service_2_title', 'عنوان الخدمة الثانية', 'الحملات التسويقية', 'text', 'الخدمات', 44),
    ('service_2_text', 'وصف الخدمة الثانية', 'تصميم الفكرة، الرسالة، المسار البصري، وخطة الظهور بما يخدم أهداف الحملة.', 'textarea', 'الخدمات', 45),
    ('service_3_title', 'عنوان الخدمة الثالثة', 'الهوية والتطبيقات', 'text', 'الخدمات', 46),
    ('service_3_text', 'وصف الخدمة الثالثة', 'تحويل الهوية إلى أدوات ملموسة: بطاقات، مطبوعات، أجنحة، ولوحات تعريفية.', 'textarea', 'الخدمات', 47),
    ('service_button', 'نص زر الخدمة', 'عرض التفاصيل', 'text', 'الخدمات', 48),
    ('projects_eyebrow', 'عنوان صغير للأعمال', 'مجالات العمل', 'text', 'الأعمال والفعاليات', 50),
    ('projects_title', 'عنوان الأعمال', 'ما الذي يمكن أن تصنعه مهيب؟', 'textarea', 'الأعمال والفعاليات', 51),
    ('features_eyebrow', 'عنوان صغير للمميزات', 'مميزات مهيب', 'text', 'المميزات', 60),
    ('features_title', 'عنوان المميزات', 'تفاصيل صغيرة تصنع حضورًا أكبر', 'textarea', 'المميزات', 61),
    ('feature_1_title', 'عنوان الميزة الأولى', 'احترافية التنفيذ', 'text', 'المميزات', 62),
    ('feature_1_text', 'نص الميزة الأولى', 'تخطيط واضح، أدوار منظمة، ومخرجات تليق باسم الجهة.', 'textarea', 'المميزات', 63),
    ('feature_2_title', 'عنوان الميزة الثانية', 'تجربة منسجمة', 'text', 'المميزات', 64),
    ('feature_2_text', 'نص الميزة الثانية', 'رسالة واحدة تنتقل من الإعلان إلى مساحة الفعالية.', 'textarea', 'المميزات', 65),
    ('feature_3_title', 'عنوان الميزة الثالثة', 'هوية راقية', 'text', 'المميزات', 66),
    ('feature_3_text', 'نص الميزة الثالثة', 'ألوان وخطوط وتطبيقات تحافظ على الطابع العام للعلامة.', 'textarea', 'المميزات', 67),
    ('feature_4_title', 'عنوان الميزة الرابعة', 'رحلة واضحة', 'text', 'المميزات', 68),
    ('feature_4_text', 'نص الميزة الرابعة', 'من الفكرة الأولية إلى التنفيذ والتوثيق النهائي.', 'textarea', 'المميزات', 69),
    ('execution_eyebrow', 'عنوان صغير لرحلة التنفيذ', 'رحلة التنفيذ', 'text', 'رحلة التنفيذ', 70),
    ('execution_title', 'عنوان رحلة التنفيذ', 'لا نترك التجربة للصدفة.', 'textarea', 'رحلة التنفيذ', 71),
    ('execution_text', 'نص رحلة التنفيذ', 'نبدأ بفهم الهدف، ثم نبني فكرة قابلة للتنفيذ، ونحوّلها إلى تفاصيل تشغيلية وبصرية تحفظ جودة الحضور من أول إعلان حتى آخر لحظة في الحدث.', 'textarea', 'رحلة التنفيذ', 72),
    ('execution_step_1', 'خطوة التنفيذ الأولى', 'تخطيط الفكرة', 'text', 'رحلة التنفيذ', 73),
    ('execution_step_2', 'خطوة التنفيذ الثانية', 'تشغيل وتنفيذ', 'text', 'رحلة التنفيذ', 74),
    ('execution_step_3', 'خطوة التنفيذ الثالثة', 'توثيق واعتماد', 'text', 'رحلة التنفيذ', 75),
    ('interest_eyebrow', 'عنوان صغير لنموذج الطلب', 'سجل اهتمامك', 'text', 'نموذج الطلب', 80),
    ('interest_title', 'عنوان نموذج الطلب', 'حدثنا عن فكرتك، ونحوّلها إلى تجربة قابلة للتنفيذ.', 'textarea', 'نموذج الطلب', 81),
    ('interest_text', 'نص نموذج الطلب', 'املأ النموذج وسيتم التواصل معك لمناقشة نوع الفعالية أو الحملة، نطاق العمل، والاحتياجات البصرية والتشغيلية.', 'textarea', 'نموذج الطلب', 82),
    ('form_name_label', 'حقل الاسم', 'الاسم', 'text', 'نموذج الطلب', 83),
    ('form_country_label', 'حقل رمز الدولة', 'رمز الدولة', 'text', 'نموذج الطلب', 84),
    ('form_phone_label', 'حقل الجوال', 'رقم الجوال', 'text', 'نموذج الطلب', 85),
    ('form_interest_label', 'حقل الاهتمام', 'مجال الاهتمام', 'text', 'نموذج الطلب', 86),
    ('form_source_label', 'حقل مصدر المعرفة', 'كيف سمعت عن مهيب؟', 'text', 'نموذج الطلب', 87),
    ('form_message_label', 'حقل الملاحظات', 'ملاحظاتك', 'text', 'نموذج الطلب', 88),
    ('form_message_placeholder', 'تلميح حقل الملاحظات', 'اكتب نوع الفعالية، موعدها التقريبي، أو الهدف من الحملة', 'textarea', 'نموذج الطلب', 89),
    ('form_submit_button', 'زر إرسال الطلب', 'إرسال الطلب', 'text', 'نموذج الطلب', 90),
    ('contact_phone', 'رقم الاتصال', '+966 59 957 5691', 'phone', 'التواصل والفوتر', 100),
    ('contact_whatsapp_number', 'رقم واتساب بدون علامة +', '966599575691', 'phone', 'التواصل والفوتر', 101),
    ('contact_whatsapp_label', 'نص رابط واتساب', 'واتساب', 'text', 'التواصل والفوتر', 102),
    ('contact_email', 'البريد الإلكتروني', 'info.muheeb0@gmail.com', 'email', 'التواصل والفوتر', 103),
    ('contact_location', 'الموقع النصي', 'المدينة المنورة، السعودية', 'text', 'التواصل والفوتر', 104),
    ('footer_text', 'نص الفوتر', 'مهيب - حضور بصري وتجارب مؤثرة في التسويق وتنظيم الفعاليات.', 'textarea', 'التواصل والفوتر', 105),
    ('footer_contact_title', 'عنوان التواصل في الفوتر', 'تواصل معنا', 'text', 'التواصل والفوتر', 106),
    ('footer_copyright', 'حقوق النشر', 'جميع الحقوق محفوظة لمهيب 2026 ©', 'text', 'التواصل والفوتر', 107)
on conflict (content_key) do update
set label = excluded.label,
    input_type = excluded.input_type,
    group_name = excluded.group_name,
    sort_order = excluded.sort_order;

insert into public.site_images
    (image_key, label, group_name, image_path, alt_text, published, sort_order)
values
    ('hero_main', 'صورة الهيرو الرئيسية', 'site_core', 'assets/identity-wall-hero.png', 'هوية مهيب في الواجهة الرئيسية', true, 10),
    ('hero_logo', 'شعار الهيرو', 'site_core', 'assets/logo-meheib.png', 'شعار مهيب', true, 11),
    ('service_1_image', 'صورة خدمة تنظيم الفعاليات', 'services', 'assets/identity-wall-clean.png', 'تنفيذ تجربة بصرية للفعالية', true, 20),
    ('service_2_image', 'صورة خدمة الحملات التسويقية', 'services', 'assets/brand-palette.jpg', 'حملات تسويقية بهوية مهيب', true, 21),
    ('service_3_image', 'صورة خدمة الهوية والتطبيقات', 'services', 'assets/identity-cards-clean.png', 'تطبيقات الهوية البصرية', true, 22),
    ('execution_image', 'صورة رحلة التنفيذ', 'site_core', 'assets/identity-stamp-clean.png', 'توثيق واعتماد مخرجات مهيب', true, 30),
    ('interest_background', 'خلفية نموذج الطلب', 'site_core', 'assets/brand-palette.jpg', 'لوحة ألوان مهيب', true, 31),
    ('footer_logo', 'شعار الفوتر', 'site_core', 'assets/logo-meheib.png', 'شعار مهيب', true, 40),
    ('identity_gallery_1', 'تطبيق الشعار', 'identity_gallery', 'assets/identity-wall-clean.png', 'تطبيق شعار مهيب على واجهة زجاجية', true, 50),
    ('identity_gallery_2', 'بطاقات العمل', 'identity_gallery', 'assets/identity-cards-clean.png', 'بطاقات عمل مهيب', true, 51),
    ('identity_gallery_3', 'الختم والتوثيق', 'identity_gallery', 'assets/identity-stamp-clean.png', 'ختم مهيب الرسمي', true, 52),
    ('identity_gallery_4', 'ألوان الهوية', 'identity_gallery', 'assets/brand-palette.jpg', 'لوحة ألوان مهيب', true, 53),
    ('identity_gallery_5', 'الشعار الأساسي', 'identity_gallery', 'assets/logo-meheib.png', 'شعار مهيب', true, 54)
on conflict (image_key) do update
set label = excluded.label,
    group_name = excluded.group_name,
    sort_order = excluded.sort_order;

insert into public.interest_options
    (label, value, published, sort_order)
values
    ('تنظيم فعالية أو معرض', 'تنظيم فعالية أو معرض', true, 1),
    ('حملة تسويقية', 'حملة تسويقية', true, 2),
    ('هوية وتطبيقات بصرية', 'هوية وتطبيقات بصرية', true, 3),
    ('تشغيل وتوثيق تجربة', 'تشغيل وتوثيق تجربة', true, 4),
    ('استشارة عامة', 'استشارة عامة', true, 5)
on conflict (value) do update
set label = excluded.label,
    sort_order = excluded.sort_order;
