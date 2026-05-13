const { Client } = require('pg');

const connectionString = 'postgresql://postgres:sb_db_rivo_erp_123@imhxtmperuwpswnrxtjf.supabase.co:5432/postgres';

const sql = `
-- Add subjects column to exams table
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS subjects TEXT[] DEFAULT '{}'::TEXT[];
`;

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query(sql);
    console.log('Exam subjects column added successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

runMigration();
