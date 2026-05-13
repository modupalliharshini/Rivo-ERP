-- Create Counselling Records table
CREATE TABLE IF NOT EXISTS public.counselling_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    observation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed', -- Completed, Follow-up, Pending
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.counselling_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Faculty can view their own counselling records"
    ON public.counselling_records FOR SELECT
    USING (faculty_id = auth.uid());

CREATE POLICY "Faculty can create counselling records"
    ON public.counselling_records FOR INSERT
    WITH CHECK (faculty_id = auth.uid());

CREATE POLICY "Admins can view all institutional counselling records"
    ON public.counselling_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.institution_id = counselling_records.institution_id
        )
    );
