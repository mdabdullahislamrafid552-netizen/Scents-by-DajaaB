import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PRODUCTS } from '../data/products';

// Load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Should ideally use service_role key for bypassing RLS, but for initial seeding anon might work if RLS is off

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding database...');

  // 1. Seed Settings
  console.log('Seeding settings...');
  const { error: settingsError } = await supabase.from('settings').insert([
    {
      store_name: 'Scents by DajaaB',
      phone: '901-921-2322',
      email: 'scentsbydajaab@gmail.com',
      address: 'Memphis, TN',
      pickup_hours: JSON.stringify([
        { day: 'Mon', open: '10:00 AM', close: '6:00 PM' },
        { day: 'Tue', open: '10:00 AM', close: '6:00 PM' }
      ]),
      cashapp_tag: '$DajaaB',
      paypal_email: 'dajaa@example.com',
      gift_charge: 10,
      instagram_url: 'https://instagram.com/scentsbydajaab',
      facebook_url: 'https://facebook.com/scentsbydajaab'
    }
  ]);
  if (settingsError) console.error('Error seeding settings:', settingsError);

  // 2. Seed Admin User
  console.log('Seeding admin user...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin123', salt);
  
  const { error: adminError } = await supabase.from('admin_users').insert([
    {
      email: 'admin@scentsbydajaab.com',
      password_hash: passwordHash,
      name: 'Admin',
      role: 'owner'
    }
  ]);
  if (adminError) console.error('Error seeding admin user:', adminError);

  // 3. Seed Products
  console.log('Seeding products...');
  for (const product of PRODUCTS) {
    const { id, family, shape, liquidColor, capColor, label, topNotes, middleNotes, baseNotes, ...prodData } = product as any; // Strip unused schema fields
    
    // Convert to sizes array logic based on tier/gender if needed, or default
    const sizes = [
      { size: '3.4 oz / 100ml', price: prodData.price },
      { size: '1.7 oz / 50ml', price: prodData.price - 40 > 0 ? prodData.price - 40 : prodData.price }
    ];

    const { error: prodError } = await supabase.from('products').insert([
      {
        slug: prodData.slug,
        name: prodData.name,
        brand: prodData.brand,
        price: prodData.price,
        tier: prodData.tier,
        for_gender: prodData.gender,
        description: prodData.desc,
        blurb: prodData.blurb,
        sizes: JSON.stringify(sizes),
        images: prodData.images,
        main_image: prodData.mainImage,
        in_stock: prodData.inStock ?? true,
        stock_count: prodData.stockCount ?? 10,
        featured: prodData.featured ?? false
      }
    ]);
    if (prodError) {
      console.error(`Error seeding product ${prodData.name}:`, prodError);
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
