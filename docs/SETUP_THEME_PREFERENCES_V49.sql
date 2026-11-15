-- OPTIONAL: synchronize PERSONAL theme settings between devices. Run as project owner in SQL Editor.
-- Does not alter existing festival settings, exam banks, profiles or authentication.
create table if not exists public.examlab_theme_preferences_v49 (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint v49_pref_object check (jsonb_typeof(preferences) = 'object' and octet_length(preferences::text) <= 4096)
);
alter table public.examlab_theme_preferences_v49 enable row level security;
revoke all on table public.examlab_theme_preferences_v49 from anon, public;
grant select, insert, update, delete on table public.examlab_theme_preferences_v49 to authenticated;
drop policy if exists v49_select_own on public.examlab_theme_preferences_v49;
create policy v49_select_own on public.examlab_theme_preferences_v49 for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists v49_insert_own on public.examlab_theme_preferences_v49;
create policy v49_insert_own on public.examlab_theme_preferences_v49 for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists v49_update_own on public.examlab_theme_preferences_v49;
create policy v49_update_own on public.examlab_theme_preferences_v49 for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists v49_delete_own on public.examlab_theme_preferences_v49;
create policy v49_delete_own on public.examlab_theme_preferences_v49 for delete to authenticated using ((select auth.uid()) = user_id);
