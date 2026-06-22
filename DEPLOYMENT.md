# نشر موقع مهيب على GitHub + Supabase + Vercel

هذه النسخة جاهزة للنشر كواجهة Static على Vercel، مع قاعدة بيانات وصور على Supabase.

## 1. إنشاء مشروع Supabase

1. افتح https://supabase.com/
2. أنشئ Project جديد.
3. من `Project Settings > API` انسخ:
   - `Project URL`
   - `anon public key`
4. افتح `SQL Editor`.
5. شغّل الملف:

```text
supabase/schema.sql
```

6. لتفعيل إدارة نصوص الموقع وصوره واختيارات النموذج من لوحة التحكم، شغّل الملف:

```text
supabase/cms_upgrade.sql
```

7. لتفعيل المستخدمين والصلاحيات وملاحظات المتابعة المسندة والإشعارات، شغّل الملف:

```text
supabase/team_permissions_upgrade.sql
```

8. لتفعيل التحديثات الأخيرة مثل تفاصيل صلاحيات طلبات العملاء، قراءة الإشعارات، استفسارات الملاحظات، طلبات تعديل الملف الشخصي، وتفاصيل الفعاليات الموسعة، شغّل الملف:

```text
supabase/workflow_profile_events_upgrade.sql
```

9. لتفعيل ردود الاستفسارات داخل الملاحظات، وضبط الإشعارات لكل مستخدم، وإضافة صور خلفية دخول المشرف وصورة الفوتر، شغّل الملف:

```text
supabase/notifications_inquiries_media_upgrade.sql
```

## 2. إنشاء مستخدم لوحة التحكم

1. من Supabase افتح `Authentication > Users`.
2. اضغط `Add user`.
3. أضف بريد المشرف وكلمة مرور قوية.
4. انسخ `User UID` للمستخدم.
5. من `SQL Editor` شغّل:

```sql
insert into public.admin_users (user_id)
values ('PASTE_USER_UID_HERE')
on conflict (user_id) do nothing;
```

لا تضف أي عميل عادي إلى جدول `admin_users`.

## 3. ربط الموقع بـ Supabase

افتح الملف:

```text
supabase-config.js
```

وضع بيانات مشروعك:

```js
window.MUHEEB_SUPABASE = {
    url: "https://YOUR_PROJECT.supabase.co",
    anonKey: "YOUR_ANON_PUBLIC_KEY",
    storageBucket: "event-images",
};
```

مهم: لا تستخدم `service_role key` داخل الموقع أبدًا.

## 4. رفع الملفات على GitHub

من داخل مجلد الموقع:

```bash
git init
git add .
git commit -m "Deploy Muheeb website with Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

ملفات قاعدة البيانات المحلية وملفات PDF/PSD الثقيلة مستبعدة في `.gitignore`.

## 5. إنشاء حساب Vercel ونشر الموقع

1. افتح https://vercel.com/
2. اختر `Continue with GitHub`.
3. اضغط `Add New Project`.
4. اختر مستودع GitHub الخاص بموقع مهيب.
5. الإعدادات:
   - Framework Preset: `Other`
   - Build Command: اتركه فارغًا
   - Output Directory: اتركه فارغًا أو ضع `.`
6. اضغط `Deploy`.

بعد النشر ستحصل على رابط مثل:

```text
https://your-project.vercel.app
```

لوحة التحكم ستكون على:

```text
https://your-project.vercel.app/admin
```

## 6. طريقة الاستخدام بعد النشر

- طلبات العملاء تظهر في لوحة التحكم داخل قسم `طلبات العملاء`.
- نصوص الصفحة الرئيسية والأقسام تدار من قسم `محتوى الموقع`.
- صور الموقع العامة تدار من قسم `صور الموقع`.
- خلفية شاشة دخول المشرف وصورة الفوتر تداران من قسم `صور الموقع`.
- اختيارات خانة `مجال الاهتمام` في نموذج الطلب تدار من قسم `اختيارات النموذج`.
- الفعاليات وصور المعرض تدار من قسم `الفعاليات والمعرض`.
- المستخدمون وصلاحياتهم تدار من قسم `المستخدمون`.
- ملاحظات متابعة طلبات العملاء يمكن إسنادها للمستخدمين ومتابعة إنجازها.
- صور الفعاليات ترفع إلى Supabase Storage bucket باسم `event-images`.
- الموقع العام يقرأ فقط الفعاليات المنشورة.

## 7. اختبار سريع

1. افتح الموقع العام وأرسل طلب تجربة.
2. افتح `/admin` وسجّل دخولك ببريد المشرف.
3. تأكد أن الطلب ظهر في `طلبات العملاء`.
4. أضف فعالية وارفع صورة.
5. تأكد أنها ظهرت في قسم `أعمالنا`.
