-- Muheeb chat cleanup and attachments upgrade
-- Run once in Supabase Dashboard > SQL Editor.
-- This is an addition. Do not delete or replace old SQL files.

alter table public.admin_chat_messages
add column if not exists read_by uuid[] not null default '{}'::uuid[];

grant select, insert, update, delete on table public.admin_chat_messages to authenticated;

drop policy if exists "Admins can mark their chat messages read" on public.admin_chat_messages;
create policy "Admins can mark their chat messages read"
on public.admin_chat_messages
for update
to authenticated
using (
    public.is_admin()
    and recipient_user_id = auth.uid()
)
with check (
    public.is_admin()
    and recipient_user_id = auth.uid()
);

drop policy if exists "Admins can delete their chat messages" on public.admin_chat_messages;
create policy "Admins can delete their chat messages"
on public.admin_chat_messages
for delete
to authenticated
using (
    public.is_admin()
    and (
        sender_user_id = auth.uid()
        or recipient_user_id = auth.uid()
    )
);

update storage.buckets
set allowed_mime_types = null,
    file_size_limit = greatest(coalesce(file_size_limit, 0), 52428800)
where id = 'event-images';
