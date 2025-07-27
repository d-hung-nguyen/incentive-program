import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { agent_id, agency_id } = await request.json();

    if (!agent_id || !agency_id) {
      return NextResponse.json(
        { success: false, error: 'Agent ID and Agency ID are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase.rpc('assign_agent_to_agency', {
      p_agent_id: agent_id,
      p_agency_id: agency_id,
    });

    if (error) {
      console.error('Error calling assign_agent_to_agency RPC:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in assign-to-agency API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
