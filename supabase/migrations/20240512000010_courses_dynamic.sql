-- Create Courses table if not exists
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    grade TEXT NOT NULL,
    module_count INTEGER DEFAULT 0,
    faculty_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Institutions can view their own courses"
    ON public.courses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.institution_id = courses.institution_id
        )
    );

CREATE POLICY "Admins can manage courses"
    ON public.courses FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
            AND profiles.institution_id = courses.institution_id
        )
    );

-- Seed Data for Rivo Subjects
INSERT INTO public.courses (institution_id, title, grade, module_count, faculty_count) VALUES
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Literacy Book Team 1', 'Playgroup', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Literacy Book Team 2', 'Playgroup', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Picture Dictionary', 'Playgroup', 8, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science', 'Playgroup', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Rhymes', 'Playgroup', 15, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Premath Skills Team 1', 'Playgroup', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Premath Skills Team 2', 'Playgroup', 10, 1),

('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 1', 'Nursery', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 2', 'Nursery', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 3', 'Nursery', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 1', 'Nursery', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 2', 'Nursery', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 3', 'Nursery', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Practice & Activity Sheets', 'Nursery', 20, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Rhymes', 'Nursery', 15, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Drawing & Coloring', 'Nursery', 8, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Patterns Book', 'Nursery', 5, 1),

('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Drawing & Colouring', 'Pre-Primary 1', 8, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Practice & Activity Sheets', 'Pre-Primary 1', 20, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 1', 'Pre-Primary 1', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 2', 'Pre-Primary 1', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 3', 'Pre-Primary 1', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 1', 'Pre-Primary 1', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 2', 'Pre-Primary 1', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 3', 'Pre-Primary 1', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Rhymes, Stories & Reading', 'Pre-Primary 1', 15, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Hindi Concepts & Writing', 'Pre-Primary 1', 12, 1),

('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Rhymes, Stories & Reading', 'Pre-Primary 2', 15, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Drawing & Colouring', 'Pre-Primary 2', 8, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Practice & Activity Sheets', 'Pre-Primary 2', 20, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 1', 'Pre-Primary 2', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 2', 'Pre-Primary 2', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Environmental Science & Literacy Team 3', 'Pre-Primary 2', 10, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 1', 'Pre-Primary 2', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 2', 'Pre-Primary 2', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Math Concepts & Writing Team 3', 'Pre-Primary 2', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Hindi Concepts & Writing Team 1', 'Pre-Primary 2', 12, 1),
('295ea0e3-4aa3-41a0-ad07-e87989a1a7e8', 'Hindi Concepts & Writing Team 2', 'Pre-Primary 2', 12, 1);
