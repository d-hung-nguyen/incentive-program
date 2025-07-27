import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plane,
  Calendar,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Hotel,
  Plus,
  Eye,
  FileText,
  Building2,
  Mail,
  Phone,
  AlertCircle,
  Star,
  Clock,
  DollarSign,
} from 'lucide-react';
import { redirect } from 'next/navigation';

// Updated database functions to match new schema
async function getUserProfile(userId: string) {
  const supabase = createClient();

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
}

async function getAgentWithAgency(agentId: string) {
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

async function getAgentBookings(agentId: string) {
  const supabase = createClient();

  // Get bookings directly associated with the agent
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
    .eq('agent_id', agentId) // Assuming bookings table has agent_id field
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agent bookings:', error);
    return [];
  }

  return data || [];
}

async function getAgentPoints(agentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', agentId);

  if (error) {
    console.error('Error fetching agent points:', error);
    return [];
  }

  return data || [];
}

async function getAgentTransactions(agentId: string, limit: number = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', agentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching agent transactions:', error);
    return [];
  }

  return data || [];
}

async function getAgentVoucherRedemptions(agentId: string) {
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

// Get other agents in the same agency
async function getAgencyColleagues(agentId: string, agencyId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agents')
    .select(
      `
      id,
      first_name,
      last_name,
      email,
      is_active
    `
    )
    .eq('agencies.id', agencyId)
    .neq('id', agentId)
    .limit(5);

  if (error) {
    console.error('Error fetching agency colleagues:', error);
    return [];
  }

  return data || [];
}

export default async function AgentDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile and check if they're an agent
  const userProfile = await getUserProfile(user.id);

  if (!userProfile || userProfile.user_type !== 'agent') {
    redirect('/dashboard');
  }

  // Get agent data with linked agency - agents MUST have an agency
  const agentData = await getAgentWithAgency(user.id);

  if (!agentData || !agentData.agencies) {
    // This should not happen in the new schema, but handle gracefully
    return (
      <div className="container mx-auto py-12 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold text-red-600">Account Setup Required</h1>
        <p className="text-muted-foreground">
          Your agent account is not properly configured. Please contact system administrator.
        </p>
      </div>
    );
  }

  // Fetch agent-specific data (all tied to the individual agent, not agency)
  const [agentPoints, recentTransactions, agentBookings, voucherRedemptions, agencyColleagues] =
    await Promise.all([
      getAgentPoints(user.id),
      getAgentTransactions(user.id, 10),
      getAgentBookings(user.id),
      getAgentVoucherRedemptions(user.id),
      getAgencyColleagues(user.id, agentData.agencies.id),
    ]);

  const totalPoints = agentPoints.reduce((sum, up) => sum + up.points, 0);
  const totalBookings = agentBookings.length;
  const thisMonthBookings = agentBookings.filter(
    (booking) => new Date(booking.created_at).getMonth() === new Date().getMonth()
  ).length;

  const totalRevenue = agentBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
  const totalPointsUsed = voucherRedemptions.reduce((sum, voucher) => sum + voucher.points_used, 0);

  // Calculate performance metrics
  const confirmedBookings = agentBookings.filter((b) => b.booking_status === 'confirmed').length;
  const completedBookings = agentBookings.filter((b) => b.booking_status === 'completed').length;
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Agent Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Plane className="h-8 w-8 text-blue-600" />
            Agent Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {agentData.first_name} {agentData.last_name}
          </p>
          <p className="text-sm text-muted-foreground">
            {agentData.agencies.name} - {agentData.agencies.city}, {agentData.agencies.country}
          </p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="mb-2 px-3 py-1">
            AGENT ACCESS
          </Badge>
          <p className="text-xs text-muted-foreground">
            Agent ID: {agentData.id.substring(0, 8)}...
          </p>
        </div>
      </div>

      {/* Agent Stats Overview - All personal to this agent */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalPointsUsed.toLocaleString()} points redeemed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{thisMonthBookings} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              €{averageBookingValue.toFixed(0)} avg. booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">{completedBookings} completed bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Agency Information Card - Shows agency details and colleagues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Agency Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <Building2 className="h-4 w-4" />
                Agency Details
              </h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">{agentData.agencies.name}</p>
                <p className="text-sm text-muted-foreground">
                  {agentData.agencies.zip_code} {agentData.agencies.city}
                </p>
                <p className="text-sm text-muted-foreground">{agentData.agencies.country}</p>
                <Badge
                  variant={agentData.agencies.is_active ? 'default' : 'secondary'}
                  className="mt-2"
                >
                  {agentData.agencies.is_active ? 'Active Agency' : 'Inactive Agency'}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <Mail className="h-4 w-4" />
                Contact Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm">{agentData.agencies.email}</p>
                <p className="text-sm">{agentData.agencies.telephone}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold">
                <Users className="h-4 w-4" />
                Agency Colleagues
              </h4>
              <div className="space-y-2">
                {agencyColleagues.length > 0 ? (
                  agencyColleagues.map((colleague) => (
                    <div key={colleague.id} className="flex items-center justify-between">
                      <p className="text-sm">
                        {colleague.first_name} {colleague.last_name}
                      </p>
                      <Badge
                        variant={colleague.is_active ? 'outline' : 'secondary'}
                        className="text-xs"
                      >
                        {colleague.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You&apos;re the only agent in this agency
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="points">My Points & Rewards</TabsTrigger>
          <TabsTrigger value="vouchers">My Vouchers</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        {/* Bookings Tab - Individual agent's bookings */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Personal Bookings</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{totalBookings} total bookings</Badge>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </div>
          </div>

          {agentBookings.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Confirmation</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Check-in</TableHead>
                      <TableHead>Check-out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>My Revenue</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.confirmation_number}</TableCell>
                        <TableCell>{booking.guest_name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.hotels?.hotel_name}</p>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {booking.hotels?.location_city}, {booking.hotels?.location_country}
                            </p>
                            {booking.hotels?.star_rating && (
                              <div className="mt-1 flex items-center gap-1">
                                {Array.from({ length: booking.hotels.star_rating }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(booking.arrival_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {new Date(booking.departure_date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.booking_status === 'confirmed'
                                ? 'default'
                                : booking.booking_status === 'completed'
                                  ? 'secondary'
                                  : booking.booking_status === 'cancelled'
                                    ? 'destructive'
                                    : 'outline'
                            }
                          >
                            {booking.booking_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            €{booking.total_amount?.toLocaleString() || '0'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No bookings yet</h3>
                <p className="mb-4 text-muted-foreground">
                  Your personal bookings will appear here once you start making reservations.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Booking
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Points & Rewards Tab - Individual agent's points */}
        <TabsContent value="points" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Points & Rewards</h2>
            <Badge variant="secondary" className="text-orange-600">
              {totalPoints.toLocaleString()} Available Points
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>My Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`font-medium ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {transaction.points > 0 ? '+' : ''}
                          {transaction.points} pts
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      No transactions yet. Start making bookings to earn points!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded border p-3">
                    <div>
                      <p className="font-medium">Hotel Voucher</p>
                      <p className="text-sm text-muted-foreground">1 night stay</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">500 pts</p>
                      <Button size="sm" variant="outline" disabled={totalPoints < 500}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded border p-3">
                    <div>
                      <p className="font-medium">Travel Insurance</p>
                      <p className="text-sm text-muted-foreground">Premium coverage</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">300 pts</p>
                      <Button size="sm" variant="outline" disabled={totalPoints < 300}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded border p-3">
                    <div>
                      <p className="font-medium">Gift Card</p>
                      <p className="text-sm text-muted-foreground">€50 travel credit</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">200 pts</p>
                      <Button size="sm" variant="outline" disabled={totalPoints < 200}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voucher History Tab - Individual agent's voucher redemptions */}
        <TabsContent value="vouchers" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Voucher Redemption History</h2>
            <Badge variant="outline">{totalPointsUsed.toLocaleString()} Points Used</Badge>
          </div>

          {voucherRedemptions.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Voucher Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Points Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Voucher Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voucherRedemptions.map((voucher) => (
                      <TableRow key={voucher.id}>
                        <TableCell className="font-medium">{voucher.voucher_type}</TableCell>
                        <TableCell>€{voucher.voucher_value}</TableCell>
                        <TableCell>
                          <span className="font-medium text-orange-600">
                            {voucher.points_used} pts
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              voucher.status === 'issued'
                                ? 'default'
                                : voucher.status === 'redeemed'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {voucher.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {voucher.redeemed_at
                            ? new Date(voucher.redeemed_at).toLocaleDateString()
                            : new Date(voucher.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-sm">
                            {voucher.voucher_code || 'Pending'}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No vouchers redeemed</h3>
                <p className="text-muted-foreground">
                  Your personal voucher redemptions will appear here once you start redeeming
                  points.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Profile</h2>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-medium">
                    {agentData.first_name} {agentData.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{agentData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="font-medium">{agentData.telephone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Agency</label>
                  <p className="font-medium">{agentData.agencies.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge variant={agentData.is_active ? 'default' : 'secondary'}>
                    {agentData.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="font-medium">
                    {new Date(agentData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Performance Summary - Personal metrics */}
              <div className="mt-6 border-t pt-6">
                <h4 className="mb-4 font-semibold">My Performance Summary</h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalBookings}</div>
                    <div className="text-sm text-muted-foreground">My Total Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      €{totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">My Revenue Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">My Available Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalBookings > 0
                        ? Math.round((completedBookings / totalBookings) * 100)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">My Success Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
