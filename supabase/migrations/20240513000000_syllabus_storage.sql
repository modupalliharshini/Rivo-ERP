-- Add syllabus_url to courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS syllabus_url TEXT;

-- Create syllabuses bucket if it doesn't exist (via storage schema)
-- Note: Buckets are typically managed via API, but we can ensure policies exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('syllabuses', 'syllabuses', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for syllabuses
CREATE POLICY "Public Access to Syllabuses"
ON storage.objects FOR SELECT
USING (bucket_id = 'syllabuses');

CREATE POLICY "Admins can upload syllabuses"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'syllabuses' AND
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
