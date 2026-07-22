-- Real phone camera photos routinely exceed 5MB, so every image bucket
-- (set at 5MB) was flatly rejecting typical photos with a 413. Raise the
-- ceiling to something a real camera photo actually fits under.
UPDATE storage.buckets
SET file_size_limit = 20971520 -- 20MB
WHERE id IN ('avatars', 'ads', 'id-documents', 'work-photos');
