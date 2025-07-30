import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { agentFormSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const data = await request.json();

    // Validate the input data
    const validatedData = agentFormSchema.parse(data);

    // Check if email already exists in applications or agents
    const { data: existingApplication } = await supabase
      .from('agent_applications')
      .select('id, status')
      .eq('email', validatedData.email)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        {
          error: `An application with this email already exists with status: ${existingApplication.status}`,
          error_type: 'duplicate_email',
          existing_application: existingApplication,
        },
        { status: 400 }
      );
    }

    // Check if email already exists as an approved agent
    const { data: existingAgent } = await supabase
      .from('agents')
      .select('id, email')
      .eq('email', validatedData.email)
      .single();

    if (existingAgent) {
      return NextResponse.json(
        {
          error: 'An agent with this email already exists',
          error_type: 'duplicate_agent_email',
        },
        { status: 400 }
      );
    }

    let agencyId = data.existing_agency_id;

    // If no existing agency, create a new one or find existing
    if (!agencyId) {
      // First check if agency with same name and location exists
      const { data: existingAgency } = await supabase
        .from('agencies')
        .select('id, name, city, country')
        .eq('name', validatedData.agency_name)
        .eq('city', validatedData.agency_city)
        .eq('country', validatedData.agency_country)
        .single();

      if (existingAgency) {
        agencyId = existingAgency.id;
      } else {
        // Create new agency
        const { data: agency, error: agencyError } = await supabase
          .from('agencies')
          .insert({
            name: validatedData.agency_name,
            city: validatedData.agency_city,
            country: validatedData.agency_country,
            zip_code: validatedData.agency_zip_code,
            address: validatedData.agency_address || null,
            is_active: false, // Pending approval
          })
          .select()
          .single();

        if (agencyError) {
          console.error('Error creating agency:', agencyError);
          return NextResponse.json(
            {
              error: 'Failed to create agency',
              details: agencyError.message,
            },
            { status: 400 }
          );
        }

        agencyId = agency.id;
      }
    }

    // Create agent application (pending status)
    const { data: agent, error: agentError } = await supabase
      .from('agent_applications')
      .insert({
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        email: validatedData.email,
        telephone: validatedData.telephone,
        agency_id: agencyId,
        status: 'pending', // This will appear on admin dashboard
        applied_at: new Date().toISOString(),
      })
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
      .single();

    if (agentError) {
      console.error('Error creating agent application:', agentError);

      // Handle specific database errors
      if (agentError.code === '23505') {
        // Unique violation
        return NextResponse.json(
          {
            error: 'An application with this email already exists',
            error_type: 'duplicate_email',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to create agent application',
          details: agentError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully! You will receive an email once approved.',
        application: agent,
        agency_id: agencyId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in create-with-agency API:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
          error_type: 'validation_error',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        error_type: 'server_error',
      },
      { status: 500 }
    );
  }
}
