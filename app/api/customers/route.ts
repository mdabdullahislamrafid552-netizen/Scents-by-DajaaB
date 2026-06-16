import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const formattedData = data.map((c: any) => ({
    ...c,
    tier: c.ltv > 500 ? 'VIP' : (c.orders > 1 ? 'Repeat' : 'First-time'),
    last: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Today'
  }));

  return NextResponse.json(formattedData);
}
