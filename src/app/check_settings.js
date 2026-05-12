const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
  const { data, error } = await supabase.from('system_settings').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('System Settings:', JSON.stringify(data, null, 2));
  }
}

checkSettings();
