const { Client } = require('pg');

const connectionString = 'postgresql://postgres:sb_db_rivo_erp_123@imhxtmperuwpswnrxtjf.supabase.co:5432/postgres';

const sql = `
-- Fee Structures (Templates per grade)
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    grade TEXT NOT NULL,
    reg_fee NUMERIC DEFAULT 0,
    admission_fee NUMERIC DEFAULT 0,
    annual_fee NUMERIC DEFAULT 0,
    uniform_books_fee NUMERIC DEFAULT 0,
    term_1_fee NUMERIC DEFAULT 0,
    term_2_fee NUMERIC DEFAULT 0,
    term_3_fee NUMERIC DEFAULT 0,
    timings TEXT DEFAULT '9:30 AM – 2:00 PM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(institution_id, academic_year, grade)
);

-- Fee Payments (Student ledger)
CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_mode TEXT, -- Cash, Credit Card, Net Banking
    status TEXT DEFAULT 'Successful',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Policies for Fee Structures
CREATE POLICY "Institutions can view fee structures"
    ON public.fee_structures FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.institution_id = fee_structures.institution_id));

CREATE POLICY "Admins can manage fee structures"
    ON public.fee_structures FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.institution_id = fee_structures.institution_id));

-- Policies for Fee Payments
CREATE POLICY "Institutions can view fee payments"
    ON public.fee_payments FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.institution_id = fee_payments.institution_id));

CREATE POLICY "Students can view their own payments"
    ON public.fee_payments FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Admins can manage fee payments"
    ON public.fee_payments FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' AND profiles.institution_id = fee_payments.institution_id));
`;

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Fee migration completed successfully');

    // Populate with provided data
    const { rows: insts } = await client.query("SELECT id FROM public.institutions LIMIT 1");
    if (insts.length > 0) {
      const instId = insts[0].id;
      const academicYear = '2026–27';
      
      const structures = [
        ['Playgroup', 1000, 10000, 5000, 10000, 43800, 43800, 21900],
        ['Nursery', 1000, 10000, 5000, 10000, 45960, 45960, 22980],
        ['Pre-Primary 1', 1000, 10000, 5000, 10000, 47880, 47880, 23940],
        ['Pre-Primary 2', 1000, 10000, 5000, 10000, 51900, 51900, 25950]
      ];

      for (const s of structures) {
        await client.query(`
          INSERT INTO public.fee_structures 
          (institution_id, academic_year, grade, reg_fee, admission_fee, annual_fee, uniform_books_fee, term_1_fee, term_2_fee, term_3_fee)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (institution_id, academic_year, grade) DO UPDATE SET
          reg_fee = EXCLUDED.reg_fee,
          admission_fee = EXCLUDED.admission_fee,
          annual_fee = EXCLUDED.annual_fee,
          uniform_books_fee = EXCLUDED.uniform_books_fee,
          term_1_fee = EXCLUDED.term_1_fee,
          term_2_fee = EXCLUDED.term_2_fee,
          term_3_fee = EXCLUDED.term_3_fee
        `, [instId, academicYear, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]]);
      }
      console.log('Initial fee structures populated');
    }
  } catch (err) {
    console.error('Fee migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
