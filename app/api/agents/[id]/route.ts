import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = createClient();

    const { data, error } = await supabase.from('agent_details').select('*').eq('id', id).single();

    if (error) {
      console.error('Error fetching agent:', error);
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in agent API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
