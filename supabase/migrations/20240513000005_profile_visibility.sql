-- Create a security definer function to avoid RLS recursion when checking institution_id
CREATE OR REPLACE FUNCTION public.get_auth_institution()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT institution_id FROM profiles WHERE id = auth.uid();
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "Users can read profiles in their institution" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Create the fixed institutional visibility policy using the function
CREATE POLICY "Users can read profiles in their institution"
ON public.profiles FOR SELECT
TO authenticated
USING (
    institution_id = public.get_auth_institution()
);

-- Ensure users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING ( id = auth.uid() );
