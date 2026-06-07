-- Supabase Storage buckets for public portfolio assets.
-- Run this in Supabase SQL Editor after the project is created.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('resume-assets', 'resume-assets', true, 5242880, ARRAY['application/pdf']),
  ('project-images', 'project-images', true, 3145728, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('og-images', 'og-images', true, 2097152, ARRAY['image/png', 'image/jpeg', 'image/webp']),
  ('private-uploads', 'private-uploads', false, 5242880, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read for published portfolio assets.
DROP POLICY IF EXISTS "Public resume assets are readable" ON storage.objects;
DROP POLICY IF EXISTS "Public project images are readable" ON storage.objects;
DROP POLICY IF EXISTS "Public OG images are readable" ON storage.objects;

CREATE POLICY "Public resume assets are readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resume-assets');

CREATE POLICY "Public project images are readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

CREATE POLICY "Public OG images are readable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'og-images');

-- No public write policies are created.
-- Upload, update, and delete should go through server/admin APIs with the service role key.
