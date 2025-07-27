import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('agents')
      .select(
        `
        *,
        agencies!agents_agency_id_fkey (
          id,
          name,
          city,
          country,
          zip_code,
          address,
          is_active
        )
      `
      )
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agents:', error);
      return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in agents API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
