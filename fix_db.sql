-- 1. Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  IF new.email = 'danielwee@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'operator');
  ELSE
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'member');
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Make sure the trigger actually exists (Drop it first to avoid errors, then create it)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Create the security helper function
CREATE OR REPLACE FUNCTION public.is_operator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'operator'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. Recreate the policy
DROP POLICY IF EXISTS "Operators can do everything" ON public.profiles;
CREATE POLICY "Operators can do everything" ON public.profiles FOR ALL USING (
  public.is_operator()
);

-- 5. THE FIX: Insert missing profiles for any users that don't have one (including your new signup!)
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 
  CASE WHEN email = 'danielwee@gmail.com' THEN 'operator'::user_role ELSE 'member'::user_role END
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
