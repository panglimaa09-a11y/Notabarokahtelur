-- NOTA NEXORA / BAROKAH TELUR
-- Supabase schema for cloud-synced notes.
-- Run this entire file in Supabase SQL Editor.

create table if not exists public.nota_records (
  id uuid primary key default gen_random_uuid(),
  nota_no text not null unique,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_nota_records_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_nota_records_updated_at on public.nota_records;
create trigger trg_nota_records_updated_at
before update on public.nota_records
for each row execute function public.set_nota_records_updated_at();

alter table public.nota_records enable row level security;

drop policy if exists "nota_records_select_public" on public.nota_records;
drop policy if exists "nota_records_insert_public" on public.nota_records;
drop policy if exists "nota_records_update_public" on public.nota_records;
drop policy if exists "nota_records_delete_public" on public.nota_records;

create policy "nota_records_select_public"
on public.nota_records for select
to anon, authenticated using (true);

create policy "nota_records_insert_public"
on public.nota_records for insert
to anon, authenticated with check (true);

create policy "nota_records_update_public"
on public.nota_records for update
to anon, authenticated using (true) with check (true);

create policy "nota_records_delete_public"
on public.nota_records for delete
to anon, authenticated using (true);

grant select, insert, update, delete on public.nota_records to anon, authenticated;
