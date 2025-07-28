import { createClient } from '@/utils/supabase/server';
import type {
  Agency,
  Agent,
  Booking,
  Hotel,
  UserProfile,
  UserPoints,
  PointTransaction,
} from '@/app/types/database';

// Update getUserProfile function
export async function getUserProfile(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

// Create user profile function
export async function createUserProfile(
  userId: string,
  userType: 'admin' | 'regional' | 'agent' | 'resort',
  profileData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    organization_id?: string;
    region?: string;
  }
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        user_type: userType,
        ...profileData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
}

// Update user profile function
export async function updateUserProfile(
  userId: string,
  updates: {
    user_type?: 'admin' | 'regional' | 'agent' | 'resort';
    first_name?: string;
    last_name?: string;
    phone?: string;
    organization_id?: string;
    region?: string;
    is_active?: boolean;
  }
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return null;
  }
}

// Get users by type
export async function getUsersByType(userType: 'admin' | 'regional' | 'agent' | 'resort') {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(
        `
        *,
        organizations (
          id,
          name,
          type
        )
      `
      )
      .eq('user_type', userType)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users by type:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUsersByType:', error);
    return [];
  }
}

export async function getUserPoints(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user points:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserPoints:', error);
    return [];
  }
}

export async function getUserTransactions(userId: string, limit: number = 50) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return [];
  }
}

export async function getAvailableRewards(userId: string) {
  const supabase = createClient();

  // First get user's programs
  const { data: userPoints } = await supabase
    .from('user_points')
    .select('program_id, points')
    .eq('user_id', userId);

  if (!userPoints || userPoints.length === 0) return [];

  const programIds = userPoints.map((up) => up.program_id);

  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .in('program_id', programIds)
    .eq('is_active', true)
    .order('cost', { ascending: true });

  if (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }

  return data || [];
}

export async function getUserRewards(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_rewards')
    .select(
      `
      *,
      rewards (
        title,
        description,
        type,
        cost
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user rewards:', error);
    return [];
  }

  return data || [];
}

export async function getActivePrograms(userId?: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('incentive_programs')
    .select(
      `
      *,
      organizations (
        name,
        type
      )
    `
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return data || [];
}

// Update these functions to have better error handling

export async function getAllOrganizations() {
  const supabase = createClient();

  try {
    // Simple query without joins to avoid recursion
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching all organizations:', error);
      return [];
    }

    if (!data) return [];

    // Get counts separately to avoid RLS issues
    const organizationsWithCounts = await Promise.all(
      data.map(async (org) => {
        try {
          // Get program counts
          const { data: programs } = await supabase
            .from('incentive_programs')
            .select('id, is_active')
            .eq('organization_id', org.id);

          // Get user counts
          const { data: users } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('organization_id', org.id);

          return {
            ...org,
            active_programs_count: programs?.filter((p) => p.is_active).length || 0,
            total_programs_count: programs?.length || 0,
            user_count: users?.length || 0,
            parent_organization: null, // Avoid recursive lookup for now
          };
        } catch (orgError) {
          console.error('Error processing organization:', orgError);
          return {
            ...org,
            active_programs_count: 0,
            total_programs_count: 0,
            user_count: 0,
            parent_organization: null,
          };
        }
      })
    );

    return organizationsWithCounts;
  } catch (error) {
    console.error('Error in getAllOrganizations:', error);
    return [];
  }
}

export async function getAllPrograms() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('programs')
      .select(
        `
        *,
        organizations (
          id,
          name,
          type
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching programs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPrograms:', error);
    return [];
  }
}

// Get agencies by country
export async function getAgenciesByCountry(country: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('country', country)
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching agencies by country:', error);
    return [];
  }

  return data || [];
}

// Search agencies by name or company
export async function searchAgencies(searchTerm: string) {
  try {
    const response = await fetch(`/api/agents/search-agencies?q=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();

    if (!response.ok) {
      console.error('Error searching agencies:', result.error);
      return [];
    }

    return result.data || [];
  } catch (error) {
    console.error('Error in searchAgencies:', error);
    return [];
  }
}

// Get agency by ID
export async function getAgencyById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from('agencies').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching agency by ID:', error);
    return null;
  }

  return data;
}

// Add these hotel functions at the end of your file
export async function getAllHotels() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_active', true)
    .order('hotel_name', { ascending: true });

  if (error) {
    console.error('Error fetching all hotels:', error);
    return [];
  }

  return data || [];
}

// Get hotels by city
export async function getHotelsByCity(city: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('location_city', city)
    .eq('is_active', true)
    .order('hotel_name', { ascending: true });

  if (error) {
    console.error('Error fetching hotels by city:', error);
    return [];
  }

  return data || [];
}

// Get hotels by tags
export async function getHotelsByTag(tag: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .contains('tags', [tag])
    .eq('is_active', true)
    .order('hotel_name', { ascending: true });

  if (error) {
    console.error('Error fetching hotels by tag:', error);
    return [];
  }

  return data || [];
}

// Search hotels by name, city, or description
export async function searchHotels(searchTerm: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .or(
      `hotel_name.ilike.%${searchTerm}%,location_city.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    )
    .eq('is_active', true)
    .order('hotel_name', { ascending: true });

  if (error) {
    console.error('Error searching hotels:', error);
    return [];
  }

  return data || [];
}

// Get hotel by ID
export async function getHotelById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from('hotels').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching hotel by ID:', error);
    return null;
  }

  return data;
}

// Get hotels by star rating
export async function getHotelsByRating(rating: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('star_rating', rating)
    .eq('is_active', true)
    .order('hotel_name', { ascending: true });

  if (error) {
    console.error('Error fetching hotels by rating:', error);
    return [];
  }

  return data || [];
}

// Update the getAllBookings function to include agency information
export async function getAllBookings() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (
        hotel_name,
        location_city,
        location_country,
        star_rating
      ),
      agencies (
        name,
        city,
        country
      ),
      agents (
        first_name,
        last_name,
        email
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

// Update getBookingsByHotel to also include agency data
export async function getBookingsByHotel(hotelId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (
        hotel_name,
        location_city,
        location_country
      ),
      room_types (
        room_type_name,
        max_occupancy
      ),
      agencies (
        id,
        name,
        first_name,
        last_name,
        email,
        telephone
      )
    `
    )
    .eq('hotel_id', hotelId)
    .order('arrival_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings by hotel:', error);
    return [];
  }

  return data || [];
}

// Update getBookingByConfirmation to include agency data
export async function getBookingByConfirmation(confirmationNumber: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (
        hotel_name,
        location_address,
        location_city,
        location_country,
        contact_phone,
        contact_email
      ),
      room_types (
        room_type_name,
        description,
        max_occupancy,
        amenities
      ),
      agencies (
        id,
        name,
        city,
        country,
        telephone,
        email
      )
    `
    )
    .eq('confirmation_number', confirmationNumber)
    .single();

  if (error) {
    console.error('Error fetching booking by confirmation:', error);
    return null;
  }

  return data;
}

// Add function to get bookings by agency
export async function getBookingsByAgency(agencyId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (
        hotel_name,
        location_city,
        location_country
      ),
      room_types (
        room_type_name,
        max_occupancy
      )
    `
    )
    .eq('agency_id', agencyId)
    .order('arrival_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings by agency:', error);
    return [];
  }

  return data || [];
}

// Get all users function
export async function getAllUsers() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(
        `
        *,
        organizations (
          name,
          type
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

// Get system statistics function
export async function getSystemStats() {
  const supabase = createClient();

  try {
    const [
      { count: totalOrganizations },
      { count: totalUsers },
      { count: totalPrograms },
      { count: totalTransactions },
    ] = await Promise.all([
      supabase.from('organizations').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('incentive_programs').select('*', { count: 'exact', head: true }),
      supabase.from('point_transactions').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalOrganizations: totalOrganizations || 0,
      totalUsers: totalUsers || 0,
      totalPrograms: totalPrograms || 0,
      totalTransactions: totalTransactions || 0,
    };
  } catch (error) {
    console.error('Error in getSystemStats:', error);
    return {
      totalOrganizations: 0,
      totalUsers: 0,
      totalPrograms: 0,
      totalTransactions: 0,
    };
  }
}

// Get room type points from database
export async function getRoomTypePoints() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('room_type_points')
      .select('*')
      .eq('is_active', true)
      .order('points_per_night', { ascending: true });

    if (error) {
      console.error('Error fetching room type points:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRoomTypePoints:', error);
    return [];
  }
}

// Add points to agency
export async function addPointsToAgency(
  agencyId: string,
  bookingId: string,
  pointsEarned: number,
  pointsType: string,
  calculationDetails: any
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('agency_points')
      .insert({
        agency_id: agencyId,
        booking_id: bookingId,
        points_earned: pointsEarned,
        points_type: pointsType,
        calculation_details: calculationDetails,
      })
      .select();

    if (error) {
      console.error('Error adding points:', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error in addPointsToAgency:', error);
    return null;
  }
}

// Get agency points balance
export async function getAgencyPointsBalance(agencyId: string) {
  const supabase = createClient();

  try {
    // Get total earned points
    const { data: earnedPoints, error: earnedError } = await supabase
      .from('agency_points')
      .select('points_earned')
      .eq('agency_id', agencyId);

    if (earnedError) {
      console.error('Error fetching earned points:', earnedError);
      return 0;
    }

    // Get total redeemed points
    const { data: redeemedPoints, error: redeemedError } = await supabase
      .from('point_redemptions')
      .select('points_used')
      .eq('agency_id', agencyId)
      .eq('status', 'redeemed');

    if (redeemedError) {
      console.error('Error fetching redeemed points:', redeemedError);
      return 0;
    }

    const totalEarned = earnedPoints?.reduce((sum, p) => sum + p.points_earned, 0) || 0;
    const totalRedeemed = redeemedPoints?.reduce((sum, p) => sum + p.points_used, 0) || 0;

    return totalEarned - totalRedeemed;
  } catch (error) {
    console.error('Error in getAgencyPointsBalance:', error);
    return 0;
  }
}

// Create voucher redemption
export async function createVoucherRedemption(
  agencyId: string,
  pointsUsed: number,
  voucherType: string,
  voucherValue: number
) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('point_redemptions')
      .insert({
        agency_id: agencyId,
        points_used: pointsUsed,
        voucher_type: voucherType,
        voucher_value: voucherValue,
        status: 'pending',
      })
      .select();

    if (error) {
      console.error('Error creating voucher redemption:', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error in createVoucherRedemption:', error);
    return null;
  }
}

// Get all agency points transactions
export async function getAgencyPointsHistory(agencyId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('agency_points')
      .select(
        `
        *,
        bookings (
          id,
          guest_name,
          arrival_date,
          departure_date,
          hotels (hotel_name),
          room_types (room_type_name)
        )
      `
      )
      .eq('agency_id', agencyId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching points history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAgencyPointsHistory:', error);
    return [];
  }
}

// Add these functions to your existing database.ts file

export async function getAgentClients(agentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agent_clients')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agent clients:', error);
    return [];
  }

  return data || [];
}

export async function getBookingsByAgent(agentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (hotel_name, location_city, location_country),
      room_types (room_type_name, max_occupancy)
    `
    )
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agent bookings:', error);
    return [];
  }

  return data || [];
}

export async function getRoomTypesByHotel(hotelId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('room_types')
    .select('*')
    .eq('hotel_id', hotelId)
    .eq('is_active', true)
    .order('room_type_name', { ascending: true });

  if (error) {
    console.error('Error fetching room types:', error);
    return [];
  }

  return data || [];
}

export async function getAgentWithAgency(agentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agents')
    .select(
      `
      *,
      agencies!agencies_agent_id_fkey (
        id,
        name,
        city,
        country,
        email,
        telephone,
        zip_code,
        is_active
      )
    `
    )
    .eq('id', agentId)
    .single();

  if (error) {
    console.error('Error fetching agent with agency:', error);
    return null;
  }

  return data;
}

export async function getAgentBookings(agentId: string): Promise<Booking[]> {
  const supabase = createClient();

  // First get the agent's agency
  const agent = await getAgentWithAgency(agentId);

  if (!agent?.agencies?.id) {
    console.error('Agent has no associated agency');
    return [];
  }

  // Then get bookings for that agency
  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (
        hotel_name,
        location_city,
        location_country,
        star_rating
      ),
      room_types (
        room_type_name,
        max_occupancy
      ),
      agencies (
        name,
        city,
        country
      )
    `
    )
    .eq('agency_id', agent.agencies.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agent bookings:', error);
    return [];
  }

  return data || [];
}

export async function getAgentVoucherRedemptions(agentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('voucher_redemptions')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching voucher redemptions:', error);
    return [];
  }

  return data || [];
}

// Add only ONE instance of getAllAgencies (if it doesn't exist)
export async function getAllAgencies() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('agencies')
      .select(
        `
        *,
        agents!agency_id (
          id,
          first_name,
          last_name,
          email,
          telephone,
          is_active
        )
      `
      )
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching agencies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllAgencies:', error);
    return [];
  }
}
// Add this function after the getAllAgencies function (around line 1073)
export async function getRegionalAgencies(region: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('agencies')
      .select(
        `
        *,
        agents!agency_id (
          id,
          first_name,
          last_name,
          email,
          telephone,
          is_active
        )
      `
      )
      .eq('region', region)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching regional agencies:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRegionalAgencies:', error);
    return [];
  }
}
