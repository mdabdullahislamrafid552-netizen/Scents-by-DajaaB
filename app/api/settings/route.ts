import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || {});
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data: existing } = await supabase.from('settings').select('id').single();
    let error;
    if (existing) {
      const res = await supabase.from('settings').update(body).eq('id', existing.id);
      error = res.error;
    } else {
      const res = await supabase.from('settings').insert([body]);
      error = res.error;
    }
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
