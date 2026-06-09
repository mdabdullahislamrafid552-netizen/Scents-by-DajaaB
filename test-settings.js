const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ggyipcjeeqmjrulukcjt.supabase.co', 'sb_publishable_bG_I9ONTtIA7ZJToVn69pw_8k9jwiCF');
async function testGetSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();
  console.log('GET SETTINGS:', data, error);
}
testGetSettings();
