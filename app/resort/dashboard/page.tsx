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
  Hotel,
  Calendar,
  Users,
  Star,
  Bed,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Eye,
  Plus,
} from 'lucide-react';
import { getUserProfile, getAllBookings, getAllHotels } from '@/lib/database';

export default async function ResortDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to access the resort dashboard</div>;
  }

  const [userProfile, allHotels, allBookings] = await Promise.all([
    getUserProfile(user.id),
    getAllHotels(),
    getAllBookings(),
  ]);

  // Get resort's hotel (assuming user is linked to a specific hotel)
  const resortHotel = allHotels.find((hotel) => hotel.manager_id === user.id) || allHotels[0];

  // Filter bookings for this resort
  const resortBookings = allBookings.filter((booking) => booking.hotel_id === resortHotel?.id);

  // Get room types for this hotel
  const { data: roomTypes } = await supabase
    .from('room_types')
    .select('*')
    .eq('hotel_id', resortHotel?.id || '')
    .eq('is_active', true);

  const totalBookings = resortBookings.length;
  const confirmedBookings = resortBookings.filter((b) => b.booking_status === 'confirmed').length;
  const pendingBookings = resortBookings.filter((b) => b.booking_status === 'pending').length;
  const totalRevenue = resortBookings.reduce(
    (sum, booking) => sum + (booking.total_amount || 0),
    0
  );

  // Get upcoming check-ins (next 7 days)
  const upcomingCheckIns = resortBookings.filter((booking) => {
    const checkInDate = new Date(booking.arrival_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return checkInDate >= today && checkInDate <= nextWeek;
  });

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Resort Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Hotel className="h-8 w-8 text-purple-600" />
            Resort Dashboard
          </h1>
          <p className="text-muted-foreground">
            {resortHotel?.hotel_name || 'Resort Manager'} - {userProfile?.first_name || user.email}
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          RESORT ACCESS
        </Badge>
      </div>

      {/* Resort Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{confirmedBookings} confirmed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
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
            <p className="text-xs text-muted-foreground">Total bookings value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {roomTypes && roomTypes.length > 0 ? '85%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Current occupancy</p>
          </CardContent>
        </Card>
      </div>

      {/* Resort Information Card */}
      {resortHotel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              {resortHotel.hotel_name}
              {resortHotel.star_rating && (
                <div className="ml-2 flex items-center gap-1">
                  {Array.from({ length: resortHotel.star_rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4" />
                  Location
                </h4>
                <p className="text-sm">{resortHotel.location_address}</p>
                <p className="text-sm font-medium">
                  {resortHotel.location_city}, {resortHotel.location_country}
                </p>
              </div>
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <Phone className="h-4 w-4" />
                  Contact
                </h4>
                <p className="text-sm">{resortHotel.contact_phone}</p>
                <p className="text-sm">{resortHotel.contact_email}</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Status</h4>
                <Badge variant={resortHotel.is_active ? 'default' : 'secondary'}>
                  {resortHotel.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resort Tabs */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="rooms">Room Types</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Resort Bookings</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resortBookings.map((booking) => (
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
                        <p className="font-medium">{booking.room_types?.room_type_name}</p>
                      </TableCell>
                      <TableCell>{new Date(booking.arrival_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.departure_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {booking.number_of_guests}
                        </div>
                      </TableCell>
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

        {/* Room Types Tab */}
        <TabsContent value="rooms" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Room Types</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room Type
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roomTypes?.map((roomType) => (
              <Card key={roomType.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    {roomType.room_type_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Occupancy:</span>
                    <span className="font-medium">{roomType.max_occupancy} guests</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-medium">€{roomType.base_price || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={roomType.is_active ? 'default' : 'secondary'}>
                      {roomType.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {roomType.amenities && roomType.amenities.length > 0 && (
                    <div>
                      <p className="mb-1 text-sm font-medium">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {roomType.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {roomType.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{roomType.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <Button className="w-full" variant="outline" size="sm">
                    Edit Room Type
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Check-ins Tab */}
        <TabsContent value="checkins" className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Check-ins (Next 7 Days)</h2>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Check-in Date</TableHead>
                    <TableHead>Nights</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingCheckIns.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guest_name}</p>
                          <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.room_types?.room_type_name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {new Date(booking.arrival_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.arrival_date).toLocaleDateString('en-US', {
                              weekday: 'long',
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.number_of_nights}</TableCell>
                      <TableCell>{booking.number_of_guests}</TableCell>
                      <TableCell>
                        <Badge
                          variant={booking.booking_status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {booking.booking_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {upcomingCheckIns.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold">No upcoming check-ins</h3>
                <p className="text-muted-foreground">
                  No guests are scheduled to check in within the next 7 days.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Resort Settings</h2>

          <Card>
            <CardHeader>
              <CardTitle>Resort Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Resort Name</label>
                  <p className="font-medium">{resortHotel?.hotel_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Star Rating</label>
                  <div className="flex items-center gap-1">
                    {resortHotel?.star_rating &&
                      Array.from({ length: resortHotel.star_rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="font-medium">
                    {resortHotel?.location_city}, {resortHotel?.location_country}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manager</label>
                  <p className="font-medium">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </p>
                </div>
              </div>
              <Button variant="outline">Edit Resort Information</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
