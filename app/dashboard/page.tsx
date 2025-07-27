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
  Shield,
  Users,
  Building2,
  Hotel,
  Calendar,
  TrendingUp,
  Award,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Admin-specific database functions
async function getAdminStats() {
  const supabase = createClient();

  try {
    const [
      { count: totalAgents },
      { count: activeAgents },
      { count: totalAgencies },
      { count: activeAgencies },
      { count: totalBookings },
      { count: totalHotels },
      { count: totalUsers },
    ] = await Promise.all([
      supabase.from('agents').select('*', { count: 'exact', head: true }),
      supabase.from('agents').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('agencies').select('*', { count: 'exact', head: true }),
      supabase.from('agencies').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('hotels').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    ]);

    // Get revenue and points data
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('total_amount, created_at');

    const { data: pointsData } = await supabase
      .from('point_transactions')
      .select('points, created_at');

    const totalRevenue =
      bookingsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
    const totalPoints =
      pointsData?.reduce((sum, transaction) => sum + Math.abs(transaction.points), 0) || 0;

    // This month's stats
    const thisMonth = new Date();
    thisMonth.setDate(1);

    const thisMonthBookings =
      bookingsData?.filter((b) => new Date(b.created_at) >= thisMonth).length || 0;

    const thisMonthRevenue =
      bookingsData
        ?.filter((b) => new Date(b.created_at) >= thisMonth)
        .reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return {
      totalAgents: totalAgents || 0,
      activeAgents: activeAgents || 0,
      totalAgencies: totalAgencies || 0,
      activeAgencies: activeAgencies || 0,
      totalBookings: totalBookings || 0,
      totalHotels: totalHotels || 0,
      totalUsers: totalUsers || 0,
      totalRevenue,
      totalPoints,
      thisMonthBookings,
      thisMonthRevenue,
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      totalAgents: 0,
      activeAgents: 0,
      totalAgencies: 0,
      activeAgencies: 0,
      totalBookings: 0,
      totalHotels: 0,
      totalUsers: 0,
      totalRevenue: 0,
      totalPoints: 0,
      thisMonthBookings: 0,
      thisMonthRevenue: 0,
    };
  }
}

async function getRecentBookings() {
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
      agencies (
        name
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching recent bookings:', error);
    return [];
  }

  return data || [];
}

async function getRecentPointTransactions() {
  const supabase = createClient();

  // Since there's no direct relationship, we'll fetch transactions and then get user data separately
  const { data: transactions, error } = await supabase
    .from('point_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching point transactions:', error);
    return [];
  }

  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Get user profiles for these transactions
  const userIds = [...new Set(transactions.map((t) => t.user_id).filter(Boolean))];

  if (userIds.length === 0) {
    return transactions.map((t) => ({ ...t, user_profiles: null }));
  }

  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, user_type')
    .in('id', userIds);

  // Combine the data
  const transactionsWithUsers = transactions.map((transaction) => ({
    ...transaction,
    user_profiles: userProfiles?.find((profile) => profile.id === transaction.user_id) || null,
  }));

  return transactionsWithUsers;
}

async function getAllAgentsWithAgencies() {
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
        is_active
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

async function getAllAgencies() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('agencies')
    .select(
      `
      *,
      agents!agencies_agent_id_fkey (
        id,
        first_name,
        last_name,
        email,
        is_active
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agencies:', error);
    return [];
  }

  return data || [];
}

async function getSystemHealth() {
  const supabase = createClient();

  try {
    // Check for agents without agencies
    const { count: unassignedAgents } = await supabase
      .from('agents')
      .select('*', { count: 'exact', head: true })
      .is('agency_id', null);

    // Check for inactive agencies with active agents
    const { data: inactiveAgenciesWithActiveAgents } = await supabase
      .from('agencies')
      .select(
        `
        id,
        name,
        is_active,
        agents!inner (
          id,
          is_active
        )
      `
      )
      .eq('is_active', false)
      .eq('agents.is_active', true);

    // Check for pending voucher redemptions
    const { count: pendingVouchers } = await supabase
      .from('voucher_redemptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    return {
      unassignedAgents: unassignedAgents || 0,
      conflictingAgencies: inactiveAgenciesWithActiveAgents?.length || 0,
      pendingVouchers: pendingVouchers || 0,
    };
  } catch (error) {
    console.error('Error checking system health:', error);
    return {
      unassignedAgents: 0,
      conflictingAgencies: 0,
      pendingVouchers: 0,
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

  const [stats, agents, agencies, recentBookings, pointTransactions, systemHealth] =
    await Promise.all([
      getAdminStats(),
      getAllAgentsWithAgencies(),
      getAllAgencies(),
      getRecentBookings(),
      getRecentPointTransactions(),
      getSystemHealth(),
    ]);

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Shield className="h-8 w-8 text-red-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System overview and management tools</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            ADMIN ACCESS
          </Badge>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Health Alerts */}
      {(systemHealth.unassignedAgents > 0 ||
        systemHealth.conflictingAgencies > 0 ||
        systemHealth.pendingVouchers > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              System Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {systemHealth.unassignedAgents > 0 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <UserX className="h-4 w-4" />
                  <span>{systemHealth.unassignedAgents} agents without agencies</span>
                </div>
              )}
              {systemHealth.conflictingAgencies > 0 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Building2 className="h-4 w-4" />
                  <span>
                    {systemHealth.conflictingAgencies} inactive agencies with active agents
                  </span>
                </div>
              )}
              {systemHealth.pendingVouchers > 0 && (
                <div className="flex items-center gap-2 text-orange-700">
                  <Clock className="h-4 w-4" />
                  <span>{systemHealth.pendingVouchers} pending voucher redemptions</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeAgents} active agents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgencies}</div>
            <p className="text-xs text-muted-foreground">{stats.activeAgencies} active agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              €{stats.thisMonthRevenue.toLocaleString()} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">{stats.thisMonthBookings} this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button className="h-20 flex-col gap-2">
              <Plus className="h-5 w-5" />
              Add New Agent
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Building2 className="h-5 w-5" />
              Add New Agency
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Hotel className="h-5 w-5" />
              Add New Hotel
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Award className="h-5 w-5" />
              Manage Rewards
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Agents Management Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Agent Management</h2>
            <div className="flex items-center gap-2">
              <Input placeholder="Search agents..." className="w-64" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {agent.first_name} {agent.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {agent.id.substring(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {agent.agencies ? (
                          <div>
                            <p className="font-medium">{agent.agencies.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {agent.agencies.city}, {agent.agencies.country}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{agent.email}</p>
                          <p className="text-sm text-muted-foreground">{agent.telephone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                          {agent.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(agent.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agencies Management Tab */}
        <TabsContent value="agencies" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Agency Management</h2>
            <div className="flex items-center gap-2">
              <Input placeholder="Search agencies..." className="w-64" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agencies</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Agency
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Agents</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{agency.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {agency.id.substring(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {agency.city}, {agency.country}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{agency.agents?.length || 0} agents</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{agency.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{agency.telephone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={agency.is_active ? 'default' : 'secondary'}>
                          {agency.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Management Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <div className="flex items-center gap-2">
              <Input placeholder="Search bookings..." className="w-64" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.confirmation_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.guest_name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.hotels?.hotel_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.hotels?.location_city}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {booking.agents ? (
                          <div>
                            <p className="text-sm font-medium">
                              {booking.agents.first_name} {booking.agents.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.agencies?.name}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No agent</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          €{booking.total_amount?.toLocaleString() || '0'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.booking_status === 'confirmed'
                              ? 'default'
                              : booking.booking_status === 'cancelled'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {booking.booking_status}
                        </Badge>
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
        </TabsContent>

        {/* Points Management Tab */}
        <TabsContent value="points" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Points & Rewards Management</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-orange-600">
                {stats.totalPoints.toLocaleString()} Total Points Distributed
              </Badge>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Award Points
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Points Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalPoints.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Total points in circulation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending Vouchers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {systemHealth.pendingVouchers}
                </div>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Reward Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">5</div>
                <p className="text-sm text-muted-foreground">Active reward types</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Point Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pointTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {transaction.user_profiles?.first_name}{' '}
                            {transaction.user_profiles?.last_name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.user_profiles?.user_type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.transaction_type === 'earned' ? 'default' : 'secondary'
                          }
                        >
                          {transaction.transaction_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.points > 0 ? '+' : ''}
                          {transaction.points} pts
                        </span>
                      </TableCell>
                      <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hotels Management Tab */}
        <TabsContent value="hotels" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Hotel Management</h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.totalHotels} Hotels</Badge>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Hotel
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <Hotel className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Hotel Management</h3>
              <p className="mb-4 text-muted-foreground">
                Manage hotel properties, room types, and availability
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Hotel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reports & Analytics</h2>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month Revenue</span>
                    <span className="font-medium">€{stats.thisMonthRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Month Bookings</span>
                    <span className="font-medium">{stats.thisMonthBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Booking Value</span>
                    <span className="font-medium">
                      €
                      {stats.thisMonthBookings > 0
                        ? Math.round(stats.thisMonthRevenue / stats.thisMonthBookings)
                        : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Agents</span>
                    <span className="font-medium">{stats.activeAgents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Agencies</span>
                    <span className="font-medium">{stats.activeAgencies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">System Health</span>
                    <Badge
                      variant={
                        systemHealth.unassignedAgents === 0 &&
                        systemHealth.conflictingAgencies === 0 &&
                        systemHealth.pendingVouchers === 0
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {systemHealth.unassignedAgents === 0 &&
                      systemHealth.conflictingAgencies === 0 &&
                      systemHealth.pendingVouchers === 0
                        ? 'Healthy'
                        : 'Issues Found'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
