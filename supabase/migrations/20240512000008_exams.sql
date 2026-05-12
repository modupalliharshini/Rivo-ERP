-- Create Exams table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Upcoming', -- Upcoming, Grading, Completed
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Results table
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_marks JSONB NOT NULL DEFAULT '{}'::jsonb, -- Store subject-wise marks: {"Math": 80, "English": 75}
    total_marks INTEGER,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(exam_id, student_id)
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Policies for Exams
CREATE POLICY "Institutions can view their exams"
    ON public.exams FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.institution_id = exams.institution_id
        )
    );

CREATE POLICY "Admins can manage exams"
    ON public.exams FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.institution_id = exams.institution_id
        )
    );

-- Policies for Results
CREATE POLICY "Institutions can view results"
    ON public.results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.institution_id = results.institution_id
        )
    );

CREATE POLICY "Students can view their own results"
    ON public.results FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Admins can manage results"
    ON public.results FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.institution_id = results.institution_id
        )
    );
