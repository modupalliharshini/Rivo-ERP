-- Clean up existing policies for results
DROP POLICY IF EXISTS "Faculty can manage results for their subjects" ON public.results;
DROP POLICY IF EXISTS "Faculty can update results for their students" ON public.results;

-- Create a robust policy for faculty grading
CREATE POLICY "Faculty can manage results for their students"
ON public.results FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.institution_id = results.institution_id
        AND profiles.role = 'faculty'
    )
);
