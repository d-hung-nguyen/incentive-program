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
  Globe,
  Users,
  TrendingUp,
  BarChart,
  MapPin,
  Plane,
  Building2,
  Eye,
  Plus,
} from 'lucide-react';
import {
  getUserProfile,
  getAllAgencies,
  getAllBookings,
  getRegionalAgencies,
} from '@/lib/database';
import { redirect } from 'next/navigation';

export default async function RegionalDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile and check if they're a regional manager
  const userProfile = await getUserProfile(user.id);

  if (!userProfile || userProfile.user_type !== 'regional') {
    redirect('/dashboard');
  }

  const [allAgencies, allBookings] = await Promise.all([
    getRegionalAgencies(userProfile.region || ''),
    getAllBookings(),
  ]);

  // Filter bookings for agencies in this region
  const agencyIds = allAgencies.map((agency) => agency.id);
  const regionalBookings = allBookings.filter(
    (booking) => booking.agency_id && agencyIds.includes(booking.agency_id)
  );

  const totalAgencies = allAgencies.length;
  const activeAgencies = allAgencies.filter((agency) => agency.is_active).length;
  const totalBookings = regionalBookings.length;
  const thisMonthBookings = regionalBookings.filter(
    (booking) => new Date(booking.created_at).getMonth() === new Date().getMonth()
  ).length;

  const totalRevenue = regionalBookings.reduce(
    (sum, booking) => sum + (booking.total_amount || 0),
    0
  );

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Regional Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Globe className="h-8 w-8 text-green-600" />
            Regional Dashboard
          </h1>
          <p className="text-muted-foreground">
            Regional Manager - {userProfile.first_name || userProfile.email || 'User'}{' '}
            {userProfile.last_name || ''}
          </p>
          <p className="text-sm text-muted-foreground">
            Region: {userProfile.region || 'Not specified'}
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          REGIONAL ACCESS
        </Badge>
      </div>

      {/* Regional Stats Overview */}
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
            <CardTitle className="text-sm font-medium">Regional Bookings</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-xs text-muted-foreground">Total regional revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {thisMonthBookings > 0 ? '+8%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Regional Tabs */}
      <Tabs defaultValue="agencies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Agencies Tab */}
        <TabsContent value="agencies" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Regional Agencies</h2>
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
                    <TableHead>Agency Name</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAgencies.map((agency) => {
                    const agencyBookings = regionalBookings.filter(
                      (b) => b.agency_id === agency.id
                    );
                    return (
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
                          {agency.agents ? (
                            <div>
                              <p className="font-medium">
                                {agency.agents.first_name} {agency.agents.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">{agency.agents.email}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No agent assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{agency.city}</p>
                            <p className="text-sm text-muted-foreground">{agency.country}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{agency.email}</p>
                            <p className="text-sm text-muted-foreground">{agency.telephone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{agencyBookings.length}</span>
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
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <h2 className="text-xl font-semibold">Regional Performance</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allAgencies
                    .map((agency) => ({
                      ...agency,
                      bookingCount: regionalBookings.filter((b) => b.agency_id === agency.id)
                        .length,
                    }))
                    .sort((a, b) => b.bookingCount - a.bookingCount)
                    .slice(0, 5)
                    .map((agency, index) => (
                      <div key={agency.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{agency.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {agency.bookingCount} bookings
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month:</span>
                    <span className="font-medium">{thisMonthBookings} bookings</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average per Agency:</span>
                    <span className="font-medium">
                      {activeAgencies > 0 ? Math.round(thisMonthBookings / activeAgencies) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth Rate:</span>
                    <span className="font-medium text-green-600">+8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Revenue:</span>
                    <span className="font-medium">€{totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold">Regional Reports</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Comprehensive monthly performance report for {userProfile.region || 'your region'}
                </p>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agency Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Individual agency performance metrics and rankings
                </p>
                <Button className="w-full" variant="outline">
                  View Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  Detailed revenue breakdown and growth analysis
                </p>
                <Button className="w-full" variant="outline">
                  View Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Regional Settings</h2>

          <Card>
            <CardHeader>
              <CardTitle>Region Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Region Name</label>
                <p className="font-medium">{userProfile.region || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Agencies</label>
                <p className="font-medium">{totalAgencies}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Regional Manager
                </label>
                <p className="font-medium">
                  {userProfile.first_name} {userProfile.last_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact</label>
                <p className="font-medium">{userProfile.phone || 'Not provided'}</p>
              </div>
              <Button variant="outline">Edit Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
