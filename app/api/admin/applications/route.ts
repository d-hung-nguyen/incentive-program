import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: applications, error } = await supabase
      .from('agent_applications')
      .select(
        `
        *,
        agencies (
          name,
          city,
          country
        )
      `
      )
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json(applications || []);
  } catch (error) {
    console.error('Error in applications API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
