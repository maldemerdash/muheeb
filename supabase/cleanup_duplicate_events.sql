-- Optional cleanup for duplicate default events.
-- Run once if the dashboard shows 8 default events instead of 4.

delete from public.events
where id in (
    select id
    from (
        select
            id,
            row_number() over (
                partition by title, category
                order by id asc
            ) as row_number
        from public.events
        where title in (
            'المؤتمرات والمعارض',
            'الحملات التسويقية',
            'التطبيقات البصرية',
            'التنفيذ والتوثيق'
        )
    ) duplicates
    where duplicates.row_number > 1
);
