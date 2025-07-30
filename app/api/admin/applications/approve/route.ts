import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { applicationId, notes } = await request.json();

    // Get application details
    const { data: application, error: fetchError } = await supabase
      .from('agent_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: application.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: application.first_name,
        last_name: application.last_name,
        user_type: 'agent',
      },
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 });
    }

    // Create agent record
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .insert({
        user_id: authData.user.id,
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email,
        telephone: application.telephone,
        agency_id: application.agency_id,
        status: 'active',
        reward_points: 0,
        total_bookings: 0,
      })
      .select()
      .single();

    if (agentError) {
      console.error('Error creating agent:', agentError);
      return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
    }

    // Update application status
    await supabase
      .from('agent_applications')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        notes,
      })
      .eq('id', applicationId);

    // Send welcome email with credentials
    await sendWelcomeEmail(application.email, {
      firstName: application.first_name,
      email: application.email,
      tempPassword,
      loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    });

    return NextResponse.json({
      message: 'Agent approved successfully',
      agent,
      tempPassword, // For admin reference
    });
  } catch (error) {
    console.error('Error approving application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function sendWelcomeEmail(
  email: string,
  data: {
    firstName: string;
    email: string;
    tempPassword: string;
    loginUrl: string;
  }
) {
  // Use Supabase's built-in email or integrate with your email service
  // This is a placeholder - implement based on your email service
  console.log('Sending welcome email to:', email, data);
}
