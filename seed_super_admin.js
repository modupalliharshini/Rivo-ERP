const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createSuperAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'rivoearlylearningcentre@gmail.com',
    password: 'rivolearningcentrenumber1',
  });
  
  if (error) {
    console.error('Error creating user:', error);
    return;
  }
  
  console.log('User created:', data.user?.email);
  
  // Since we don't have the service role key, we can't easily insert into profiles bypassing RLS 
  // if RLS requires 'super_admin' to insert. Wait, who can insert a profile? 
  // Let's just output the user ID.
  console.log('User ID:', data.user?.id);
}

createSuperAdmin();
