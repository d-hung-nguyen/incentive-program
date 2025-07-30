import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotel_id');

    const supabase = createClient();

    if (hotelId) {
      // Get room types for specific hotel
      const { data, error } = await supabase
        .from('room_types')
        .select(
          'id, room_type_name, points_per_night, category, description, max_occupancy, base_price'
        )
        .eq('hotel_id', hotelId)
        .eq('is_active', true)
        .order('room_type_name');

      if (error) {
        console.error('Error fetching hotel room types:', error);
        return NextResponse.json({ error: 'Failed to fetch room types' }, { status: 500 });
      }

      return NextResponse.json(data || []);
    } else {
      // Get all room types with hotel info (for admin dashboard)
      const { data, error } = await supabase
        .from('room_types')
        .select(
          `
          id,
          room_type_name,
          points_per_night,
          category,
          description,
          max_occupancy,
          base_price,
          hotels!inner (
            hotel_name,
            location_city,
            location_country
          )
        `
        )
        .eq('is_active', true)
        .order('room_type_name');

      if (error) {
        console.error('Error fetching room types:', error);
        return NextResponse.json({ error: 'Failed to fetch room types' }, { status: 500 });
      }

      return NextResponse.json(data || []);
    }
  } catch (error) {
    console.error('Error in room types API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
