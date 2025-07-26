export interface Organization {
  id: string;
  name: string;
  type: string;
  parent_id?: string;
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface UserProfile {
  id: string;
  organization_id?: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  metadata: Record<string, any>;
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

export interface Agency {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  company_address: string;
  company_zip_code: string;
  company_city: string;
  company_country: string;
  email: string;
  telephone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

export interface Booking {
  id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
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
  hotels?: {
    hotel_name: string;
    location_city: string;
    location_country: string;
    location_address?: string;
    contact_phone?: string;
    contact_email?: string;
  };
  room_types?: {
    room_type_name: string;
    description?: string;
    max_occupancy: number;
    amenities?: string[];
  };
}
