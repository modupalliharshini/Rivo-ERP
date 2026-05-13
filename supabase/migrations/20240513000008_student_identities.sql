-- Create Student Identities table to explicitly map roll numbers from emails
CREATE TABLE IF NOT EXISTS public.student_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    roll_no TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.student_identities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read for identities" ON public.student_identities FOR SELECT TO authenticated USING (true);

-- Function to populate student_identities from profiles
CREATE OR REPLACE FUNCTION public.sync_student_identities()
RETURNS void AS $$
BEGIN
    INSERT INTO public.student_identities (profile_id, roll_no, email, institution_id)
    SELECT 
        id as profile_id,
        split_part(email, '@', 1) as roll_no,
        email,
        institution_id
    FROM public.profiles
    WHERE role = 'student'
    AND email LIKE 'st%'
    ON CONFLICT (roll_no) DO UPDATE SET
        email = EXCLUDED.email,
        institution_id = EXCLUDED.institution_id;
END;
$$ LANGUAGE plpgsql;

-- Run the sync once
SELECT public.sync_student_identities();
