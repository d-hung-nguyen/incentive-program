'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Hotel, MapPin, Star, Bed, Trash2, Edit, Award } from 'lucide-react';

interface RoomType {
  room_type_name: string;
  description: string;
  points_per_night: number;
  category: string;
  max_occupancy: number;
  base_price: number;
  amenities: string[];
}

interface Hotel {
  id: string;
  hotel_name: string;
  contact_email: string;
  contact_phone: string;
  location_city: string;
  location_country: string;
  star_rating: number;
  room_types: RoomType[];
}

export default function HotelManagement() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    hotel_name: '',
    contact_email: '',
    contact_phone: '',
    contact_website: '',
    location_address: '',
    location_city: '',
    location_country: '',
    location_zip_code: '',
    star_rating: 3,
    description: '',
    amenities: [] as string[],
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    {
      room_type_name: 'Standard Room',
      description: 'Comfortable standard accommodation',
      points_per_night: 5,
      category: 'Standard',
      max_occupancy: 2,
      base_price: 100,
      amenities: ['WiFi', 'TV', 'Air Conditioning'],
    },
  ]);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('/api/admin/hotels');
      const data = await response.json();
      setHotels(data.hotels || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const addRoomType = () => {
    setRoomTypes([
      ...roomTypes,
      {
        room_type_name: '',
        description: '',
        points_per_night: 5,
        category: 'Standard',
        max_occupancy: 2,
        base_price: 100,
        amenities: [],
      },
    ]);
  };

  const updateRoomType = (index: number, field: keyof RoomType, value: any) => {
    const updated = [...roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    setRoomTypes(updated);
  };

  const removeRoomType = (index: number) => {
    if (roomTypes.length > 1) {
      setRoomTypes(roomTypes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          room_types: roomTypes,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Hotel created successfully!');
        setShowForm(false);
        fetchHotels();
        // Reset form
        setFormData({
          hotel_name: '',
          contact_email: '',
          contact_phone: '',
          contact_website: '',
          location_address: '',
          location_city: '',
          location_country: '',
          location_zip_code: '',
          star_rating: 3,
          description: '',
          amenities: [],
        });
        setRoomTypes([
          {
            room_type_name: 'Standard Room',
            description: 'Comfortable standard accommodation',
            points_per_night: 5,
            category: 'Standard',
            max_occupancy: 2,
            base_price: 100,
            amenities: ['WiFi', 'TV', 'Air Conditioning'],
          },
        ]);
      } else {
        alert(result.error || 'Failed to create hotel');
      }
    } catch (error) {
      console.error('Error creating hotel:', error);
      alert('Failed to create hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hotel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Hotel</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Hotel Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hotel Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="hotel_name">Hotel Name *</Label>
                      <Input
                        id="hotel_name"
                        value={formData.hotel_name}
                        onChange={(e) => setFormData({ ...formData, hotel_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="star_rating">Star Rating *</Label>
                      <Input
                        id="star_rating"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.star_rating}
                        onChange={(e) =>
                          setFormData({ ...formData, star_rating: parseInt(e.target.value) })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Contact Phone *</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) =>
                          setFormData({ ...formData, contact_phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location_city">City *</Label>
                      <Input
                        id="location_city"
                        value={formData.location_city}
                        onChange={(e) =>
                          setFormData({ ...formData, location_city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location_country">Country *</Label>
                      <Input
                        id="location_country"
                        value={formData.location_country}
                        onChange={(e) =>
                          setFormData({ ...formData, location_country: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location_address">Address *</Label>
                    <Input
                      id="location_address"
                      value={formData.location_address}
                      onChange={(e) =>
                        setFormData({ ...formData, location_address: e.target.value })
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Room Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    Room Types & Points
                    <Button type="button" onClick={addRoomType} size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      Add Room Type
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roomTypes.map((roomType, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="pt-4">
                        <div className="mb-4 flex items-start justify-between">
                          <h4 className="font-medium">Room Type {index + 1}</h4>
                          {roomTypes.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeRoomType(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <div>
                            <Label>Room Type Name *</Label>
                            <Input
                              value={roomType.room_type_name}
                              onChange={(e) =>
                                updateRoomType(index, 'room_type_name', e.target.value)
                              }
                              placeholder="e.g., Standard Room"
                              required
                            />
                          </div>
                          <div>
                            <Label>Category</Label>
                            <Input
                              value={roomType.category}
                              onChange={(e) => updateRoomType(index, 'category', e.target.value)}
                              placeholder="e.g., Standard, Premium"
                            />
                          </div>
                          <div>
                            <Label>Points per Night *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={roomType.points_per_night}
                              onChange={(e) =>
                                updateRoomType(
                                  index,
                                  'points_per_night',
                                  parseFloat(e.target.value)
                                )
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label>Max Occupancy</Label>
                            <Input
                              type="number"
                              min="1"
                              value={roomType.max_occupancy}
                              onChange={(e) =>
                                updateRoomType(index, 'max_occupancy', parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div>
                            <Label>Base Price ($)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={roomType.base_price}
                              onChange={(e) =>
                                updateRoomType(index, 'base_price', parseFloat(e.target.value))
                              }
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label>Description</Label>
                          <Textarea
                            value={roomType.description}
                            onChange={(e) => updateRoomType(index, 'description', e.target.value)}
                            placeholder="Room description..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Hotel'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hotels List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-5 w-5" />
                    {hotel.hotel_name}
                  </CardTitle>
                  <div className="mt-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {hotel.location_city}, {hotel.location_country}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.star_rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-sm font-medium">
                    Room Types ({hotel.room_types?.length || 0})
                  </p>
                  <div className="space-y-2">
                    {hotel.room_types?.map((rt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Bed className="h-3 w-3" />
                          <span className="text-sm">{rt.room_type_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-orange-500" />
                          <span className="text-xs font-semibold text-orange-600">
                            {rt.points_per_night} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-2">
                  <p className="text-xs text-muted-foreground">{hotel.contact_email}</p>
                  <p className="text-xs text-muted-foreground">{hotel.contact_phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
