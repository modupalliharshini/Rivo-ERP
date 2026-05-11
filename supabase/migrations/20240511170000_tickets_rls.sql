-- Add user_id to tickets to track ownership
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Anyone authenticated can raise a ticket
CREATE POLICY "Users can create tickets" 
ON public.tickets FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 2. Users can see their own tickets
CREATE POLICY "Users can view own tickets" 
ON public.tickets FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));

-- 3. Admins can update ticket status
CREATE POLICY "Admins can update tickets" 
ON public.tickets FOR UPDATE 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
));
