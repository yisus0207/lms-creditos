-- Ejecutar en Supabase SQL Editor (una vez)
-- Gastos personales – sección "Mis gastos"

create table if not exists public.gastos (
  id uuid primary key default gen_random_uuid(),
  categoria text not null,
  monto numeric(15,2) not null check (monto >= 0),
  fecha date not null default current_date,
  created_at timestamptz default now()
);

alter table public.gastos enable row level security;

-- Ajusta según tu política; para uso personal con anon autenticado:
create policy "gastos_all_authenticated"
  on public.gastos
  for all
  to authenticated
  using (true)
  with check (true);

-- Si también usas anon sin auth (no recomendado), descomenta:
-- create policy "gastos_all_anon" on public.gastos for all to anon using (true) with check (true);
