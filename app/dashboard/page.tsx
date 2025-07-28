import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './admin-dashboard-client';

// TypeScript interfaces for admin dashboard
interface AdminAgency {
  id: string;
  name?: string;
  company_name?: string;
  city?: string;
  company_city?: string;
  country?: string;
  company_country?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  telephone?: string;
  company_type?: string;
  iata_code?: string;
  is_active: boolean;
  created_at: string;
}

interface AdminAgent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  is_active: boolean;
  created_at: string;
  agencies?: Array<{
    id: string;
    name: string;
    city: string;
    country: string;
  }>;
}

interface AdminHotel {
  id: string;
  hotel_name: string;
  location_city: string;
  location_country: string;
  star_rating?: number;
  contact_phone?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
}

interface AdminBooking {
  id: string;
  guest_name: string;
  guest_email?: string;
  arrival_date: string;
  number_of_nights?: number;
  booking_status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  total_amount?: number;
  created_at: string;
  confirmation_number?: string;
  hotels?: {
    hotel_name: string;
  };
  agencies?: {
    company_name?: string;
    name?: string;
  };
}

interface AdminDashboardData {
  agencies: AdminAgency[];
  agents: AdminAgent[];
  hotels: AdminHotel[];
  bookings: AdminBooking[];
}

// Server-side data fetching functions
async function getAllAgencies(): Promise<AdminAgency[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agencies:', error);
    return [];
  }

  return data || [];
}

async function getAllAgents(): Promise<AdminAgent[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agents')
    .select(
      `
      *,
      agencies!inner (
        id,
        name,
        city,
        country
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data || [];
}

async function getAllHotels(): Promise<AdminHotel[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }

  return data || [];
}

async function getAllBookings(): Promise<AdminBooking[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels (
        hotel_name
      ),
      agencies (
        company_name,
        name
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

// Optimized data fetching function
async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const [agencies, agents, hotels, bookings] = await Promise.all([
      getAllAgencies(),
      getAllAgents(),
      getAllHotels(),
      getAllBookings(),
    ]);

    return {
      agencies: agencies as AdminAgency[],
      agents: agents as AdminAgent[],
      hotels: hotels as AdminHotel[],
      bookings: bookings as AdminBooking[],
    };
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return {
      agencies: [],
      agents: [],
      hotels: [],
      bookings: [],
    };
  }
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is admin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!userProfile || userProfile.user_type !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch all admin data in optimized call
  const dashboardData = await getAdminDashboardData();

  return (
    <AdminDashboardClient
      initialData={dashboardData}
      user={{ email: user.email || 'admin@example.com' }}
    />
  );
}
2;
