-- Prepare HostMyWeb account records for Managed Cloud and VPS products.
-- This migration expands existing check constraints without changing current rows.

alter table public.hostmyweb_services
  drop constraint if exists hostmyweb_services_service_type_check;

alter table public.hostmyweb_services
  add constraint hostmyweb_services_service_type_check
  check (service_type in (
    'web_hosting',
    'wordpress',
    'business_email',
    'managed_service',
    'cloud_hosting',
    'vps',
    'other'
  ));

alter table public.hostmyweb_orders
  drop constraint if exists hostmyweb_orders_order_type_check;

alter table public.hostmyweb_orders
  add constraint hostmyweb_orders_order_type_check
  check (order_type in (
    'hosting',
    'domain',
    'email',
    'migration',
    'managed_service',
    'cloud_hosting',
    'vps',
    'other'
  ));
