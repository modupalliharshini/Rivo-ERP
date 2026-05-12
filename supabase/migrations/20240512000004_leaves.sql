-- Create leaves table
CREATE TABLE IF NOT EXISTS public.leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Faculty can view their own leaves"
    ON public.leaves FOR SELECT
    USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can apply for leave"
    ON public.leaves FOR INSERT
    WITH CHECK (auth.uid() = faculty_id);

CREATE POLICY "Admins can view leaves in their institution"
    ON public.leaves FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.institution_id = leaves.institution_id
        )
    );

CREATE POLICY "Admins can update leave status"
    ON public.leaves FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.institution_id = leaves.institution_id
        )
    );
