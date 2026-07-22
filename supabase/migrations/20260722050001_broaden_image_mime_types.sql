-- Real phone photos are frequently HEIC/HEIF (iPhone default) or GIF, but
-- every image bucket only allowed jpeg/png/webp, so those uploads were
-- silently rejected with a 415 from Supabase Storage. Broaden all four
-- image buckets to match what phones actually produce.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif'
]
WHERE id IN ('avatars', 'ads', 'id-documents', 'work-photos');
