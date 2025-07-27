import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { agent_id, agency_id } = await request.json();

    if (!agent_id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // If agency_id is provided, verify the agency exists
    if (agency_id) {
      const { data: agency, error: agencyError } = await supabase
        .from('agencies')
        .select('id, name')
        .eq('id', agency_id)
        .eq('is_active', true)
        .single();

      if (agencyError || !agency) {
        return NextResponse.json({ error: 'Agency not found or inactive' }, { status: 404 });
      }
    }

    // Update the agent's agency assignment
    const { data, error } = await supabase
      .from('agents')
      .update({
        agency_id: agency_id || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', agent_id)
      .select()
      .single();

    if (error) {
      console.error('Error reassigning agent:', error);
      return NextResponse.json({ error: 'Failed to reassign agent' }, { status: 500 });
    }

    const message = agency_id
      ? 'Agent successfully assigned to agency'
      : 'Agent successfully unassigned from agency';

    return NextResponse.json({
      success: true,
      data,
      message,
    });
  } catch (error) {
    console.error('Error in reassign agent API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
