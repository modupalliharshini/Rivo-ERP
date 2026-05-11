-- Drop recursive policies
DROP POLICY IF EXISTS "Super Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super Admins can do everything on institutions" ON public.institutions;

-- Create a security definer function to get the current user's role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- Recreate policies using the function
CREATE POLICY "Super Admins can do everything on profiles" 
ON public.profiles FOR ALL 
TO authenticated 
USING (
  public.get_auth_role() = 'super_admin'
);

CREATE POLICY "Super Admins can do everything on institutions" 
ON public.institutions FOR ALL 
TO authenticated 
USING (
  public.get_auth_role() = 'super_admin'
);
