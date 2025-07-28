import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('agents')
      .select('id, first_name, last_name, email, telephone, created_at')
      .is('agency_id', null)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching unassigned agents:', error);
      return NextResponse.json({ error: 'Failed to fetch unassigned agents' }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in unassigned agents API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
