create table if not exists public.hostmyweb_provider_plan_bindings (
  provider text not null,
  plan_slug text not null check (plan_slug in ('starter','business','pro','agency')),
  package_type_ref text,
  package_type_name text,
  checkout_url text check (checkout_url is null or checkout_url ~ '^https://[^ ]+$'),
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (provider, plan_slug)
);

insert into public.hostmyweb_provider_plan_bindings(provider, plan_slug, checkout_url)
values
  ('20i', 'starter', 'https://cp.hostmyweb.co/domain-required?p=300451-1-dfw&t=1'),
  ('20i', 'business', 'https://cp.hostmyweb.co/domain-required?p=300471-1-dfw&t=1'),
  ('20i', 'pro', null),
  ('20i', 'agency', null)
on conflict (provider, plan_slug) do update
set checkout_url = coalesce(public.hostmyweb_provider_plan_bindings.checkout_url, excluded.checkout_url),
    updated_at = now();

alter table public.hostmyweb_provider_plan_bindings enable row level security;

drop policy if exists "hostmyweb provider plan bindings admin all" on public.hostmyweb_provider_plan_bindings;
create policy "hostmyweb provider plan bindings admin all"
on public.hostmyweb_provider_plan_bindings
for all
to authenticated
using (public.is_hostmyweb_admin())
with check (public.is_hostmyweb_admin());

create or replace function public.get_hostmyweb_provider_plan_binding(p_provider text, p_plan_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select jsonb_build_object(
        'provider', b.provider,
        'plan_slug', b.plan_slug,
        'package_type_ref', b.package_type_ref,
        'package_type_name', b.package_type_name,
        'checkout_url', b.checkout_url,
        'active', b.active,
        'metadata', b.metadata
      )
      from public.hostmyweb_provider_plan_bindings b
      where b.provider = p_provider
        and b.plan_slug = p_plan_slug
        and b.active = true
    ),
    '{}'::jsonb
  );
$$;

revoke all on function public.get_hostmyweb_provider_plan_binding(text, text) from public;
grant execute on function public.get_hostmyweb_provider_plan_binding(text, text) to anon, authenticated;

create or replace function public.admin_set_hostmyweb_provider_plan_binding(
  p_provider text,
  p_plan_slug text,
  p_package_type_ref text,
  p_package_type_name text,
  p_checkout_url text,
  p_active boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.hostmyweb_provider_plan_bindings%rowtype;
begin
  if not public.is_hostmyweb_admin() then
    raise exception 'Administrator access required';
  end if;

  if p_plan_slug not in ('starter','business','pro','agency') then
    raise exception 'Unsupported HostMyWeb plan';
  end if;

  if p_checkout_url is not null and trim(p_checkout_url) <> '' and p_checkout_url !~ '^https://[^ ]+$' then
    raise exception 'Checkout URL must be HTTPS';
  end if;

  insert into public.hostmyweb_provider_plan_bindings(
    provider, plan_slug, package_type_ref, package_type_name, checkout_url, active, updated_at
  ) values (
    p_provider,
    p_plan_slug,
    nullif(trim(p_package_type_ref), ''),
    nullif(trim(p_package_type_name), ''),
    nullif(trim(p_checkout_url), ''),
    coalesce(p_active, true),
    now()
  )
  on conflict (provider, plan_slug) do update
  set package_type_ref = excluded.package_type_ref,
      package_type_name = excluded.package_type_name,
      checkout_url = excluded.checkout_url,
      active = excluded.active,
      updated_at = now()
  returning * into v_row;

  return jsonb_build_object(
    'provider', v_row.provider,
    'plan_slug', v_row.plan_slug,
    'package_type_ref', v_row.package_type_ref,
    'package_type_name', v_row.package_type_name,
    'checkout_url', v_row.checkout_url,
    'active', v_row.active
  );
end;
$$;

grant execute on function public.admin_set_hostmyweb_provider_plan_binding(text, text, text, text, text, boolean) to authenticated;
