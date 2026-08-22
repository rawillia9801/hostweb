create or replace function public.admin_sync_hostmyweb_external_service(
  p_email text,
  p_service_type text,
  p_plan_slug text,
  p_plan_name text,
  p_domain_name text,
  p_provider_ref text,
  p_package_type_ref text,
  p_status text,
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
  v_status text := coalesce(nullif(p_status, ''), 'active');
begin
  if not public.is_hostmyweb_admin() then
    raise exception 'Administrator access required';
  end if;

  if v_service_type not in ('web_hosting','wordpress','business_email','managed_service','cloud_hosting','vps','other') then
    raise exception 'Unsupported service type';
  end if;

  if v_status not in ('pending','provisioning','active','suspended','canceled','failed') then
    raise exception 'Unsupported service status';
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
    lower(nullif(trim(p_email), '')), v_user_id, v_status, coalesce(p_metadata, '{}'::jsonb), now()
  )
  on conflict (provider, provider_ref) do update
  set service_type = excluded.service_type,
      plan_slug = coalesce(excluded.plan_slug, public.hostmyweb_external_services.plan_slug),
      plan_name = coalesce(excluded.plan_name, public.hostmyweb_external_services.plan_name),
      domain_name = coalesce(excluded.domain_name, public.hostmyweb_external_services.domain_name),
      package_type_ref = coalesce(excluded.package_type_ref, public.hostmyweb_external_services.package_type_ref),
      customer_email = coalesce(excluded.customer_email, public.hostmyweb_external_services.customer_email),
      user_id = coalesce(excluded.user_id, public.hostmyweb_external_services.user_id),
      status = excluded.status,
      metadata = excluded.metadata,
      last_seen_at = now();

  if v_user_id is not null then
    insert into public.hostmyweb_services(user_id, service_type, plan_name, domain_name, status, provider_ref)
    values (v_user_id, v_service_type, nullif(p_plan_name, ''), nullif(p_domain_name, ''), v_status, p_provider_ref)
    on conflict (provider_ref) where provider_ref is not null do update
    set user_id = excluded.user_id,
        service_type = excluded.service_type,
        plan_name = coalesce(excluded.plan_name, public.hostmyweb_services.plan_name),
        domain_name = coalesce(excluded.domain_name, public.hostmyweb_services.domain_name),
        status = excluded.status,
        updated_at = now()
    returning id into v_service_id;
  end if;

  return jsonb_build_object('provider_ref', p_provider_ref, 'user_id', v_user_id, 'service_id', v_service_id, 'status', v_status);
end;
$$;

revoke all on function public.admin_sync_hostmyweb_external_service(text, text, text, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.admin_sync_hostmyweb_external_service(text, text, text, text, text, text, text, text, jsonb) to authenticated;
