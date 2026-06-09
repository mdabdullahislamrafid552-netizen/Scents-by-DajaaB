import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Fetch the order
    const { data: order, error: orderError } = await supabase.from('orders').select('*').eq('id', params.id).single();
    if (orderError) throw orderError;
    if (order.status === 'cancelled') return NextResponse.json({ error: 'Already cancelled' }, { status: 400 });

    // 2. Restore stock for each item
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const { data: pData } = await supabase.from('products').select('stock_count').eq('id', item.product_id).single();
        if (pData) {
          const newStock = pData.stock_count + item.quantity;
          await supabase.from('products').update({ stock_count: newStock }).eq('id', item.product_id);
        }
      }
    }

    // 3. Mark as cancelled
    const { error: updateError } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', params.id);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
