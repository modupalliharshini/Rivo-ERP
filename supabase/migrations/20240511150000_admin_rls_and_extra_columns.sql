-- Add helper function to get current user's institution without recursion
CREATE OR REPLACE FUNCTION public.get_auth_institution()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT institution_id FROM profiles WHERE id = auth.uid();
$$;

-- Add extra columns to profiles for students and faculty
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS section TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT;

-- Update RLS policies for profiles
-- Super Admins already have ALL access.
-- Now add Admin access:
CREATE POLICY "Admins can manage profiles in their own institution"
ON public.profiles FOR ALL
TO authenticated
USING (
  public.get_auth_role() = 'admin' 
  AND institution_id = public.get_auth_institution()
);

-- Students/Faculty can read profiles in their own institution (optional, but good for directory)
CREATE POLICY "Users can view profiles in their own institution"
ON public.profiles FOR SELECT
TO authenticated
USING (
  institution_id = public.get_auth_institution()
);
