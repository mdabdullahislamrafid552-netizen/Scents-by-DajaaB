require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ggyipcjeeqmjrulukcjt.supabase.co';
const supabaseKey = 'sb_publishable_bG_I9ONTtIA7ZJToVn69pw_8k9jwiCF';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const product = {
    id: 'test_' + Date.now(),
    slug: 'test-slug',
    name: 'Test Product',
    brand: 'Test Brand',
    price: 100,
    tier: 'NICHE',
    gender: 'unisex',
    desc: 'Test description',
    blurb: 'Test blurb',
    sizes: [],
    images: [],
    mainImage: 'test.jpg',
    image: 'test.jpg',
    visual: {},
    notes: { top: [], middle: [], base: [] },
    inStock: true,
    stockCount: 10,
    featured: false,
    family: 'Floral'
  };

  console.log('Inserting...');
  const { data, error } = await supabase.from('products').insert([product]);
  
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS:', data);
  }
}

testInsert();
