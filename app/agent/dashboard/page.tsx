import { createClient } from '@/utils/supabase/server';
import AgentBookingForm from '@/components/AgentBookingForm';
import AgentBookingsList from '@/components/AgentBookingsList';

export const dynamic = 'force-dynamic';

// Fixed agent data for development
const FIXED_AGENT_DATA = {
  id: 'dev-agent-123',
  first_name: 'John',
  last_name: 'Smith',
  email: 'john.smith@example.com',
  telephone: '+1-555-0123',
  reward_points: 150,
  agencies: {
    name: 'Elite Travel Solutions',
    city: 'San Francisco',
    country: 'USA',
  },
};

export default async function AgentDashboard() {
  const supabase = createClient();

  // Get bookings for the fixed agent
  const { data: bookings } = await supabase
    .from('bookings')
    .select(
      `
      *,
      hotels!inner(
        hotel_name,
        location_city,
        location_country
      ),
      room_types!inner(
        room_type_name,
        points_per_night,
        category
      )
    `
    )
    .eq('agent_id', FIXED_AGENT_DATA.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Development Notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            🚧 <strong>Development Mode:</strong> Using fixed agent ID:{' '}
            <code className="rounded bg-blue-100 px-1">{FIXED_AGENT_DATA.id}</code>
          </p>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {FIXED_AGENT_DATA.first_name} {FIXED_AGENT_DATA.last_name}
            </h1>
            <div className="mt-2 flex items-center gap-4 text-muted-foreground">
              <span>📍 {FIXED_AGENT_DATA.agencies.name}</span>
              <span>📧 {FIXED_AGENT_DATA.email}</span>
              <span>📞 {FIXED_AGENT_DATA.telephone}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="font-semibold text-blue-900">Reward Points</h3>
            <p className="text-3xl font-bold text-blue-600">{FIXED_AGENT_DATA.reward_points}</p>
            <p className="text-sm text-blue-700">Available for redemption</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h3 className="font-semibold text-green-900">Total Bookings</h3>
            <p className="text-3xl font-bold text-green-600">{bookings?.length || 0}</p>
            <p className="text-sm text-green-700">Lifetime bookings</p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-6">
            <h3 className="font-semibold text-orange-900">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">
              {bookings?.filter((b) => b.verification_status === 'pending').length || 0}
            </p>
            <p className="text-sm text-orange-700">Awaiting verification</p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
            <h3 className="font-semibold text-purple-900">Approved</h3>
            <p className="text-3xl font-bold text-purple-600">
              {bookings?.filter((b) => b.verification_status === 'approved').length || 0}
            </p>
            <p className="text-sm text-purple-700">Verified bookings</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Booking Form */}
          <AgentBookingForm
            onBookingCreated={() => {
              console.log('Booking created successfully!');
              window.location.reload();
            }}
          />

          {/* Bookings List */}
          <div className="lg:col-span-1">
            <AgentBookingsList initialBookings={bookings || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
