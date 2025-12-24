-- Add explicit deny policies for UPDATE and DELETE on project_versions to protect version history
create policy "Deny all updates on project_versions"
  on public.project_versions
  for update
  to authenticated
  using (false)
  with check (false);

create policy "Deny all deletes on project_versions"
  on public.project_versions
  for delete
  to authenticated
  using (false);