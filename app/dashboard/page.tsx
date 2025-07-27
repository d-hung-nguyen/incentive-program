import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  Users,
  Hotel,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Euro,
  Plus,
  Eye,
  Edit,
  Plane,
  MapPin,
  Award,
  Globe,
  Shield,
  CalendarDays,
  Activity,
  Trophy,
  UserCheck,
  User,
  Mail,
  Phone,
  Star,
} from 'lucide-react';

import { createClient } from '@/utils/supabase/server';

// Your existing imports for database functions
import {
  getSystemStats,
  getAllHotels,
  getAllAgencies,
  getAllBookings,
  getAllOrganizations,
  getAllUsers,
} from '@/lib/database';
import { RoomPointCalculator } from '@/components/RoomPointCalculator';

interface Hotel {
  id: string;
  hotel_name: string;
  location_city: string;
  location_country: string;
  tags?: string[];
  // ... other hotel properties
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;

  // Fetch admin data - include bookings
  const [allOrganizations, systemStats, allUsers, allAgencies, allHotels, allBookings] =
    await Promise.all([
      getAllOrganizations(),
      getSystemStats(),
      getAllUsers(),
      getAllAgencies(),
      getAllHotels(),
      getAllBookings(),
    ]);

  // Mock data for programs - remove this if you have real data
  const allPrograms: { is_active: boolean }[] = [];

  return (
    <main className="flex-1">
      <div className="container mx-auto space-y-6 py-6">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <Shield className="h-8 w-8 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              {user ? `Logged in as: ${user.email}` : 'Development Mode - Admin Access'}
            </p>
          </div>
          <Badge variant="destructive" className="px-3 py-1">
            ADMIN ACCESS
          </Badge>
        </div>

        {/* System Stats Overview - Update to 7 columns for bookings */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">
                {allOrganizations.filter((org) => org.is_active).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {allUsers.filter((user) => user.is_active).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalPrograms}</div>
              <p className="text-xs text-muted-foreground">
                {allPrograms.filter((program) => program.is_active).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agencies</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allAgencies.length}</div>
              <p className="text-xs text-muted-foreground">
                {allAgencies.filter((agency) => agency.is_active).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hotels</CardTitle>
              <Hotel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allHotels.length}</div>
              <p className="text-xs text-muted-foreground">
                {allHotels.filter((hotel) => hotel.is_active).length} active hotels
              </p>
            </CardContent>
          </Card>

          {/* NEW BOOKINGS CARD */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allBookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {allBookings.filter((booking) => booking.booking_status === 'confirmed').length}{' '}
                confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalTransactions}</div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs - Update to 7 columns for bookings */}
        <Tabs defaultValue="organizations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger> {/* Add this */}
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Organizations</h2>
              <Badge variant="outline">{allOrganizations.length} Total</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allOrganizations.map((org) => (
                <Card key={org.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5" />
                        {org.name}
                      </CardTitle>
                      <Badge variant={org.is_active ? 'default' : 'secondary'}>
                        {org.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{org.type}</Badge>
                    </div>
                    {org.parent_organization && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Parent:</span>
                        <span className="text-xs font-medium">{org.parent_organization.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="font-semibold">{org.user_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Programs:</span>
                      <div className="text-right">
                        <span className="font-semibold">{org.active_programs_count}</span>
                        <span className="text-muted-foreground">/{org.total_programs_count}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(org.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {allOrganizations.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No organizations found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Users</h2>
              <Badge variant="outline">{allUsers.length} Total</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allUsers.map((user) => (
                <Card key={user.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <UserCheck className="h-5 w-5" />
                        User Profile
                      </CardTitle>
                      <div className="flex flex-col gap-1">
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Organization:</span>
                      <span className="text-xs font-medium">
                        {user.organizations?.name || 'No Organization'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Role:</span>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {allUsers.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No users found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Agencies Management</h2>
              <Button className="cta-button">
                <Plus className="mr-2 h-4 w-4" />
                New Agency
              </Button>
            </div>

            <Card className="dashboard-card">
              <CardHeader className="table-header-orange">
                <CardTitle>Travel Agencies Directory</CardTitle>
                <CardDescription>
                  Manage and track all travel agency partners in your network
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-orange-200">
                        <TableHead className="w-[100px]">Agency ID</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>IATA Code</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAgencies.map((agency) => (
                        <TableRow key={agency.id} className="table-row-hover border-orange-100">
                          <TableCell className="font-medium">
                            #{agency.id.toString().padStart(4, '0')}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {agency.first_name} {agency.last_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {agency.position || 'Agent'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{agency.company_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {agency.company_type || 'Travel Agency'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {agency.company_city}, {agency.company_country}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {agency.company_zip_code}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-orange-600" />
                                <a
                                  href={`mailto:${agency.email}`}
                                  className="max-w-[150px] truncate text-sm text-blue-600 hover:underline"
                                >
                                  {agency.email}
                                </a>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3 text-orange-600" />
                                <a
                                  href={`tel:${agency.telephone}`}
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {agency.telephone}
                                </a>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {agency.iata_code ? (
                              <Badge variant="outline" className="font-mono">
                                {agency.iata_code}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {agency.specializations && agency.specializations.length > 0 ? (
                                agency.specializations.slice(0, 2).map((spec: string) => (
                                  <Badge key={spec} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  General
                                </Badge>
                              )}
                              {agency.specializations && agency.specializations.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{agency.specializations.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={agency.is_active ? 'default' : 'secondary'}
                              className={
                                agency.is_active
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {agency.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(agency.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {allAgencies.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Plane className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">No agencies found</h3>
                    <p className="max-w-sm text-center text-muted-foreground">
                      Travel agencies will appear here once they register with your platform.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agency Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Agencies</p>
                      <p className="text-2xl font-bold text-green-600">
                        {allAgencies.filter((a) => a.is_active).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-orange-100 p-2">
                      <Globe className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Countries</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {new Set(allAgencies.map((a) => a.company_country)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Award className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">IATA Certified</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {allAgencies.filter((a) => a.iata_code).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {
                          allAgencies.filter(
                            (a) =>
                              new Date(a.created_at).getMonth() === new Date().getMonth() &&
                              new Date(a.created_at).getFullYear() === new Date().getFullYear()
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NEW HOTELS TAB */}
          <TabsContent value="hotels" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Hotels Directory</h2>
              <Badge variant="outline">{allHotels.length} Total</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allHotels.map((hotel) => (
                <Card key={hotel.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Hotel className="h-5 w-5" />
                          {hotel.hotel_name}
                        </CardTitle>
                        {hotel.star_rating && (
                          <div className="mt-1 flex items-center gap-1">
                            {Array.from({ length: hotel.star_rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">
                              {hotel.star_rating} Star
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={hotel.is_active ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {hotel.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="text-sm">
                        <p>{hotel.location_address}</p>
                        <p className="font-medium">
                          {hotel.location_city}, {hotel.location_country}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {hotel.tags && hotel.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {hotel.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {hotel.description && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {hotel.description}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${hotel.contact_email}`}
                          className="truncate text-sm text-blue-600 hover:underline"
                        >
                          {hotel.contact_email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${hotel.contact_phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {hotel.contact_phone}
                        </a>
                      </div>
                      {hotel.contact_website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={hotel.contact_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-sm text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="pt-2">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                          Key Amenities:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.slice(0, 4).map((amenity: string) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity.replace('-', ' ')}
                            </Badge>
                          ))}
                          {hotel.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{hotel.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Contact
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {allHotels.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <Hotel className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No hotels found</h3>
                    <p className="text-muted-foreground">
                      Hotels will appear here once added to the database
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* NEW BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Bookings Management</h2>
              <Button className="cta-button">
                <Plus className="mr-2 h-4 w-4" />
                New Booking
              </Button>
            </div>

            <Card className="dashboard-card">
              <CardHeader className="table-header-orange">
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Manage and track all hotel bookings from your agency partners
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-orange-200">
                        <TableHead className="w-[100px]">Booking ID</TableHead>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Hotel</TableHead>
                        <TableHead>Agency</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead className="text-right">Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBookings.map((booking) => (
                        <TableRow key={booking.id} className="table-row-hover border-orange-100">
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
                            <div>
                              <p className="font-medium">{booking.hotels?.hotel_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.hotels?.location_city}, {booking.hotels?.location_country}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.agencies?.company_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.agencies?.company_city}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(booking.arrival_date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            {new Date(booking.departure_date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.room_types?.room_type_name}</p>
                              <p className="text-sm text-muted-foreground">
                                Max {booking.room_types?.max_occupancy} guests
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-orange-600" />
                              <span>{booking.number_of_guests}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            €
                            {booking.total_amount?.toLocaleString('de-DE', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.booking_status === 'confirmed'
                                  ? 'default'
                                  : booking.booking_status === 'pending'
                                    ? 'secondary'
                                    : booking.booking_status === 'cancelled'
                                      ? 'destructive'
                                      : 'outline'
                              }
                              className={
                                booking.booking_status === 'confirmed'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : booking.booking_status === 'pending'
                                    ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                    : ''
                              }
                            >
                              {booking.booking_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {allBookings.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-medium">No bookings found</h3>
                    <p className="max-w-sm text-center text-muted-foreground">
                      When agencies make hotel bookings, they will appear here for you to manage.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Booking Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-2xl font-bold text-green-600">
                        {allBookings.filter((b) => b.booking_status === 'confirmed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-orange-100 p-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {allBookings.filter((b) => b.booking_status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-red-100 p-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                      <p className="text-2xl font-bold text-red-600">
                        {allBookings.filter((b) => b.booking_status === 'cancelled').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <Euro className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-blue-600">
                        €
                        {allBookings
                          .filter((b) => b.booking_status === 'confirmed')
                          .reduce((sum, b) => sum + (b.total_amount || 0), 0)
                          .toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* NEW POINTS TAB */}
          <TabsContent value="points" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Points & Rewards System</h2>
              <Badge variant="secondary" className="text-orange-600">
                Room-based Points
              </Badge>
            </div>

            <RoomPointCalculator />
          </TabsContent>

          {/* Update System Tab to include bookings */}
          <TabsContent value="system" className="space-y-4">
            <h2 className="text-xl font-semibold">System Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Database Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Organizations:</span>
                    <Badge variant={systemStats.totalOrganizations > 0 ? 'default' : 'secondary'}>
                      {systemStats.totalOrganizations} records
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <Badge variant={systemStats.totalUsers > 0 ? 'default' : 'secondary'}>
                      {systemStats.totalUsers} records
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Programs:</span>
                    <Badge variant={systemStats.totalPrograms > 0 ? 'default' : 'secondary'}>
                      {systemStats.totalPrograms} records
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Agencies:</span>
                    <Badge variant={allAgencies.length > 0 ? 'default' : 'secondary'}>
                      {allAgencies.length} records
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotels:</span>
                    <Badge variant={allHotels.length > 0 ? 'default' : 'secondary'}>
                      {allHotels.length} records
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bookings:</span>
                    <Badge variant={allBookings.length > 0 ? 'default' : 'secondary'}>
                      {allBookings.length} records
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <Badge variant={systemStats.totalTransactions > 0 ? 'default' : 'secondary'}>
                      {systemStats.totalTransactions} records
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Add New Booking
                  </Button>
                  <Button className="w-full" variant="outline">
                    Add New Hotel
                  </Button>
                  <Button className="w-full" variant="outline">
                    Add New Agency
                  </Button>
                  <Button className="w-full" variant="outline">
                    Create New Program
                  </Button>
                  <Button className="w-full" variant="outline">
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
