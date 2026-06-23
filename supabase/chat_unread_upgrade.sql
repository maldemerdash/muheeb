-- Muheeb chat unread counters upgrade
-- Run once in Supabase Dashboard > SQL Editor.
-- This is an addition. Do not delete or replace old SQL files.

alter table public.admin_chat_messages
add column if not exists read_by uuid[] not null default '{}'::uuid[];

grant select, insert, update on table public.admin_chat_messages to authenticated;

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

do $$
begin
    alter publication supabase_realtime add table public.admin_chat_messages;
exception
    when duplicate_object then null;
    when undefined_object then null;
end $$;
