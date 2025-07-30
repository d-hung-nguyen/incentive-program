import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const supabase = createClient();

    const {
      hotel_name,
      contact_email,
      contact_phone,
      contact_website,
      location_address,
      location_city,
      location_country,
      location_zip_code,
      star_rating,
      description,
      amenities,
      room_types, // Array of room types with points
    } = data;

    // Validate required fields
    const requiredFields = [
      'hotel_name',
      'contact_email',
      'contact_phone',
      'location_address',
      'location_city',
      'location_country',
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    if (!room_types || !Array.isArray(room_types) || room_types.length === 0) {
      return NextResponse.json({ error: 'At least one room type is required' }, { status: 400 });
    }

    // Start transaction
    const { data: hotel, error: hotelError } = await supabase
      .from('hotels')
      .insert({
        hotel_name,
        contact_email,
        contact_phone,
        contact_website,
        location_address,
        location_city,
        location_country,
        location_zip_code,
        star_rating,
        description,
        amenities: amenities || [],
        is_active: true,
      })
      .select()
      .single();

    if (hotelError) {
      console.error('Error creating hotel:', hotelError);
      return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
    }

    // Create room types for this hotel
    const roomTypesData = room_types.map((rt) => ({
      hotel_id: hotel.id,
      room_type_name: rt.room_type_name,
      description: rt.description || null,
      points_per_night: rt.points_per_night,
      category: rt.category || 'Standard',
      max_occupancy: rt.max_occupancy || 2,
      base_price: rt.base_price || null,
      amenities: rt.amenities || [],
      is_active: true,
    }));

    const { data: createdRoomTypes, error: roomTypesError } = await supabase
      .from('room_types')
      .insert(roomTypesData)
      .select();

    if (roomTypesError) {
      console.error('Error creating room types:', roomTypesError);
      // Rollback hotel creation
      await supabase.from('hotels').delete().eq('id', hotel.id);
      return NextResponse.json({ error: 'Failed to create room types' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      hotel: {
        ...hotel,
        room_types: createdRoomTypes,
      },
    });
  } catch (error) {
    console.error('Error in hotel creation API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createClient();

    const { data: hotels, error } = await supabase
      .from('hotels')
      .select(
        `
        *,
        room_types (
          id,
          room_type_name,
          description,
          points_per_night,
          category,
          max_occupancy,
          base_price,
          amenities,
          is_active
        )
      `
      )
      .eq('is_active', true)
      .order('hotel_name');

    if (error) {
      console.error('Error fetching hotels:', error);
      return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
    }

    return NextResponse.json({ hotels: hotels || [] });
  } catch (error) {
    console.error('Error in hotels API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
