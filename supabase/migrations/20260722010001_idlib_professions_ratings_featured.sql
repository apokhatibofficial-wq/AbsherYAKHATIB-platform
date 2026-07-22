-- Retarget the app to Idlib governorate, open up professions to free text
-- (auto-registered on admin approval), add an optional Google Maps location
-- link, and replace the customer favorites feature with real ratings +
-- an admin-curated featured list.

-- 1. Drop the old Saudi-city / fixed-profession CHECK constraints (found by
--    column rather than by guessed name, since Postgres auto-names them).
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
    WHERE rel.relname = 'professional_profiles'
      AND con.contype = 'c'
      AND att.attname IN ('city', 'profession')
  LOOP
    EXECUTE format('ALTER TABLE public.professional_profiles DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

-- 2. New fixed city list (Idlib governorate). Profession is now free text —
--    no CHECK constraint — validated only at the app layer.
ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_city_check CHECK (
    city IN ('إدلب', 'معرة النعمان', 'أريحا', 'سراقب', 'جسر الشغور', 'حارم', 'كفرنبل', 'سلقين', 'بنش', 'دركوش', 'الدانا', 'خان شيخون')
  );

-- 3. Dynamic professions list. Seeded with the original defaults; new
--    professions typed by a professional at signup are appended once their
--    account is approved (see approve_professional_request below).
CREATE TABLE public.professions (
  name text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.professions (name) VALUES
  ('سباك'), ('كهربائي'), ('نجار'), ('دهان'), ('تكييف وتبريد'), ('نظافة');

ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "professions: public read"
  ON public.professions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only reached via the SECURITY DEFINER RPC below; no direct client policy.

-- 4. Optional Google Maps link.
ALTER TABLE public.professional_profiles ADD COLUMN location_url text;

-- 5. Real customer ratings (1-5 stars, one per customer per professional).
CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professional_profiles (id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  stars smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (customer_id, professional_id)
);

CREATE INDEX ratings_professional_id_idx ON public.ratings (professional_id);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ratings: read all"
  ON public.ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "ratings: insert own as customer"
  ON public.ratings FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'customer')
  );

CREATE POLICY "ratings: update own"
  ON public.ratings FOR UPDATE
  TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "ratings: delete own"
  ON public.ratings FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

-- 6. Admin-curated featured list. Membership is admin-only; the app orders
--    entries by average rating at query time.
CREATE TABLE public.featured_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL UNIQUE REFERENCES public.professional_profiles (id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.featured_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "featured_listings: read all"
  ON public.featured_listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "featured_listings: admin insert"
  ON public.featured_listings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "featured_listings: admin delete"
  ON public.featured_listings FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 7. Drop the favorites feature entirely (replaced by the above).
DROP TABLE IF EXISTS public.favorites;

-- 8. Auto-register a newly typed profession once its first account is approved.
CREATE OR REPLACE FUNCTION public.approve_professional_request(p_professional_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profession text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT profession INTO v_profession
  FROM public.professional_profiles
  WHERE id = p_professional_id AND status = 'pending_review';

  IF NOT FOUND THEN
    RETURN;
  END IF;

  INSERT INTO public.professions (name) VALUES (v_profession)
  ON CONFLICT (name) DO NOTHING;

  UPDATE public.professional_profiles
  SET status = 'approved', reviewed_at = now()
  WHERE id = p_professional_id;
END;
$$;
