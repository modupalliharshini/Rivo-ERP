const { Client } = require('pg');

const connectionString = 'postgresql://postgres:sb_db_rivo_erp_123@imhxtmperuwpswnrxtjf.supabase.co:5432/postgres';

const sql = `
-- Create Exams table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Upcoming',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Results table
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_marks JSONB NOT NULL DEFAULT '{}'::jsonb,
    total_marks INTEGER,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(exam_id, student_id)
);

-- Enable RLS
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    -- Exam Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Institutions can view their exams') THEN
        CREATE POLICY "Institutions can view their exams" ON public.exams FOR SELECT
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.institution_id = exams.institution_id));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage exams') THEN
        CREATE POLICY "Admins can manage exams" ON public.exams FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.institution_id = exams.institution_id));
    END IF;

    -- Result Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Institutions can view results') THEN
        CREATE POLICY "Institutions can view results" ON public.results FOR SELECT
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.institution_id = results.institution_id));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can view their own results') THEN
        CREATE POLICY "Students can view their own results" ON public.results FOR SELECT
        USING (student_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage results') THEN
        CREATE POLICY "Admins can manage results" ON public.results FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.institution_id = results.institution_id));
    END IF;
END $$;
`;

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Exam migration completed successfully');
  } catch (err) {
    console.error('Exam migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
