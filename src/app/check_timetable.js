const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://imhxtmperuwpswnrxtjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaHh0bXBlcnV3cHN3bnJ4dGpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5MTgzNSwiZXhwIjoyMDk0MDY3ODM1fQ.SvViOvxTRWUP6Mlc1M8gAifSlx8j6_F3ydf20nBXZCQ');

async function checkTimetable() {
  const { data, error } = await supabase
    .from('timetables')
    .select('*, profiles(first_name, last_name)')
    .limit(10);

  if (error) {
    console.error('Error fetching timetable:', error);
    return;
  }

  console.log('Timetable rows:', JSON.stringify(data, null, 2));
}

checkTimetable();
