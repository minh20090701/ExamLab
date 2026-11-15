-- V50: 20 site-wide themes. Run once AFTER V32; safe to rerun. No user/exam data changes.
begin;
do $$
declare c record;
begin
 if to_regclass('public.examlab_site_festival') is null then raise exception 'Cần chạy SETUP_FESTIVALS_V32.sql trước.'; end if;
 for c in select conname from pg_constraint where conrelid='public.examlab_site_festival'::regclass and contype='c' and conkey=ARRAY[(select attnum from pg_attribute where attrelid='public.examlab_site_festival'::regclass and attname='theme_id')]::smallint[] loop
  execute format('alter table public.examlab_site_festival drop constraint %I',c.conname);
 end loop;
end $$;
alter table public.examlab_site_festival add constraint examlab_site_festival_theme_id_check check(theme_id in ('classic','christmas','tet','midautumn','halloween','night','sakura','rain','forest','autumn','ocean','sunset','cyber','cultivation','magic','cute','winter','desert','blackgold','space'));
create or replace function public.examlab_v32_set_festival(
  p_theme text,p_music text,p_url text,p_label text,p_effects boolean,p_revision bigint
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare u uuid:=auth.uid(); current_revision bigint; target_url text:=btrim(coalesce(p_url,'')); target_label text:=btrim(coalesce(p_label,''));
begin
  if u is null or not exists(select 1 from public.examlab_material_admins where user_id=u) then
    raise exception 'Chỉ quản trị viên được đổi giao diện và nhạc chung.' using errcode='42501';
  end if;
  if p_theme is null or p_theme not in ('classic','christmas','tet','midautumn','halloween','night','sakura','rain','forest','autumn','ocean','sunset','cyber','cultivation','magic','cute','winter','desert','blackgold','space') then raise exception 'Giao diện không hợp lệ.'; end if;
  if p_music is null or p_music not in ('auto','off','halloween','christmas','tet','midautumn','sakura','night','custom') then raise exception 'Bản nhạc không hợp lệ.'; end if;
  if p_effects is null or p_revision is null then raise exception 'Thiếu cấu hình hoặc phiên bản.'; end if;
  if length(target_label)>80 or length(target_url)>2048 then raise exception 'Tên hoặc đường dẫn nhạc quá dài.'; end if;
  if p_music='custom' then
    if target_url !~* '^https://[^/?#[:space:]@]+/[^?[:space:]#]*[.](mp3|ogg|wav|m4a)([?][^[:space:]#]*)?$' then
      raise exception 'Dùng đường dẫn HTTPS công khai tới file MP3, OGG, WAV hoặc M4A, không chứa tài khoản/mật khẩu.';
    end if;
  else target_url:='';target_label:='';
  end if;
  select revision into current_revision from public.examlab_site_festival where id=1 for update;
  if current_revision is null then raise exception 'Chưa khởi tạo cài đặt V32.'; end if;
  if current_revision<>p_revision then
    raise exception 'Cài đặt đã được quản trị viên khác cập nhật. Tải lại cài đặt trước khi lưu.' using errcode='40001';
  end if;
  update public.examlab_site_festival set theme_id=p_theme,music_id=p_music,music_url=target_url,music_label=target_label,
    effects=p_effects,revision=revision+1,updated_at=now(),updated_by=u where id=1;
  return public.examlab_v32_get_festival();
end $$;
revoke all on function public.examlab_v32_set_festival(text,text,text,text,boolean,bigint) from public,anon,authenticated;
grant execute on function public.examlab_v32_set_festival(text,text,text,text,boolean,bigint) to authenticated;
notify pgrst,'reload schema';
commit;
