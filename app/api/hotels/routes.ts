import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('hotels')
      .select('id, hotel_name, location_city, location_country')
      .eq('is_active', true)
      .order('hotel_name');

    if (error) {
      console.error('Error fetching hotels:', error);
      return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
    }

    return NextResponse.json({ hotels: data || [] });
  } catch (error) {
    console.error('Error in hotels API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
