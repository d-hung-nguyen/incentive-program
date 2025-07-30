import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent_id');

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const supabase = createClient();

    // Get total earned points from approved bookings
    const { data: earnedPoints } = await supabase
      .from('bookings')
      .select('reward_points')
      .eq('agent_id', agentId)
      .eq('verification_status', 'approved');

    // Get total redeemed points
    const { data: redeemedPoints } = await supabase
      .from('agent_point_redemptions')
      .select('points_used')
      .eq('agent_id', agentId)
      .eq('status', 'completed');

    const totalEarned =
      earnedPoints?.reduce((sum, booking) => sum + (booking.reward_points || 0), 0) || 0;
    const totalRedeemed =
      redeemedPoints?.reduce((sum, redemption) => sum + redemption.points_used, 0) || 0;
    const availablePoints = totalEarned - totalRedeemed;

    return NextResponse.json({
      totalEarned,
      totalRedeemed,
      availablePoints,
      canRedeem: availablePoints >= 10,
      nextThreshold: Math.ceil(availablePoints / 10) * 10,
    });
  } catch (error) {
    console.error('Error fetching agent points:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agent_id, points_to_redeem } = await request.json();

    if (!agent_id || !points_to_redeem) {
      return NextResponse.json(
        { error: 'Agent ID and points to redeem are required' },
        { status: 400 }
      );
    }

    if (points_to_redeem < 10) {
      return NextResponse.json({ error: 'Minimum redemption is 10 points' }, { status: 400 });
    }

    const supabase = createClient();

    // Check available points
    const pointsResponse = await fetch(`${request.url}?agent_id=${agent_id}`);
    const pointsData = await pointsResponse.json();

    if (pointsData.availablePoints < points_to_redeem) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    // Create redemption
    const { data, error } = await supabase
      .from('agent_point_redemptions')
      .insert({
        agent_id,
        points_used: points_to_redeem,
        redemption_type: 'voucher',
        redemption_value: points_to_redeem * 0.01, // €0.01 per point
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating redemption:', error);
      return NextResponse.json({ error: 'Failed to redeem points' }, { status: 500 });
    }

    return NextResponse.json({ success: true, redemption: data });
  } catch (error) {
    console.error('Error in points redemption API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
