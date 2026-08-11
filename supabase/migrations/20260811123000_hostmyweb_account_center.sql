alter table public.hostmyweb_profiles
  add column if not exists phone text,
  add column if not exists billing_email text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists state_region text,
  add column if not exists postal_code text,
  add column if not exists country text,
  add column if not exists breeding_program_name text,
  add column if not exists primary_breed text,
  add column if not exists additional_breeds text,
  add column if not exists registries text,
  add column if not exists breeder_website text,
  add column if not exists program_description text;

create table if not exists public.hostmyweb_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid references public.hostmyweb_services(id) on delete set null,
  product_name text not null,
  plan_name text,
  status text not null default 'active' check (status in ('trialing','active','past_due','paused','cancel_pending','canceled','ended')),
  amount numeric(10,2) not null default 0,
  currency text not null default 'USD',
  billing_interval text not null default 'monthly' check (billing_interval in ('monthly','yearly','one_time','custom')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  next_billing_at timestamptz,
  past_due_amount numeric(10,2) not null default 0,
  provider_subscription_id text,
  cancel_at_period_end boolean not null default false,
  cancellation_requested_at timestamptz,
  canceled_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hostmyweb_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.hostmyweb_subscriptions(id) on delete set null,
  invoice_number text not null unique,
  status text not null default 'open' check (status in ('draft','open','paid','past_due','void','refunded')),
  amount_due numeric(10,2) not null default 0,
  amount_paid numeric(10,2) not null default 0,
  currency text not null default 'USD',
  due_at timestamptz,
  paid_at timestamptz,
  period_start timestamptz,
  period_end timestamptz,
  provider_invoice_id text,
  hosted_invoice_url text,
  receipt_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.hostmyweb_subscriptions enable row level security;
alter table public.hostmyweb_invoices enable row level security;

drop policy if exists "hostmyweb subscriptions select own" on public.hostmyweb_subscriptions;
create policy "hostmyweb subscriptions select own"
on public.hostmyweb_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "hostmyweb invoices select own" on public.hostmyweb_invoices;
create policy "hostmyweb invoices select own"
on public.hostmyweb_invoices
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "hostmyweb subscriptions admin all" on public.hostmyweb_subscriptions;
create policy "hostmyweb subscriptions admin all"
on public.hostmyweb_subscriptions
for all
to authenticated
using (public.is_hostmyweb_admin())
with check (public.is_hostmyweb_admin());

drop policy if exists "hostmyweb invoices admin all" on public.hostmyweb_invoices;
create policy "hostmyweb invoices admin all"
on public.hostmyweb_invoices
for all
to authenticated
using (public.is_hostmyweb_admin())
with check (public.is_hostmyweb_admin());

create index if not exists hostmyweb_subscriptions_user_id_idx on public.hostmyweb_subscriptions(user_id);
create index if not exists hostmyweb_subscriptions_status_idx on public.hostmyweb_subscriptions(status);
create index if not exists hostmyweb_subscriptions_next_billing_idx on public.hostmyweb_subscriptions(next_billing_at);
create unique index if not exists hostmyweb_subscriptions_provider_id_uidx
  on public.hostmyweb_subscriptions(provider_subscription_id)
  where provider_subscription_id is not null;
create index if not exists hostmyweb_invoices_user_id_idx on public.hostmyweb_invoices(user_id);
create index if not exists hostmyweb_invoices_status_idx on public.hostmyweb_invoices(status);
create index if not exists hostmyweb_invoices_due_at_idx on public.hostmyweb_invoices(due_at);

create or replace function public.request_hostmyweb_subscription_cancellation(p_subscription_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_subscription public.hostmyweb_subscriptions%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.hostmyweb_subscriptions
  set
    cancel_at_period_end = true,
    cancellation_requested_at = coalesce(cancellation_requested_at, now()),
    status = case
      when status in ('trialing','active','past_due','paused') then 'cancel_pending'
      else status
    end,
    updated_at = now()
  where id = p_subscription_id
    and user_id = auth.uid()
    and status not in ('canceled','ended')
  returning * into v_subscription;

  if not found then
    raise exception 'Subscription was not found or is already ended';
  end if;

  insert into public.hostmyweb_support_tickets (
    user_id,
    category,
    subject,
    message,
    status,
    priority
  ) values (
    auth.uid(),
    'billing',
    'Subscription cancellation requested',
    'Customer requested cancellation for ' || coalesce(v_subscription.plan_name, v_subscription.product_name) ||
      ' (subscription ' || v_subscription.id::text || ').',
    'open',
    'normal'
  );

  return jsonb_build_object(
    'subscription_id', v_subscription.id,
    'status', v_subscription.status,
    'cancel_at_period_end', v_subscription.cancel_at_period_end,
    'current_period_end', v_subscription.current_period_end
  );
end;
$$;

grant execute on function public.request_hostmyweb_subscription_cancellation(uuid) to authenticated;
