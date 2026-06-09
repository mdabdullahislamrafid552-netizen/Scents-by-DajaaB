import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';

export async function GET() {
  try {
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
      mainImage: p.mainImage || (p as any).main_image,
      image: p.image || (p as any).main_image,
      visual: p.visual || {},
      notes: p.notes || { top: [], middle: [], base: [] },
      inStock: p.inStock ?? true,
      stockCount: p.stockCount || 0,
      featured: p.featured ?? false,
      family: p.family
    }));
    
    await supabase.from('products').delete().like('id', 'test_%');
    const { data, error } = await supabase.from('products').upsert(formattedProducts);
    
    if (error) throw error;
    return NextResponse.json({ success: true, count: formattedProducts.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
