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
  Hotel,
  TrendingUp,
  Calendar,
  Award,
  Building2,
  BarChart3,
  Settings,
  Eye,
  Plus,
} from 'lucide-react';
import { getAllAgencies, getAllHotels, getAllBookings, getAllAgents } from '@/lib/database';

export default async function AdminDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to access the admin dashboard</div>;
  }

  // Fetch admin data
  const [allAgencies, allHotels, allBookings, allAgents] = await Promise.all([
    getAllAgencies(),
    getAllHotels(),
    getAllBookings(),
    getAllAgents(),
  ]);

  const totalAgencies = allAgencies.length;
  const activeAgencies = allAgencies.filter((agency) => agency.is_active).length;
  const totalHotels = allHotels.length;
  const totalBookings = allBookings.length;
  const thisMonthBookings = allBookings.filter(
    (booking) => new Date(booking.created_at).getMonth() === new Date().getMonth()
  ).length;
  const totalRevenue = allBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Shield className="h-8 w-8 text-red-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">System Administrator - {user.email}</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          ADMIN ACCESS
        </Badge>
      </div>

      {/* Admin Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgencies}</div>
            <p className="text-xs text-muted-foreground">{activeAgencies} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHotels}</div>
            <p className="text-xs text-muted-foreground">Partner hotels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{thisMonthBookings} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New agency registration</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Hotel partnership added</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge variant="outline">Partner</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">System maintenance completed</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                    <Badge variant="outline">System</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Status</span>
                    <Badge variant="default" className="bg-green-600">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="default" className="bg-green-600">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge variant="default" className="bg-green-600">
                      Current
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agencies Tab */}
        <TabsContent value="agencies" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Travel Agencies</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agency
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agency ID</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAgencies.slice(0, 10).map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">
                        #{agency.id.toString().padStart(4, '0')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{agency.company_name}</p>
                          <p className="text-sm text-muted-foreground">{agency.iata_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {agency.first_name} {agency.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{agency.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{agency.company_city}</p>
                          <p className="text-sm text-muted-foreground">{agency.company_country}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agency.company_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={agency.is_active ? 'default' : 'secondary'}>
                          {agency.is_active ? 'Active' : 'Inactive'}
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

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Travel Agents</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAgents.slice(0, 10).map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">
                        #{agent.id.toString().substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {agent.first_name} {agent.last_name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{agent.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{agent.telephone}</p>
                      </TableCell>
                      <TableCell>
                        {agent.agencies?.[0] ? (
                          <div>
                            <p className="font-medium">{agent.agencies[0].name}</p>
                            <p className="text-sm text-muted-foreground">
                              {agent.agencies[0].city}, {agent.agencies[0].country}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">No Agency</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                          {agent.is_active ? 'Active' : 'Inactive'}
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

        {/* Hotels Tab */}
        <TabsContent value="hotels" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Partner Hotels</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hotel
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel ID</TableHead>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Star Rating</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allHotels.slice(0, 10).map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell className="font-medium">
                        #{hotel.id.toString().padStart(4, '0')}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{hotel.hotel_name}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{hotel.location_city}</p>
                          <p className="text-sm text-muted-foreground">{hotel.location_country}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: hotel.star_rating || 0 }).map((_, i) => (
                            <Award key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{hotel.contact_phone}</p>
                          <p className="text-sm text-muted-foreground">{hotel.contact_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={hotel.is_active ? 'default' : 'secondary'}>
                          {hotel.is_active ? 'Active' : 'Inactive'}
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

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Bookings</h2>
            <div className="flex gap-2">
              <Button variant="outline">Export</Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Nights</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBookings.slice(0, 10).map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        #{booking.id.toString().padStart(6, '0')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guest_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{booking.hotels?.hotel_name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{booking.agencies?.company_name}</p>
                      </TableCell>
                      <TableCell>{new Date(booking.arrival_date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.number_of_nights}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.booking_status === 'confirmed'
                              ? 'default'
                              : booking.booking_status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {booking.booking_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          €{booking.total_amount?.toLocaleString() || 'N/A'}
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">System Settings</h2>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Advanced Settings
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Platform Name</label>
                  <p className="font-medium">Travel Incentive Program</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Version</label>
                  <p className="font-medium">v1.0.0</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Environment</label>
                  <Badge variant="outline">Production</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Edit Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Users:</span>
                  <span className="font-medium">{totalAgencies + 10}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Sessions:</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Admin Users:</span>
                  <span className="font-medium">3</span>
                </div>
                <Button variant="outline" size="sm">
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
