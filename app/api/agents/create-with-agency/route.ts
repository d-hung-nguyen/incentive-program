import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      first_name,
      last_name,
      email,
      telephone,
      agency_name,
      agency_city,
      agency_country,
      agency_zip_code,
      agency_address,
      existing_agency_id,
    } = data;

    // Validate required fields
    if (!first_name || !last_name || !email || !telephone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required agent fields',
        },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if agent with this email already exists
    const { data: existingAgent, error: agentCheckError } = await supabase
      .from('agents')
      .select(
        `
        id, 
        first_name, 
        last_name, 
        email,
        agencies!agents_agency_id_fkey (
          name,
          city,
          country
        )
      `
      )
      .eq('email', email)
      .single();

    if (!agentCheckError && existingAgent) {
      return NextResponse.json(
        {
          success: false,
          error: 'An agent with this email address already exists',
          error_type: 'duplicate_email',
          existing_agent: {
            name: `${existingAgent.first_name} ${existingAgent.last_name}`,
            email: existingAgent.email,
            agency: existingAgent.agencies?.[0]?.name || 'No agency assigned',
            location:
              existingAgent.agencies?.[0]?.city && existingAgent.agencies?.[0]?.country
                ? `${existingAgent.agencies[0].city}, ${existingAgent.agencies[0].country}`
                : 'No location specified',
          },
        },
        { status: 400 }
      );
    }

    let agencyId = existing_agency_id;

    // If no existing agency selected, create new one
    if (!existing_agency_id) {
      if (!agency_name || !agency_city || !agency_country || !agency_zip_code) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required agency fields',
          },
          { status: 400 }
        );
      }

      // Check if agency already exists
      const { data: existingAgency } = await supabase
        .from('agencies')
        .select('id, name, city, country')
        .ilike('name', agency_name)
        .eq('city', agency_city)
        .eq('country', agency_country)
        .single();

      if (existingAgency) {
        return NextResponse.json(
          {
            success: false,
            error: `An agency named "${agency_name}" already exists in ${agency_city}, ${agency_country}`,
            suggest_search: true,
            existing_agency: existingAgency,
          },
          { status: 400 }
        );
      }

      // Create new agency without email/telephone constraints
      const { data: newAgency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: agency_name,
          city: agency_city,
          country: agency_country,
          zip_code: agency_zip_code,
          address: agency_address || null,
          is_active: true,
          // Don't include email/telephone fields
        })
        .select()
        .single();

      if (agencyError) {
        console.error('Error creating agency:', agencyError);
        return NextResponse.json(
          { success: false, error: 'Failed to create agency: ' + agencyError.message },
          { status: 500 }
        );
      }

      agencyId = newAgency.id;
    }

    // Create agent with only essential fields
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        first_name,
        last_name,
        email,
        telephone,
        agency_id: agencyId,
        is_active: true,
      })
      .select()
      .single();

    if (agentError) {
      console.error('Error creating agent:', agentError);
      return NextResponse.json(
        { success: false, error: 'Failed to create agent: ' + agentError.message },
        { status: 500 }
      );
    }

    // Return agent with current agency details using explicit relationship
    const { data: agentWithAgency } = await supabase
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
      .eq('id', agent.id)
      .single();

    return NextResponse.json(
      {
        success: true,
        agent: agentWithAgency,
        message: 'Agent application submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in agent creation API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
