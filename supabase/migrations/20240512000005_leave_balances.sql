-- Add leave balance columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS sick_leave_balance INTEGER DEFAULT 12,
ADD COLUMN IF NOT EXISTS casual_leave_balance INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS earned_leave_balance INTEGER DEFAULT 5;

-- Update RLS for profiles to allow Admins to update balances in their institution
CREATE POLICY "Admins can update profiles in their institution"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
    AND p.institution_id = profiles.institution_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
    AND p.institution_id = profiles.institution_id
  )
);
