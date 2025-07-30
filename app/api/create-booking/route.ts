import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const supabase = createClient();

    // Validate required fields
    const requiredFields = [
      'agent_id',
      'guest_name',
      'hotel_id',
      'room_type_id',
      'arrival_date',
      'departure_date',
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Calculate nights
    const checkIn = new Date(data.arrival_date);
    const checkOut = new Date(data.departure_date);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      return NextResponse.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Get room type with points (now from room_types table)
    const { data: roomType } = await supabase
      .from('room_types')
      .select('points_per_night, room_type_name, category')
      .eq('id', data.room_type_id)
      .eq('hotel_id', data.hotel_id) // Ensure room type belongs to selected hotel
      .single();

    if (!roomType) {
      return NextResponse.json({ error: 'Invalid room type for selected hotel' }, { status: 400 });
    }

    const rewardPoints = roomType.points_per_night * nights;

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        agent_id: data.agent_id,
        guest_name: data.guest_name,
        hotel_id: data.hotel_id,
        room_type_id: data.room_type_id,
        arrival_date: data.arrival_date,
        departure_date: data.departure_date,
        reference_number: data.reference_number || null,
        number_of_nights: nights,
        reward_points: rewardPoints,
        verification_status: 'pending',
        booking_status: 'confirmed',
        confirmation_number: `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      })
      .select(
        `
        *,
        hotels!inner(hotel_name, location_city, location_country),
        room_types!inner(room_type_name, points_per_night, category)
      `
      )
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(
        `
        *,
        hotels!inner (
          hotel_name,
          location_city,
          location_country
        ),
        room_types!inner (
          room_type_name,
          points_per_night,
          category
        )
      `
      )
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json({ bookings: bookings || [] });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
