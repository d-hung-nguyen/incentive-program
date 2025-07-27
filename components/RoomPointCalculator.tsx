'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Calculator, Gift, Home, Crown, Star, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RoomType {
  id: string;
  room_type_key: string;
  room_type_name: string;
  points_per_night: number;
  category: string;
  description: string;
}

interface VoucherOption {
  type: string;
  name: string;
  rate: number;
  minimumPoints: number;
  maximumValue: number;
  description: string;
}

const VOUCHER_OPTIONS: VoucherOption[] = [
  {
    type: 'amazon_voucher',
    name: 'Amazon Voucher',
    rate: 0.01, // €0.01 per point
    minimumPoints: 500,
    maximumValue: 500,
    description: 'Amazon Gift Card',
  },
  {
    type: 'booking_credit',
    name: 'Booking Credit',
    rate: 0.012, // €0.012 per point
    minimumPoints: 250,
    maximumValue: 1000,
    description: 'Hotel Booking Credit',
  },
  {
    type: 'cash_back',
    name: 'Cash Back',
    rate: 0.008, // €0.008 per point
    minimumPoints: 1000,
    maximumValue: 200,
    description: 'Direct Cash Payment',
  },
];

export function RoomPointCalculator() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [nights, setNights] = useState<number>(3);
  const [roomCount, setRoomCount] = useState<number>(1);

  // Fetch room types from database
  useEffect(() => {
    async function fetchRoomTypes() {
      try {
        const response = await fetch('/api/room-types');
        const data = await response.json();
        setRoomTypes(data);
        if (data.length > 0) {
          setSelectedRoomType(data[0].room_type_key);
        }
      } catch (error) {
        console.error('Error fetching room types:', error);
        // Fallback to hardcoded data
        const fallbackRoomTypes: RoomType[] = [
          {
            id: '1',
            room_type_key: 'standard_room',
            room_type_name: 'Standard Room',
            points_per_night: 1.0,
            category: 'standard',
            description: 'Basic hotel room',
          },
          {
            id: '2',
            room_type_key: 'junior_suite',
            room_type_name: 'Junior Suite',
            points_per_night: 1.5,
            category: 'premium',
            description: 'Spacious suite',
          },
          {
            id: '3',
            room_type_key: 'two_bedroom_suite',
            room_type_name: 'Two Bedroom Suite',
            points_per_night: 2.0,
            category: 'family',
            description: 'Family suite',
          },
          {
            id: '4',
            room_type_key: 'signature_suite',
            room_type_name: 'Signature Suite',
            points_per_night: 4.0,
            category: 'signature',
            description: 'Premium suite',
          },
        ];
        setRoomTypes(fallbackRoomTypes);
        setSelectedRoomType(fallbackRoomTypes[0].room_type_key);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomTypes();
  }, []);

  const selectedRoom = roomTypes.find((room) => room.room_type_key === selectedRoomType);
  const totalPoints = selectedRoom ? selectedRoom.points_per_night * nights * roomCount : 0;

  const calculateVoucherValue = (points: number, voucher: VoucherOption) => {
    const value = Math.floor(points * voucher.rate * 100) / 100;
    const canRedeem = points >= voucher.minimumPoints;

    return {
      value: Math.min(value, voucher.maximumValue),
      canRedeem,
      minimumRequired: voucher.minimumPoints,
    };
  };

  const getRoomCategoryInfo = (category: string, points: number) => {
    switch (category) {
      case 'signature':
        return {
          category: 'Signature',
          icon: <Crown className="h-4 w-4" />,
          color: 'bg-purple-100 text-purple-800',
        };
      case 'family':
        return {
          category: 'Family',
          icon: <Home className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-800',
        };
      case 'premium':
        return {
          category: 'Premium',
          icon: <Star className="h-4 w-4" />,
          color: 'bg-orange-100 text-orange-800',
        };
      default:
        return {
          category: 'Standard',
          icon: <Home className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800',
        };
    }
  };

  if (loading) {
    return (
      <Card className="dashboard-card">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
          <span className="ml-2">Loading room types...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-600" />
            Room Type Point Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="roomType">Room Type</Label>
              <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['standard', 'premium', 'family', 'signature'].map((category) => {
                    const categoryRooms = roomTypes.filter((room) => room.category === category);
                    if (categoryRooms.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">
                          {category} ({categoryRooms[0]?.points_per_night} points/night)
                        </div>
                        {categoryRooms.map((room) => (
                          <SelectItem key={room.room_type_key} value={room.room_type_key}>
                            {room.room_type_name}
                          </SelectItem>
                        ))}
                      </div>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nights">Number of Nights</Label>
              <Input
                id="nights"
                type="number"
                min="1"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="input-orange"
              />
            </div>

            <div>
              <Label htmlFor="roomCount">Number of Rooms</Label>
              <Input
                id="roomCount"
                type="number"
                min="1"
                value={roomCount}
                onChange={(e) => setRoomCount(Number(e.target.value))}
                className="input-orange"
              />
            </div>
          </div>

          {selectedRoom && (
            <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRoomCategoryInfo(selectedRoom.category, selectedRoom.points_per_night).icon}
                  <Badge
                    className={
                      getRoomCategoryInfo(selectedRoom.category, selectedRoom.points_per_night)
                        .color
                    }
                  >
                    {
                      getRoomCategoryInfo(selectedRoom.category, selectedRoom.points_per_night)
                        .category
                    }
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedRoom.points_per_night} points × {nights} nights × {roomCount} rooms
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voucher Redemption Options */}
      <div className="grid gap-4 md:grid-cols-3">
        {VOUCHER_OPTIONS.map((voucher, index) => {
          const calculation = calculateVoucherValue(totalPoints, voucher);
          const colors = [
            { primary: 'text-green-600', bg: 'text-orange-600' },
            { primary: 'text-blue-600', bg: 'text-blue-600' },
            { primary: 'text-purple-600', bg: 'text-purple-600' },
          ];

          return (
            <Card key={voucher.type} className="dashboard-card">
              <CardHeader className="pb-3">
                <CardTitle className={`flex items-center gap-2 text-lg`}>
                  <Gift className={`h-5 w-5 ${colors[index].bg}`} />
                  {voucher.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${colors[index].primary}`}>
                    €{calculation.value.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @ €{voucher.rate.toFixed(3)} per point
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Min. Required:</span>
                    <span className="font-medium">{voucher.minimumPoints} points</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max. Value:</span>
                    <span className="font-medium">€{voucher.maximumValue}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={!calculation.canRedeem}
                  variant={calculation.canRedeem ? 'default' : 'secondary'}
                >
                  {calculation.canRedeem
                    ? 'Redeem Now'
                    : `Need ${calculation.minimumRequired - totalPoints} more points`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Points Breakdown by Category */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Point System Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {['standard', 'premium', 'family', 'signature'].map((category) => {
              const categoryRooms = roomTypes.filter((room) => room.category === category);
              if (categoryRooms.length === 0) return null;

              const categoryInfo = getRoomCategoryInfo(
                category,
                categoryRooms[0]?.points_per_night || 1
              );
              const colors = {
                standard: 'bg-gray-50 border text-gray-600',
                premium: 'bg-orange-50 border-orange-200 text-orange-600',
                family: 'bg-blue-50 border-blue-200 text-blue-600',
                signature: 'bg-purple-50 border-purple-200 text-purple-600',
              };

              return (
                <div
                  key={category}
                  className={`rounded-lg border p-3 text-center ${colors[category as keyof typeof colors]}`}
                >
                  <div className="mx-auto mb-2 h-6 w-6">{categoryInfo.icon}</div>
                  <div className="font-semibold">{categoryInfo.category} Rooms</div>
                  <div className={`text-2xl font-bold`}>
                    {categoryRooms[0]?.points_per_night || 1}
                  </div>
                  <div className="text-xs text-muted-foreground">points per night</div>
                  <div className="mt-2 text-xs">
                    {categoryRooms.length} room type{categoryRooms.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
