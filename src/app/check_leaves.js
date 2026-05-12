const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://imhxtmperuwpswnrxtjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaHh0bXBlcnV3cHN3bnJ4dGpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5MTgzNSwiZXhwIjoyMDk0MDY3ODM1fQ.SvViOvxTRWUP6Mlc1M8gAifSlx8j6_F3ydf20nBXZCQ');

async function checkLeavesTable() {
  const { data, error } = await supabase
    .from('leaves')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching leaves:', error);
    return;
  }

  console.log('Leaves table exists. Data:', data);
}

checkLeavesTable();
