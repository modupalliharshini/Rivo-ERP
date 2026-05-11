-- Add institution_id to tickets to track which institution it belongs to
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id);

-- Update the view policy to also check for institution_id for admins
DROP POLICY IF EXISTS "Users can view own tickets" ON public.tickets;
CREATE POLICY "Users can view own tickets" 
ON public.tickets FOR SELECT 
TO authenticated 
USING (
    auth.uid() = user_id 
    OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin'
    OR 
    (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin' 
      AND 
      institution_id = (SELECT institution_id FROM public.profiles WHERE id = auth.uid())
    )
);
