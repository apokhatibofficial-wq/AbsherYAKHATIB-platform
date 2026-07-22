-- Gender is collected at signup for both customers and professionals
-- (drives which illustrated avatar the UI shows).

ALTER TABLE public.profiles
  ADD COLUMN gender text CHECK (gender IN ('male', 'female'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email, gender)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'role', 'customer'),
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    new.raw_user_meta_data ->> 'gender'
  );
  RETURN new;
END;
$$;
