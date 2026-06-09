import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Decrement stock for each item
    if (body.items && Array.isArray(body.items)) {
      for (const item of body.items) {
        // Fetch current stock
        const { data: pData } = await supabase.from('products').select('stock_count').eq('id', item.product_id).single();
        if (pData) {
          const newStock = Math.max(0, pData.stock_count - item.quantity);
          await supabase.from('products').update({ stock_count: newStock }).eq('id', item.product_id);
        }
      }
    }

    // Insert order
    const { data, error } = await supabase.from('orders').insert([body]).select().single();
    if (error) throw error;
    
    // Also update/insert customer
    if (body.customer_email) {
      const { data: cData } = await supabase.from('customers').select('*').eq('email', body.customer_email).single();
      if (cData) {
        await supabase.from('customers').update({ 
          order_count: cData.order_count + 1,
          total_spent: cData.total_spent + body.total,
          name: body.customer_name,
          phone: body.customer_phone
        }).eq('id', cData.id);
      } else {
        await supabase.from('customers').insert([{
          name: body.customer_name,
          email: body.customer_email,
          phone: body.customer_phone,
          order_count: 1,
          total_spent: body.total
        }]);
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
