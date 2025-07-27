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

    // Get agency data for denormalization
    const { data: agency, error: agencyError } = await supabase
      .from('agencies')
      .select('*')
      .eq('id', agency_id)
      .single();

    if (agencyError || !agency) {
      return NextResponse.json({ success: false, error: 'Agency not found' }, { status: 404 });
    }

    // Update agency to link to agent
    const { error: updateAgencyError } = await supabase
      .from('agencies')
      .update({ agent_id: agent_id })
      .eq('id', agency_id);

    if (updateAgencyError) {
      console.error('Error updating agency:', updateAgencyError);
      return NextResponse.json(
        { success: false, error: 'Failed to update agency' },
        { status: 400 }
      );
    }

    // Update agent with agency reference and denormalized data
    const { error: updateAgentError } = await supabase
      .from('agents')
      .update({
        agency_id: agency_id,
        agency_name: agency.name,
        agency_city: agency.city,
        agency_country: agency.country,
        agency_zip_code: agency.zip_code,
        agency_email: agency.email,
        agency_telephone: agency.telephone,
        agency_address: agency.address || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', agent_id);

    if (updateAgentError) {
      console.error('Error updating agent:', updateAgentError);
      return NextResponse.json(
        { success: false, error: 'Failed to update agent' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      agent_id,
      agency_id,
      message: 'Agent assigned to agency successfully',
    });
  } catch (error) {
    console.error('Error in assign-to-agency API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
