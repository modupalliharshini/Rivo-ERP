const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://imhxtmperuwpswnrxtjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaHh0bXBlcnV3cHN3bnJ4dGpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5MTgzNSwiZXhwIjoyMDk0MDY3ODM1fQ.SvViOvxTRWUP6Mlc1M8gAifSlx8j6_F3ydf20nBXZCQ');

async function checkAttendance() {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .limit(10);

  if (error) {
    console.error('Error fetching attendance:', error);
    return;
  }

  console.log('Attendance records:', JSON.stringify(data, null, 2));
}

checkAttendance();
