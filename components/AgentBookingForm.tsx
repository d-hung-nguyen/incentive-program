'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Hotel, Bed, Plus, Loader2 } from 'lucide-react';

interface Hotel {
  id: string;
  hotel_name: string;
  location_city: string;
  location_country: string;
}

interface RoomType {
  id: string;
  room_type_name: string;
  points_per_night: number;
  category: string;
  description?: string;
}

interface BookingFormProps {
  onBookingCreated?: () => void;
}

// Fixed agent ID for development - will be dynamic in production
const FIXED_AGENT_ID = 'dev-agent-123';

export default function AgentBookingForm({ onBookingCreated }: BookingFormProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  const [formData, setFormData] = useState({
    guest_name: '',
    hotel_id: '',
    room_type_id: '',
    arrival_date: '',
    departure_date: '',
    reference_number: '',
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (formData.hotel_id) {
      fetchRoomTypesForHotel(formData.hotel_id);
    } else {
      setRoomTypes([]);
    }
  }, [formData.hotel_id]);

  const fetchHotels = async () => {
    try {
      const response = await fetch('/api/hotels');
      const data = await response.json();
      setHotels(data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchRoomTypesForHotel = async (hotelId: string) => {
    setLoadingRoomTypes(true);
    try {
      const response = await fetch(`/api/room-types?hotel_id=${hotelId}`);
      const data = await response.json();
      setRoomTypes(data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
      setRoomTypes([]);
    } finally {
      setLoadingRoomTypes(false);
    }
  };

  const calculateNights = () => {
    if (formData.arrival_date && formData.departure_date) {
      const checkIn = new Date(formData.arrival_date);
      const checkOut = new Date(formData.departure_date);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const calculatePoints = () => {
    const selectedRoom = roomTypes.find((room) => room.id === formData.room_type_id);
    const nights = calculateNights();
    return selectedRoom ? selectedRoom.points_per_night * nights : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use your existing API endpoint with fixed agent ID
      const response = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agent_id: FIXED_AGENT_ID, // Use fixed agent ID
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Booking created successfully!');
        setFormData({
          guest_name: '',
          hotel_id: '',
          room_type_id: '',
          arrival_date: '',
          departure_date: '',
          reference_number: '',
        });
        if (onBookingCreated) {
          onBookingCreated();
        }
      } else {
        alert(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const selectedHotel = hotels.find((hotel) => hotel.id === formData.hotel_id);
  const selectedRoom = roomTypes.find((room) => room.id === formData.room_type_id);
  const nights = calculateNights();
  const points = calculatePoints();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Log New Booking
          <span className="text-sm font-normal text-muted-foreground">
            (Agent: {FIXED_AGENT_ID})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="guest_name">Guest Name *</Label>
              <Input
                id="guest_name"
                value={formData.guest_name}
                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                placeholder="Enter guest name"
                required
              />
            </div>

            <div>
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                placeholder="Booking reference (optional)"
              />
            </div>

            <div>
              <Label htmlFor="hotel_id">Hotel *</Label>
              <Select
                value={formData.hotel_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, hotel_id: value, room_type_id: '' })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id}>
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{hotel.hotel_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {hotel.location_city}, {hotel.location_country}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="room_type_id">Room Type *</Label>
              <Select
                value={formData.room_type_id}
                onValueChange={(value) => setFormData({ ...formData, room_type_id: value })}
                required
                disabled={!formData.hotel_id || loadingRoomTypes}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.hotel_id
                        ? 'Select hotel first'
                        : loadingRoomTypes
                          ? 'Loading...'
                          : 'Select room type'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{room.room_type_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {room.points_per_night} points per night • {room.category}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="arrival_date">Check-in Date *</Label>
              <Input
                id="arrival_date"
                type="date"
                value={formData.arrival_date}
                onChange={(e) => setFormData({ ...formData, arrival_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="departure_date">Check-out Date *</Label>
              <Input
                id="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                min={formData.arrival_date}
                required
              />
            </div>
          </div>

          {/* Booking Summary */}
          {formData.hotel_id &&
            formData.room_type_id &&
            formData.arrival_date &&
            formData.departure_date && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <h4 className="mb-2 font-medium">Booking Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Agent:</strong> {FIXED_AGENT_ID}
                    </p>
                    <p>
                      <strong>Hotel:</strong> {selectedHotel?.hotel_name}
                    </p>
                    <p>
                      <strong>Room:</strong> {selectedRoom?.room_type_name}
                    </p>
                    <p>
                      <strong>Nights:</strong> {nights}
                    </p>
                    <p>
                      <strong>Points per Night:</strong> {selectedRoom?.points_per_night}
                    </p>
                    <p>
                      <strong>Total Reward Points:</strong>{' '}
                      <span className="font-semibold text-blue-600">{points} points</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Booking...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Booking
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
