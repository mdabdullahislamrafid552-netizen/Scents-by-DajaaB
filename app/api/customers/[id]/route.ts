import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data: customer, error: cError } = await supabase.from('customers').select('*').eq('id', params.id).single();
  if (cError) return NextResponse.json({ error: cError.message }, { status: 500 });

  const { data: orders, error: oError } = await supabase.from('orders').select('*').eq('email', customer.email).order('created_at', { ascending: false });
  if (oError) return NextResponse.json({ error: oError.message }, { status: 500 });

  return NextResponse.json({ ...customer, orders });
}
