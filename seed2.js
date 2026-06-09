const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const tsCode = fs.readFileSync('./data/products.ts', 'utf8');

// Strip out types and exports
let jsCode = tsCode.replace(/export const PRODUCTS: Product\[\] =/g, 'const PRODUCTS =');
jsCode = jsCode.replace(/import { Product } from '..\/types';/g, '');

eval(jsCode);

const supabase = createClient('https://ggyipcjeeqmjrulukcjt.supabase.co', 'sb_publishable_bG_I9ONTtIA7ZJToVn69pw_8k9jwiCF');

async function seed() {
  console.log('Deleting test products...');
  await supabase.from('products').delete().like('id', 'test_%');
  
  console.log(`Seeding ${PRODUCTS.length} products...`);
  
  const formattedProducts = PRODUCTS.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    tier: p.tier,
    gender: p.gender,
    desc: p.desc,
    blurb: p.blurb,
    sizes: p.sizes || [],
    images: p.images || [],
    mainImage: p.mainImage || p.main_image,
    image: p.image || p.main_image,
    visual: p.visual || {},
    notes: p.notes || { top: [], middle: [], base: [] },
    inStock: p.inStock ?? true,
    stockCount: p.stockCount || 0,
    featured: p.featured ?? false,
    family: p.family
  }));
  
  const { data, error } = await supabase.from('products').upsert(formattedProducts);
  if (error) {
    console.error('SEED ERROR:', error);
  } else {
    console.log('SEED SUCCESS!');
  }
}
seed();
