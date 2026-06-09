const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ggyipcjeeqmjrulukcjt.supabase.co', 'sb_publishable_bG_I9ONTtIA7ZJToVn69pw_8k9jwiCF');
async function testGet() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('GET PRODUCTS:', data, error);
}
testGet();
