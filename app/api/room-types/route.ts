import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('room_type_points')
      .select('*')
      .eq('is_active', true)
      .order('points_per_night', { ascending: true });

    if (error) {
      console.error('Error fetching room types:', error);
      return NextResponse.json({ error: 'Failed to fetch room types' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in room-types API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
