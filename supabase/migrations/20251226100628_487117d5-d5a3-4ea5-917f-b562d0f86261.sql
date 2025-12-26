-- Create public attachments bucket for user-uploaded prompt files
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

-- Allow anyone (including AI backend) to read files from attachments bucket
create policy "Public read for attachments"
  on storage.objects
  for select
  using (bucket_id = 'attachments');

-- Allow authenticated users to upload files to their own folder in attachments bucket
create policy "Users can upload own attachments"
  on storage.objects
  for insert
  with check (
    bucket_id = 'attachments'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update/delete only their own attachments
create policy "Users can modify own attachments"
  on storage.objects
  for update
  using (
    bucket_id = 'attachments'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own attachments"
  on storage.objects
  for delete
  using (
    bucket_id = 'attachments'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );