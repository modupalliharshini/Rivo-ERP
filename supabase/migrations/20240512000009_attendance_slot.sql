-- Add timetable_id to attendance table to support class-wise tracking
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS timetable_id UUID REFERENCES timetables(id);

-- Update unique constraint to include timetable_id
-- First, drop the old constraint if it exists (usually named after the columns)
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_student_id_date_key;

-- Add new constraint
ALTER TABLE attendance ADD CONSTRAINT attendance_student_id_date_timetable_id_key UNIQUE (student_id, date, timetable_id);
