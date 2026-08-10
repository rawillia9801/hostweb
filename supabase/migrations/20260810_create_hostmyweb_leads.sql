create table if not exists public.hostmyweb_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  company text,
  interest text not null default 'general',
  message text,
  source text not null default 'hostmyweb.co',
  created_at timestamptz not null default now()
);

alter table public.hostmyweb_leads enable row level security;

drop policy if exists "hostmyweb public lead insert" on public.hostmyweb_leads;
create policy "hostmyweb public lead insert"
on public.hostmyweb_leads
for insert
to anon, authenticated
with check (
  char_length(full_name) between 2 and 120
  and char_length(email) between 5 and 320
  and interest in ('hosting','domains','email','websites','migration','agency','breeder','general')
);

create index if not exists hostmyweb_leads_created_at_idx on public.hostmyweb_leads (created_at desc);
create index if not exists hostmyweb_leads_email_idx on public.hostmyweb_leads (lower(email));
