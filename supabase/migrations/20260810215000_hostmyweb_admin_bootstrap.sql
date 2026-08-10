create extension if not exists pgcrypto with schema extensions;

create table if not exists public.hostmyweb_admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.hostmyweb_admins enable row level security;

drop policy if exists "admins_read_self" on public.hostmyweb_admins;
create policy "admins_read_self"
on public.hostmyweb_admins
for select
to authenticated
using (id = auth.uid());

create table if not exists public.hostmyweb_admin_claims (
  code_hash text primary key,
  claimed_by uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.hostmyweb_admin_claims enable row level security;
revoke all on public.hostmyweb_admin_claims from anon, authenticated;

create or replace function public.is_hostmyweb_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.hostmyweb_admins where id = auth.uid());
$$;

grant execute on function public.is_hostmyweb_admin() to authenticated;

create or replace function public.claim_hostmyweb_admin(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_hash text;
  v_claim public.hostmyweb_admin_claims%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  v_hash := encode(digest(p_code, 'sha256'), 'hex');
  select * into v_claim
  from public.hostmyweb_admin_claims
  where code_hash = v_hash
  for update;

  if not found or v_claim.claimed_at is not null or v_claim.expires_at < now() then
    return false;
  end if;

  insert into public.hostmyweb_admins(id)
  values (auth.uid())
  on conflict (id) do nothing;

  update public.hostmyweb_admin_claims
  set claimed_by = auth.uid(), claimed_at = now()
  where code_hash = v_hash;

  return true;
end;
$$;

grant execute on function public.claim_hostmyweb_admin(text) to authenticated;
