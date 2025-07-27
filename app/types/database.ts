export interface Organization {
  id: string;
  name: string;
  type: 'agency' | 'hotel' | 'regional_office' | 'head_office';
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: string;
  name: string;
  zip_code: string;
  city: string;
  country: string;
  email: string;
  telephone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  agents?: Agent;
}

export interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  agencies?: Agency;
}

export interface UserProfile {
  id: string;
  user_type: 'admin' | 'regional' | 'agent' | 'resort';
  first_name?: string;
  last_name?: string;
  phone?: string;
  organization_id?: string;
  region?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organizations?: Organization;
}

export interface Booking {
  id: string;
  guest_name: string;
  arrival_date: string;
  departure_date: string;
  number_of_nights: number;
  hotel_id: string;
  room_type_id: string;
  confirmation_number: string;
  booking_status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  total_amount?: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  agency_id?: string;
  hotels?: {
    hotel_name: string;
    location_city: string;
    location_country: string;
    star_rating?: number;
  };
  room_types?: {
    room_type_name: string;
    max_occupancy: number;
  };
  agencies?: Agency;
}

export interface Hotel {
  id: string;
  hotel_name: string;
  tags: string[];
  contact_email: string;
  contact_phone: string;
  contact_website?: string;
  location_address: string;
  location_city: string;
  location_country: string;
  location_zip_code?: string;
  latitude?: number;
  longitude?: number;
  star_rating?: number;
  description?: string;
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Keep existing interfaces...
export interface IncentiveProgram {
  id: string;
  organization_id?: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPoints {
  id: string;
  user_id?: string;
  program_id?: string;
  points: number;
  total_earned: number;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  user_id?: string;
  program_id?: string;
  points: number;
  transaction_type: string;
  reference_id?: string;
  description?: string;
  created_at: string;
}

export interface Reward {
  id: string;
  program_id?: string;
  title: string;
  description?: string;
  type: string;
  value?: number;
  cost: number;
  metadata: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface UserReward {
  id: string;
  user_id?: string;
  reward_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  redeemed_at?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface RoomType {
  id: string;
  hotel_id: string;
  room_type_name: string;
  description?: string;
  max_occupancy: number;
  base_price?: number;
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  hotels?: {
    hotel_name: string;
    location_city: string;
  };
}
