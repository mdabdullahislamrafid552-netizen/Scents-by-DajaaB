const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ggyipcjeeqmjrulukcjt.supabase.co';
const supabaseKey = 'sb_publishable_bG_I9ONTtIA7ZJToVn69pw_8k9jwiCF';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('admin_users').select('*');
  console.log('Admin users:', data);
  if (error) console.error('Error:', error);
}

check();
