create extension if not exists pgcrypto with schema extensions;

create table if not exists public.hostmyweb_webhook_configs (
  provider text primary key,
  secret_sha256 text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The plaintext webhook secret is never stored in source control or the database.
-- Only its SHA-256 verifier is persisted here.
insert into public.hostmyweb_webhook_configs (provider, secret_sha256, enabled)
values ('20i', '6c7499dded5714eb385914fd91b00f0632318100eda98139cf7a71ac48927cac', true)
on conflict (provider) do update
set secret_sha256 = excluded.secret_sha256,
    enabled = true,
    updated_at = now();

create table if not exists public.hostmyweb_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_key text not null,
  event_type text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_error text,
  unique (provider, event_key)
);

create table if not exists public.hostmyweb_external_services (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_ref text not null,
  service_type text not null default 'web_hosting' check (service_type in ('web_hosting','wordpress','business_email','managed_service','cloud_hosting','vps','other')),
  plan_slug text check (plan_slug is null or plan_slug in ('starter','business','pro','agency')),
  plan_name text,
  domain_name text,
  package_type_ref text,
  package_type_name text,
  customer_email text,
  provider_user_refs jsonb not null default '[]'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'active' check (status in ('pending','provisioning','active','suspended','canceled','failed')),
  metadata jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (provider, provider_ref)
);

create unique index if not exists hostmyweb_services_provider_ref_uidx
  on public.hostmyweb_services(provider_ref)
  where provider_ref is not null;
create index if not exists hostmyweb_external_services_email_idx
  on public.hostmyweb_external_services(lower(customer_email));
create index if not exists hostmyweb_external_services_user_idx
  on public.hostmyweb_external_services(user_id);
create index if not exists hostmyweb_provider_events_received_idx
  on public.hostmyweb_provider_events(received_at desc);

alter table public.hostmyweb_webhook_configs enable row level security;
alter table public.hostmyweb_provider_events enable row level security;
alter table public.hostmyweb_external_services enable row level security;

drop policy if exists "hostmyweb external services select own" on public.hostmyweb_external_services;
create policy "hostmyweb external services select own"
on public.hostmyweb_external_services
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "hostmyweb external services admin all" on public.hostmyweb_external_services;
create policy "hostmyweb external services admin all"
on public.hostmyweb_external_services
for all
to authenticated
using (public.is_hostmyweb_admin())
with check (public.is_hostmyweb_admin());

drop policy if exists "hostmyweb provider events admin select" on public.hostmyweb_provider_events;
create policy "hostmyweb provider events admin select"
on public.hostmyweb_provider_events
for select
to authenticated
using (public.is_hostmyweb_admin());

drop policy if exists "hostmyweb webhook configs admin select" on public.hostmyweb_webhook_configs;
create policy "hostmyweb webhook configs admin select"
on public.hostmyweb_webhook_configs
for select
to authenticated
using (public.is_hostmyweb_admin());

create or replace function public.hostmyweb_verify_provider_secret(p_provider text, p_secret text)
returns boolean
language sql
stable
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1
    from public.hostmyweb_webhook_configs c
    where c.provider = p_provider
      and c.enabled = true
      and c.secret_sha256 = encode(extensions.digest(coalesce(p_secret, ''), 'sha256'), 'hex')
  );
$$;

revoke all on function public.hostmyweb_verify_provider_secret(text, text) from public;
grant execute on function public.hostmyweb_verify_provider_secret(text, text) to anon, authenticated;

create or replace function public.record_hostmyweb_provider_event(
  p_provider text,
  p_secret text,
  p_event_key text,
  p_event_type text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid;
  v_inserted boolean := false;
begin
  if not public.hostmyweb_verify_provider_secret(p_provider, p_secret) then
    raise exception 'Invalid webhook secret';
  end if;

  insert into public.hostmyweb_provider_events(provider, event_key, event_type, payload)
  values (p_provider, p_event_key, nullif(p_event_type, ''), coalesce(p_payload, '{}'::jsonb))
  on conflict (provider, event_key) do nothing
  returning id into v_id;

  if v_id is not null then
    v_inserted := true;
  else
    select id into v_id
    from public.hostmyweb_provider_events
    where provider = p_provider and event_key = p_event_key;
  end if;

  return jsonb_build_object('accepted', true, 'event_id', v_id, 'duplicate', not v_inserted);
end;
$$;

revoke all on function public.record_hostmyweb_provider_event(text, text, text, text, jsonb) from public;
grant execute on function public.record_hostmyweb_provider_event(text, text, text, text, jsonb) to anon, authenticated;

create or replace function public.mark_hostmyweb_provider_event_processed(
  p_provider text,
  p_secret text,
  p_event_key text,
  p_error text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.hostmyweb_verify_provider_secret(p_provider, p_secret) then
    raise exception 'Invalid webhook secret';
  end if;

  update public.hostmyweb_provider_events
  set processed_at = case when p_error is null then now() else processed_at end,
      processing_error = p_error
  where provider = p_provider and event_key = p_event_key;

  return found;
end;
$$;

revoke all on function public.mark_hostmyweb_provider_event_processed(text, text, text, text) from public;
grant execute on function public.mark_hostmyweb_provider_event_processed(text, text, text, text) to anon, authenticated;

create or replace function public.sync_hostmyweb_twentyi_inventory(
  p_secret text,
  p_packages jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_item jsonb;
  v_provider_ref text;
  v_email text;
  v_user_id uuid;
  v_service_type text;
  v_status text;
  v_count integer := 0;
begin
  if not public.hostmyweb_verify_provider_secret('20i', p_secret) then
    raise exception 'Invalid webhook secret';
  end if;

  if jsonb_typeof(coalesce(p_packages, '[]'::jsonb)) <> 'array' then
    raise exception 'Packages must be a JSON array';
  end if;

  for v_item in select value from jsonb_array_elements(p_packages)
  loop
    v_provider_ref := nullif(v_item->>'provider_ref', '');
    if v_provider_ref is null then
      continue;
    end if;

    v_email := lower(nullif(trim(v_item->>'customer_email'), ''));
    v_user_id := null;
    if v_email is not null then
      select id into v_user_id
      from auth.users
      where lower(email) = v_email
      order by created_at asc
      limit 1;
    end if;

    v_service_type := coalesce(nullif(v_item->>'service_type', ''), 'web_hosting');
    if v_service_type not in ('web_hosting','wordpress','business_email','managed_service','cloud_hosting','vps','other') then
      v_service_type := 'web_hosting';
    end if;

    v_status := coalesce(nullif(v_item->>'status', ''), 'active');
    if v_status not in ('pending','provisioning','active','suspended','canceled','failed') then
      v_status := 'active';
    end if;

    insert into public.hostmyweb_external_services (
      provider, provider_ref, service_type, plan_slug, plan_name, domain_name,
      package_type_ref, package_type_name, customer_email, provider_user_refs,
      user_id, status, metadata, last_seen_at
    ) values (
      '20i',
      v_provider_ref,
      v_service_type,
      case when v_item->>'plan_slug' in ('starter','business','pro','agency') then v_item->>'plan_slug' else null end,
      nullif(v_item->>'plan_name', ''),
      nullif(v_item->>'domain_name', ''),
      nullif(v_item->>'package_type_ref', ''),
      nullif(v_item->>'package_type_name', ''),
      v_email,
      coalesce(v_item->'provider_user_refs', '[]'::jsonb),
      v_user_id,
      v_status,
      coalesce(v_item->'metadata', '{}'::jsonb),
      now()
    )
    on conflict (provider, provider_ref) do update
    set service_type = excluded.service_type,
        plan_slug = coalesce(excluded.plan_slug, public.hostmyweb_external_services.plan_slug),
        plan_name = coalesce(excluded.plan_name, public.hostmyweb_external_services.plan_name),
        domain_name = coalesce(excluded.domain_name, public.hostmyweb_external_services.domain_name),
        package_type_ref = coalesce(excluded.package_type_ref, public.hostmyweb_external_services.package_type_ref),
        package_type_name = coalesce(excluded.package_type_name, public.hostmyweb_external_services.package_type_name),
        customer_email = coalesce(excluded.customer_email, public.hostmyweb_external_services.customer_email),
        provider_user_refs = excluded.provider_user_refs,
        user_id = coalesce(excluded.user_id, public.hostmyweb_external_services.user_id),
        status = excluded.status,
        metadata = excluded.metadata,
        last_seen_at = now();

    if v_user_id is not null then
      insert into public.hostmyweb_services (
        user_id, service_type, plan_name, domain_name, status, provider_ref
      ) values (
        v_user_id,
        v_service_type,
        nullif(v_item->>'plan_name', ''),
        nullif(v_item->>'domain_name', ''),
        v_status,
        v_provider_ref
      )
      on conflict (provider_ref) where provider_ref is not null do update
      set user_id = excluded.user_id,
          service_type = excluded.service_type,
          plan_name = coalesce(excluded.plan_name, public.hostmyweb_services.plan_name),
          domain_name = coalesce(excluded.domain_name, public.hostmyweb_services.domain_name),
          status = excluded.status,
          updated_at = now();
    end if;

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('synced', v_count);
end;
$$;

revoke all on function public.sync_hostmyweb_twentyi_inventory(text, jsonb) from public;
grant execute on function public.sync_hostmyweb_twentyi_inventory(text, jsonb) to anon, authenticated;

create or replace function public.admin_register_hostmyweb_external_service(
  p_email text,
  p_service_type text,
  p_plan_slug text,
  p_plan_name text,
  p_domain_name text,
  p_provider_ref text,
  p_package_type_ref text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_service_id uuid;
  v_service_type text := coalesce(nullif(p_service_type, ''), 'web_hosting');
begin
  if not public.is_hostmyweb_admin() then
    raise exception 'Administrator access required';
  end if;

  if v_service_type not in ('web_hosting','wordpress','business_email','managed_service','cloud_hosting','vps','other') then
    raise exception 'Unsupported service type';
  end if;

  if p_email is not null and trim(p_email) <> '' then
    select id into v_user_id
    from auth.users
    where lower(email) = lower(trim(p_email))
    order by created_at asc
    limit 1;
  end if;

  insert into public.hostmyweb_external_services (
    provider, provider_ref, service_type, plan_slug, plan_name, domain_name,
    package_type_ref, customer_email, user_id, status, metadata, last_seen_at
  ) values (
    '20i', p_provider_ref, v_service_type,
    case when p_plan_slug in ('starter','business','pro','agency') then p_plan_slug else null end,
    nullif(p_plan_name, ''), nullif(p_domain_name, ''), nullif(p_package_type_ref, ''),
    lower(nullif(trim(p_email), '')), v_user_id, 'active', coalesce(p_metadata, '{}'::jsonb), now()
  )
  on conflict (provider, provider_ref) do update
  set service_type = excluded.service_type,
      plan_slug = coalesce(excluded.plan_slug, public.hostmyweb_external_services.plan_slug),
      plan_name = coalesce(excluded.plan_name, public.hostmyweb_external_services.plan_name),
      domain_name = coalesce(excluded.domain_name, public.hostmyweb_external_services.domain_name),
      package_type_ref = coalesce(excluded.package_type_ref, public.hostmyweb_external_services.package_type_ref),
      customer_email = coalesce(excluded.customer_email, public.hostmyweb_external_services.customer_email),
      user_id = coalesce(excluded.user_id, public.hostmyweb_external_services.user_id),
      status = 'active',
      metadata = excluded.metadata,
      last_seen_at = now();

  if v_user_id is not null then
    insert into public.hostmyweb_services(user_id, service_type, plan_name, domain_name, status, provider_ref)
    values (v_user_id, v_service_type, nullif(p_plan_name, ''), nullif(p_domain_name, ''), 'active', p_provider_ref)
    on conflict (provider_ref) where provider_ref is not null do update
    set user_id = excluded.user_id,
        service_type = excluded.service_type,
        plan_name = coalesce(excluded.plan_name, public.hostmyweb_services.plan_name),
        domain_name = coalesce(excluded.domain_name, public.hostmyweb_services.domain_name),
        status = 'active',
        updated_at = now()
    returning id into v_service_id;
  end if;

  return jsonb_build_object('provider_ref', p_provider_ref, 'user_id', v_user_id, 'service_id', v_service_id);
end;
$$;

grant execute on function public.admin_register_hostmyweb_external_service(text, text, text, text, text, text, text, jsonb) to authenticated;

create or replace function public.claim_hostmyweb_external_services_for_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null then
    return new;
  end if;

  update public.hostmyweb_external_services
  set user_id = new.id,
      last_seen_at = now()
  where user_id is null
    and customer_email is not null
    and lower(customer_email) = lower(new.email);

  insert into public.hostmyweb_services(user_id, service_type, plan_name, domain_name, status, provider_ref)
  select new.id, e.service_type, e.plan_name, e.domain_name, e.status, e.provider_ref
  from public.hostmyweb_external_services e
  where e.user_id = new.id
  on conflict (provider_ref) where provider_ref is not null do update
  set user_id = excluded.user_id,
      service_type = excluded.service_type,
      plan_name = coalesce(excluded.plan_name, public.hostmyweb_services.plan_name),
      domain_name = coalesce(excluded.domain_name, public.hostmyweb_services.domain_name),
      status = excluded.status,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_hostmyweb_claim_services on auth.users;
create trigger on_auth_user_created_hostmyweb_claim_services
after insert on auth.users
for each row execute function public.claim_hostmyweb_external_services_for_user();
