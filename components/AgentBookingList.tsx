'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Calendar,
  Hotel,
  Bed,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Booking {
  id: string;
  guest_name: string;
  arrival_date: string;
  departure_date: string;
  number_of_nights: number;
  reward_points: number;
  verification_status: 'pending' | 'approved' | 'rejected' | 'review';
  reference_number?: string;
  confirmation_number: string;
  admin_notes?: string;
  rejection_reason?: string;
  hotels: {
    hotel_name: string;
    location_city: string;
    location_country: string;
  };
  room_types: {
    room_type_name: string;
    points_per_night: number;
    category: string;
  };
}

interface AgentBookingsListProps {
  refreshTrigger?: number;
  initialBookings?: Booking[];
}

// Fixed agent ID for development - will be dynamic in production
const FIXED_AGENT_ID = 'dev-agent-123';

export default function AgentBookingsList({
  refreshTrigger = 0,
  initialBookings = [],
}: AgentBookingsListProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(!initialBookings.length);

  useEffect(() => {
    if (!initialBookings.length || refreshTrigger > 0) {
      fetchBookings();
    }
  }, [refreshTrigger]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Use fixed agent ID for development
      const response = await fetch(`/api/create-booking?agent_id=${FIXED_AGENT_ID}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'review':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'review':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-muted-foreground">Loading bookings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Bookings ({bookings.length})
          <span className="text-sm font-normal text-muted-foreground">
            (Agent: {FIXED_AGENT_ID})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="py-8 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No bookings yet</h3>
            <p className="text-muted-foreground">
              Start by logging your first booking. Using agent ID:{' '}
              <code className="rounded bg-gray-100 px-1">{FIXED_AGENT_ID}</code>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest & Booking</TableHead>
                  <TableHead>Hotel & Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.guest_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.confirmation_number}
                        </p>
                        {booking.reference_number && (
                          <p className="text-xs text-muted-foreground">
                            Ref: {booking.reference_number}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <div className="mb-1 flex items-center gap-1">
                          <Hotel className="h-3 w-3" />
                          <p className="text-sm font-medium">{booking.hotels.hotel_name}</p>
                        </div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          {booking.hotels.location_city}, {booking.hotels.location_country}
                        </p>
                        <div className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          <p className="text-xs">{booking.room_types.room_type_name}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(booking.arrival_date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">to</p>
                        <p>{new Date(booking.departure_date).toLocaleDateString()}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.number_of_nights} night
                          {booking.number_of_nights !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-orange-600">
                          {booking.reward_points}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {booking.room_types.points_per_night}/night
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant={getStatusVariant(booking.verification_status)}
                          className="flex w-fit items-center gap-1"
                        >
                          {getStatusIcon(booking.verification_status)}
                          {booking.verification_status.charAt(0).toUpperCase() +
                            booking.verification_status.slice(1)}
                        </Badge>

                        {(booking.admin_notes || booking.rejection_reason) && (
                          <div className="rounded border bg-gray-50 p-2 text-xs">
                            <p className="font-medium text-gray-700">Admin Note:</p>
                            <p className="text-gray-600">
                              {booking.rejection_reason || booking.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
