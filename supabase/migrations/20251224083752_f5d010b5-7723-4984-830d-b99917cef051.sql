-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  email text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  primary key (id)
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create projects table
create table public.projects (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  slug text not null,
  type text not null default 'landing',
  status text not null default 'draft',
  template text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  published_at timestamp with time zone,
  primary key (id),
  unique(slug)
);

alter table public.projects enable row level security;

-- Projects policies
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Public access for published projects
create policy "Anyone can view published projects"
  on public.projects for select
  using (status = 'published');

-- Create project_versions table for history
create table public.project_versions (
  id uuid not null default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  version_number integer not null,
  config jsonb not null,
  created_at timestamp with time zone not null default now(),
  primary key (id),
  unique(project_id, version_number)
);

alter table public.project_versions enable row level security;

-- Project versions policies
create policy "Users can view versions of their own projects"
  on public.project_versions for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_versions.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create versions of their own projects"
  on public.project_versions for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_versions.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Update timestamp function
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger for projects updated_at
create trigger update_projects_updated_at
  before update on public.projects
  for each row
  execute function public.update_updated_at_column();

-- Trigger for profiles updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();