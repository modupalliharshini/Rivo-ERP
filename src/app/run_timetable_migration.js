const { Client } = require('pg');

const connectionString = 'postgresql://postgres:sb_db_rivo_erp_123@imhxtmperuwpswnrxtjf.supabase.co:5432/postgres';

const sql = `
-- Create Timetables table
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    grade TEXT NOT NULL, -- Playgroup, Nursery, Pre-Primary 1, Pre-Primary 2
    day_of_week TEXT NOT NULL, -- Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject TEXT NOT NULL,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    room TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Institutions can view their own timetables') THEN
        CREATE POLICY "Institutions can view their own timetables"
            ON public.timetables FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.institution_id = timetables.institution_id
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage timetables') THEN
        CREATE POLICY "Admins can manage timetables"
            ON public.timetables FOR ALL
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                    AND profiles.institution_id = timetables.institution_id
                )
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                    AND profiles.institution_id = timetables.institution_id
                )
            );
    END IF;
END $$;
`;

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
