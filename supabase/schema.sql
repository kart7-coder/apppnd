-- Esquema do app. Rode UMA vez no Supabase: Dashboard → SQL Editor → New query → cole tudo → Run.
-- Pode rodar de novo sem quebrar (usa "if not exists"/"or replace").

-- 1) Perfis (criado automaticamente quando alguém se cadastra)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- 2) Acessos liberados (produtos pagos). Só o admin cria/revoga.
create table if not exists public.entitlements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id),
  revoked_at timestamptz,
  note text
);
create index if not exists entitlements_user_idx on public.entitlements(user_id);

create or replace function public.has_product(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.entitlements
    where user_id = auth.uid() and product = p and revoked_at is null
  )
$$;

-- 3) Conteúdo pago: fica no banco, não no código do app. Só quem tem o produto lê.
create table if not exists public.premium_content (
  id text primary key,
  product text not null,
  kind text not null,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 4) Favoritos, progresso e histórico de cada pessoa
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

create table if not exists public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

create table if not exists public.history (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null,
  item_id text not null,
  title text,
  seen_at timestamptz not null default now()
);
create index if not exists history_user_idx on public.history(user_id, seen_at desc);

-- 5) Segurança (RLS): cada pessoa só vê o que é seu
alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.premium_content enable row level security;
alter table public.favorites enable row level security;
alter table public.progress enable row level security;
alter table public.history enable row level security;

drop policy if exists "perfil: ver o próprio ou admin" on public.profiles;
create policy "perfil: ver o próprio ou admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "perfil: editar o próprio nome" on public.profiles;
create policy "perfil: editar o próprio nome" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and is_admin = (select p.is_admin from public.profiles p where p.id = auth.uid()));

drop policy if exists "acessos: ver os próprios ou admin" on public.entitlements;
create policy "acessos: ver os próprios ou admin" on public.entitlements
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "acessos: admin cria" on public.entitlements;
create policy "acessos: admin cria" on public.entitlements
  for insert with check (public.is_admin());
drop policy if exists "acessos: admin altera" on public.entitlements;
create policy "acessos: admin altera" on public.entitlements
  for update using (public.is_admin());

drop policy if exists "conteúdo pago: só com o produto" on public.premium_content;
create policy "conteúdo pago: só com o produto" on public.premium_content
  for select using (public.has_product(product));

drop policy if exists "favoritos: dono" on public.favorites;
create policy "favoritos: dono" on public.favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "progresso: dono" on public.progress;
create policy "progresso: dono" on public.progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "histórico: dono" on public.history;
create policy "histórico: dono" on public.history
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 6) Depois de criar a SUA conta no app, rode (trocando o e-mail) para virar admin:
-- update public.profiles set is_admin = true where email = 'seu-email@exemplo.com';
