create table if not exists public.hostmyweb_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hostmyweb_services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_type text not null check (service_type in ('web_hosting','wordpress','business_email','managed_service','other')),
  plan_name text,
  domain_name text,
  status text not null default 'pending' check (status in ('pending','provisioning','active','suspended','canceled','failed')),
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hostmyweb_domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain_name text not null unique,
  registration_status text not null default 'pending' check (registration_status in ('pending','registering','active','transfer_pending','expired','canceled','failed')),
  expires_at timestamptz,
  auto_renew boolean not null default true,
  provider_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hostmyweb_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_type text not null check (order_type in ('hosting','domain','email','migration','managed_service','other')),
  status text not null default 'pending' check (status in ('pending','paid','provisioning','completed','canceled','refunded','failed')),
  amount numeric(10,2) not null default 0,
  currency text not null default 'USD',
  provider_payment_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hostmyweb_support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('hosting','domain','dns','email','billing','migration','account','other')),
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','waiting_on_customer','resolved','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hostmyweb_profiles enable row level security;
alter table public.hostmyweb_services enable row level security;
alter table public.hostmyweb_domains enable row level security;
alter table public.hostmyweb_orders enable row level security;
alter table public.hostmyweb_support_tickets enable row level security;

drop policy if exists "hostmyweb profile select own" on public.hostmyweb_profiles;
create policy "hostmyweb profile select own" on public.hostmyweb_profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "hostmyweb profile insert own" on public.hostmyweb_profiles;
create policy "hostmyweb profile insert own" on public.hostmyweb_profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "hostmyweb profile update own" on public.hostmyweb_profiles;
create policy "hostmyweb profile update own" on public.hostmyweb_profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "hostmyweb services select own" on public.hostmyweb_services;
create policy "hostmyweb services select own" on public.hostmyweb_services for select to authenticated using (auth.uid() = user_id);
drop policy if exists "hostmyweb domains select own" on public.hostmyweb_domains;
create policy "hostmyweb domains select own" on public.hostmyweb_domains for select to authenticated using (auth.uid() = user_id);
drop policy if exists "hostmyweb orders select own" on public.hostmyweb_orders;
create policy "hostmyweb orders select own" on public.hostmyweb_orders for select to authenticated using (auth.uid() = user_id);
drop policy if exists "hostmyweb tickets select own" on public.hostmyweb_support_tickets;
create policy "hostmyweb tickets select own" on public.hostmyweb_support_tickets for select to authenticated using (auth.uid() = user_id);
drop policy if exists "hostmyweb tickets insert own" on public.hostmyweb_support_tickets;
create policy "hostmyweb tickets insert own" on public.hostmyweb_support_tickets for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "hostmyweb tickets update own" on public.hostmyweb_support_tickets;
create policy "hostmyweb tickets update own" on public.hostmyweb_support_tickets for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_hostmyweb_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.hostmyweb_profiles (id, full_name, company)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name','')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'company','')), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_hostmyweb on auth.users;
create trigger on_auth_user_created_hostmyweb
after insert on auth.users
for each row execute function public.handle_hostmyweb_new_user();

create index if not exists hostmyweb_services_user_id_idx on public.hostmyweb_services(user_id);
create index if not exists hostmyweb_domains_user_id_idx on public.hostmyweb_domains(user_id);
create index if not exists hostmyweb_orders_user_id_idx on public.hostmyweb_orders(user_id);
create index if not exists hostmyweb_support_tickets_user_id_idx on public.hostmyweb_support_tickets(user_id);
