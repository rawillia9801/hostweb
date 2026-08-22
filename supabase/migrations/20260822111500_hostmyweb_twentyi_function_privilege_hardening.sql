revoke all on function public.admin_register_hostmyweb_external_service(text, text, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.admin_register_hostmyweb_external_service(text, text, text, text, text, text, text, jsonb) to authenticated;

revoke all on function public.admin_set_hostmyweb_provider_plan_binding(text, text, text, text, text, boolean) from public, anon;
grant execute on function public.admin_set_hostmyweb_provider_plan_binding(text, text, text, text, text, boolean) to authenticated;

-- This function exists only as an auth.users trigger target and should not be callable through PostgREST.
revoke all on function public.claim_hostmyweb_external_services_for_user() from public, anon, authenticated;

-- Webhook-facing functions call this verifier internally as their SECURITY DEFINER owner.
-- There is no reason to expose the verifier itself as a public RPC.
revoke all on function public.hostmyweb_verify_provider_secret(text, text) from public, anon, authenticated;
