import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const formattedData = data.map((o: any) => ({
    ...o,
    id: o.order_number || o.id,
    items: Array.isArray(o.items) ? o.items.reduce((sum: number, item: any) => sum + (item.quantity || item.qty || 1), 0) : 1,
    when: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today',
    bundle: null
  }));

  return NextResponse.json(formattedData);
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
          const newStock = Math.max(0, pData.stock_count - (item.quantity || item.qty || 1));
          await supabase.from('products').update({ stock_count: newStock }).eq('id', item.product_id);
        }
      }
    // Format extra details into notes for now to prevent crashing
    const extraDetails = `
Payment: ${body.payment_method}
Pickup: ${body.pickup_address?.street}, ${body.pickup_address?.city}
Date: ${body.desired_pickup_date || 'N/A'}
${body.is_gift ? 'GIFT ORDER' : ''}
    `.trim();
    
    const finalNotes = body.notes ? `${body.notes}\n\n[Details]\n${extraDetails}` : `[Details]\n${extraDetails}`;

    // Insert order using only existing columns
    const orderData = { 
      id: 'ord_' + Date.now(), 
      order_number: body.order_number,
      customer: body.customer,
      email: body.email,
      phone: body.phone,
      items: body.items,
      total: body.total,
      notes: finalNotes
    };
    
    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (error) throw error;
    
    // Also update/insert customer
    if (body.email) {
      const { data: cData } = await supabase.from('customers').select('*').eq('email', body.email).single();
      if (cData) {
        await supabase.from('customers').update({ 
          orders: (cData.orders || 0) + 1,
          ltv: (parseFloat(cData.ltv) || 0) + body.total,
          name: body.customer,
          phone: body.phone
        }).eq('id', cData.id);
      } else {
        await supabase.from('customers').insert([{
          id: 'cus_' + Date.now(),
          name: body.customer,
          email: body.email,
          phone: body.phone,
          orders: 1,
          ltv: body.total
        }]);
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
