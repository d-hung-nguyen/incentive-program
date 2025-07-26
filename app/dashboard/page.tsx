import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getAllOrganizations,
  getSystemStats,
  getAllUsers,
  getAllPrograms,
  getAllAgencies,
  getAllHotels,
  getAllBookings, // Add this import
} from '@/lib/database';
import {
  Building2,
  Users,
  Trophy,
  Activity,
  Crown,
  Shield,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Plane,
  Hotel,
  Star,
  Globe,
  Wifi,
  CalendarDays, // Add this for bookings
  Clock,
  CreditCard,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;

  // Fetch admin data - include bookings
  const [
    allOrganizations,
    systemStats,
    allUsers,
    allPrograms,
    allAgencies,
    allHotels,
    allBookings,
  ] = await Promise.all([
    getAllOrganizations(),
    getSystemStats(),
    getAllUsers(),
    getAllPrograms(),
    getAllAgencies(),
    getAllHotels(),
    getAllBookings(), // Add this
  ]);

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
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
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

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Programs</h2>
              <Badge variant="outline">{allPrograms.length} Total</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {allPrograms.map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <Badge variant={program.is_active ? 'default' : 'secondary'}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {program.description && (
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    )}
                    {program.organizations && (
                      <div className="flex items-center gap-2 rounded-md bg-muted p-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{program.organizations.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {program.organizations.type}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {allPrograms.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No programs found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Travel Agencies</h2>
              <Badge variant="outline">{allAgencies.length} Total</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allAgencies.map((agency) => (
                <Card key={agency.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-5 w-5" />
                          {agency.first_name} {agency.last_name}
                        </CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">
                          {agency.company_name}
                        </p>
                      </div>
                      <Badge
                        variant={agency.is_active ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {agency.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <div className="text-sm">
                        <p>{agency.company_address}</p>
                        <p>
                          {agency.company_zip_code} {agency.company_city}
                        </p>
                        <p className="font-medium">{agency.company_country}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${agency.email}`}
                          className="truncate text-sm text-blue-600 hover:underline"
                        >
                          {agency.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${agency.telephone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {agency.telephone}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {allAgencies.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <Plane className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No agencies found</p>
                  </CardContent>
                </Card>
              )}
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
                        {hotel.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {hotel.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hotel.tags.length - 3} more
                          </Badge>
                        )}
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
                          {hotel.amenities.slice(0, 4).map((amenity) => (
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
              <h2 className="text-xl font-semibold">Hotel Bookings</h2>
              <Badge variant="outline">{allBookings.length} Total</Badge>
            </div>

            <div className="grid gap-4">
              {allBookings.map((booking) => (
                <Card key={booking.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-5 w-5" />
                          {booking.guest_name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Confirmation:{' '}
                          <span className="font-mono font-medium">
                            {booking.confirmation_number}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
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
                          className="text-xs"
                        >
                          {booking.booking_status.charAt(0).toUpperCase() +
                            booking.booking_status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {booking.number_of_nights}{' '}
                          {booking.number_of_nights === 1 ? 'Night' : 'Nights'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Hotel and Room Information */}
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="flex items-center gap-2 font-semibold">
                            <Hotel className="h-4 w-4" />
                            {booking.hotels?.hotel_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.hotels?.location_city}, {booking.hotels?.location_country}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {booking.room_types?.room_type_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Max {booking.room_types?.max_occupancy} guests
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* NEW: Agency Information */}
                    {booking.agencies && (
                      <div className="rounded-lg bg-blue-50 p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="flex items-center gap-2 font-semibold text-blue-800">
                              <Plane className="h-4 w-4" />
                              {booking.agencies.company_name}
                            </h4>
                            <p className="text-sm text-blue-700">
                              {booking.agencies.company_address}
                            </p>
                            <p className="text-sm text-blue-700">
                              {booking.agencies.company_city}, {booking.agencies.company_country}
                            </p>
                          </div>
                          <div className="text-right">
                            {booking.agencies.telephone && (
                              <a
                                href={`tel:${booking.agencies.telephone}`}
                                className="block text-sm text-blue-600 hover:underline"
                              >
                                {booking.agencies.telephone}
                              </a>
                            )}
                            {booking.agencies.email && (
                              <a
                                href={`mailto:${booking.agencies.email}`}
                                className="block text-xs text-blue-600 hover:underline"
                              >
                                {booking.agencies.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dates and Duration */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Arrival</span>
                        </div>
                        <p className="text-sm font-semibold">
                          {new Date(booking.arrival_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Departure</span>
                        </div>
                        <p className="text-sm font-semibold">
                          {new Date(booking.departure_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Duration</span>
                        </div>
                        <p className="text-sm font-semibold">
                          {booking.number_of_nights}{' '}
                          {booking.number_of_nights === 1 ? 'Night' : 'Nights'}
                        </p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    {(booking.guest_email || booking.guest_phone) && (
                      <div className="space-y-2">
                        {booking.guest_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${booking.guest_email}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {booking.guest_email}
                            </a>
                          </div>
                        )}
                        {booking.guest_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${booking.guest_phone}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {booking.guest_phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Total Amount */}
                    {booking.total_amount && (
                      <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Total Amount</span>
                        </div>
                        <span className="font-bold text-green-600">
                          ${booking.total_amount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="rounded-lg bg-blue-50 p-3">
                        <p className="mb-1 text-sm font-medium text-blue-800">Special Requests:</p>
                        <p className="text-sm text-blue-700">{booking.special_requests}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Contact Guest
                      </Button>
                      {booking.agencies && (
                        <Button size="sm" variant="outline">
                          Contact Agency
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {allBookings.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No bookings found</h3>
                    <p className="text-muted-foreground">
                      Hotel bookings will appear here once created
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
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
