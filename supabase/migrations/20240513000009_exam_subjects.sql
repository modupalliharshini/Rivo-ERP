-- Add subjects column to exams table
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS subjects TEXT[] DEFAULT '{}'::TEXT[];

-- Update RLS policies to ensure subjects can be read/written
-- Existing policies on exams table already cover this as they use SELECT/ALL
