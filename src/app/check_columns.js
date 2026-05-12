const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://imhxtmperuwpswnrxtjf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltaHh0bXBlcnV3cHN3bnJ4dGpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5MTgzNSwiZXhwIjoyMDk0MDY3ODM1fQ.SvViOvxTRWUP6Mlc1M8gAifSlx8j6_F3ydf20nBXZCQ');

async function checkColumns() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error(error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in profiles:', Object.keys(data[0]));
  } else {
    console.log('No data in profiles');
  }
}

checkColumns();
