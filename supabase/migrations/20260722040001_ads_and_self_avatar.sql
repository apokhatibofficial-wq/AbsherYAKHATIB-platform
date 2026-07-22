-- Admin-managed ads (shown in a new app tab between Search and Featured),
-- and letting customers/professionals set their own avatar photo.

-- 1. Ads table. Every field but id/created_at is optional per the admin form.
CREATE TABLE public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  external_url text,
  phone text,
  location_url text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_paths text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles (id)
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ads: public read"
  ON public.ads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "ads: admin insert"
  ON public.ads FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "ads: admin update"
  ON public.ads FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "ads: admin delete"
  ON public.ads FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 2. Ads image bucket — public read, admin-only write. Path convention:
--    `{ad_id}/{filename}`.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ads', 'ads', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "ads bucket: public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'ads');

CREATE POLICY "ads bucket: admin insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'ads' AND public.is_admin());

CREATE POLICY "ads bucket: admin delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'ads' AND public.is_admin());

-- 3. Let a signed-in user set their own avatar_url (only that column, only
--    their own row) without opening up a broad UPDATE policy on profiles.
CREATE OR REPLACE FUNCTION public.update_my_avatar(p_avatar_url text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles SET avatar_url = p_avatar_url WHERE id = auth.uid();
END;
$$;
