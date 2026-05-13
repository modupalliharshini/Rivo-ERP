-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    grade TEXT NOT NULL,
    subject TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create assignment_submissions table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
    submission_url TEXT,
    grade TEXT,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(assignment_id, student_id)
);

-- RLS Policies
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage their own assignments"
ON public.assignments FOR ALL
USING (faculty_id = auth.uid());

CREATE POLICY "Students can view assignments for their grade"
ON public.assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.grade = assignments.grade
    )
);

CREATE POLICY "Students can manage their own submissions"
ON public.assignment_submissions FOR ALL
USING (student_id = auth.uid());

CREATE POLICY "Faculty can view and grade submissions for their assignments"
ON public.assignment_submissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.assignments
        WHERE assignments.id = assignment_submissions.assignment_id
        AND assignments.faculty_id = auth.uid()
    )
);

CREATE POLICY "Faculty can update submissions for their assignments"
ON public.assignment_submissions FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.assignments
        WHERE assignments.id = assignment_submissions.assignment_id
        AND assignments.faculty_id = auth.uid()
    )
);
