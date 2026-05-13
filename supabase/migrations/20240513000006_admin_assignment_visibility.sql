-- Allow admins to view all assignments and submissions in their institution
CREATE POLICY "Admins can view all assignments in institution"
ON public.assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.institution_id = assignments.institution_id
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admins can view all submissions in institution"
ON public.assignment_submissions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.assignments
        WHERE assignments.id = assignment_submissions.assignment_id
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.institution_id = assignments.institution_id
            AND profiles.role = 'admin'
        )
    )
);

-- Note: The existing faculty-specific policies still apply.
-- These new policies ensure Admins can oversee all academic tasks.
