const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'rivoearlylearningcentre@gmail.com',
    password: 'rivolearningcentrenumber1'
  });
  console.log('Data:', data.user ? 'Logged in' : 'No user');
  if (error) console.error('Error:', error);
}
testLogin();
