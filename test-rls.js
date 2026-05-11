const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testRls() {
  const { data: authData } = await supabaseAdmin.auth.signInWithPassword({
    email: 'rivoearlylearningcentre@gmail.com',
    password: 'rivolearningcentrenumber1'
  });
  
  const token = authData.session.access_token;
  
  const supabaseUser = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const { data: profile, error } = await supabaseUser.from('profiles').select('*').eq('id', authData.user.id).single();
  console.log('Profile via RLS:', profile);
  if (error) console.error('Error:', error);
}
testRls();
