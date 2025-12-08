create table user_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data_type text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, data_type)
);

alter table user_data enable row level security;

create policy "Users can manage their own data"
  on user_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
