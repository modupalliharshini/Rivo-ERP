-- Add course_code to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS course_code TEXT;

-- Update existing courses with generated codes if they don't have one
-- This is a simple heuristic based on the first two letters of the grade
UPDATE public.courses 
SET course_code = UPPER(SUBSTRING(grade FROM 1 FOR 2)) || (100 + (
    SELECT count(*) 
    FROM public.courses c2 
    WHERE c2.grade = public.courses.grade 
    AND c2.created_at <= public.courses.created_at
))
WHERE course_code IS NULL;
