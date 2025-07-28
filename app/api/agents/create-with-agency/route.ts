import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'telephone',
      'agency_name',
      'agency_city',
      'agency_country',
      'agency_zip_code',
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // For new agencies, email and phone are required
    if (!data.existing_agency_id && (!data.agency_email || !data.agency_telephone)) {
      return NextResponse.json(
        { error: 'Agency email and telephone are required for new agencies' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    let agencyId = data.existing_agency_id;

    // Create new agency if needed
    if (!agencyId) {
      // Check for existing agency first
      const { data: existingAgency } = await supabase
        .from('agencies')
        .select('id, name')
        .ilike('name', data.agency_name)
        .eq('city', data.agency_city)
        .eq('country', data.agency_country)
        .single();

      if (existingAgency) {
        return NextResponse.json(
          {
            success: false,
            error: `An agency named "${data.agency_name}" already exists in ${data.agency_city}, ${data.agency_country}`,
            suggest_search: true,
            existing_agency: existingAgency,
          },
          { status: 400 }
        );
      }

      const { data: newAgency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: data.agency_name,
          city: data.agency_city,
          country: data.agency_country,
          zip_code: data.agency_zip_code,
          email: data.agency_email,
          telephone: data.agency_telephone,
          address: data.agency_address || null,
          is_active: true,
        })
        .select()
        .single();

      if (agencyError) {
        console.error('Error creating agency:', agencyError);
        return NextResponse.json(
          { error: 'Failed to create agency: ' + agencyError.message },
          { status: 500 }
        );
      }

      agencyId = newAgency.id;
    }

    // Create agent with denormalized data
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        telephone: data.telephone,
        agency_id: agencyId,
        // Denormalized fields
        agency_name: data.agency_name,
        agency_city: data.agency_city,
        agency_country: data.agency_country,
        agency_zip_code: data.agency_zip_code,
        agency_email: data.agency_email || '',
        agency_telephone: data.agency_telephone || '',
        agency_address: data.agency_address || '',
        is_active: true,
      })
      .select()
      .single();

    if (agentError) {
      console.error('Error creating agent:', agentError);
      return NextResponse.json(
        { error: 'Failed to create agent: ' + agentError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        agent,
        message: 'Agent created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in create agent API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
