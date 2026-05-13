-- Regenerate unique course codes using row_number() to avoid duplicates
WITH ranked_courses AS (
    SELECT 
        id,
        grade,
        ROW_NUMBER() OVER (PARTITION BY grade ORDER BY created_at ASC, id ASC) as rank
    FROM public.courses
)
UPDATE public.courses
SET course_code = UPPER(SUBSTRING(ranked_courses.grade FROM 1 FOR 2)) || (100 + ranked_courses.rank)
FROM ranked_courses
WHERE public.courses.id = ranked_courses.id;
