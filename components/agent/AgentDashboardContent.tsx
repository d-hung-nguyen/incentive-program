'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, Plus, BarChart3, Hotel, TrendingUp } from 'lucide-react';
import AgentBookingForm from '@/components/AgentBookingForm';
import AgentBookingsList from '@/components/AgentBookingsList';
import AgentPointsProgress from '@/components/AgentPointsProgress';

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  agencies?: {
    name: string;
    city: string;
    country: string;
  };
}

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
  room_type_points: {
    room_type_name: string;
    points_per_night: number;
    category: string;
  };
}

interface PointsData {
  totalEarned: number;
  totalRedeemed: number;
  availablePoints: number;
}

interface AgentDashboardContentProps {
  agent: Agent;
  bookings: Booking[];
  pointsData: PointsData;
}

export default function AgentDashboardContent({
  agent,
  bookings: initialBookings,
  pointsData: initialPointsData,
}: AgentDashboardContentProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBookingCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Calculate quick stats from bookings
  const pendingBookings = initialBookings.filter((b) => b.verification_status === 'pending').length;
  const approvedBookings = initialBookings.filter(
    (b) => b.verification_status === 'approved'
  ).length;
  const totalBookings = initialBookings.length;
  const thisMonthBookings = initialBookings.filter((b) => {
    const bookingDate = new Date(b.arrival_date);
    const now = new Date();
    return (
      bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {agent.first_name} {agent.last_name}
          </h1>
          <p className="text-muted-foreground">
            {agent.agencies ? (
              <>
                Representing {agent.agencies.name} • {agent.agencies.city}, {agent.agencies.country}
              </>
            ) : (
              'Agent Dashboard'
            )}
          </p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Hotel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">{thisMonthBookings} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedBookings}</div>
            <p className="text-xs text-muted-foreground">Points earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {initialPointsData.availablePoints}
            </div>
            <p className="text-xs text-muted-foreground">Ready to redeem</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="new-booking" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Log Booking
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <AgentBookingsList
                agentId={agent.id}
                refreshTrigger={refreshTrigger}
                initialBookings={initialBookings}
              />
            </TabsContent>

            <TabsContent value="new-booking" className="space-y-4">
              <AgentBookingForm agentId={agent.id} onBookingCreated={handleBookingCreated} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Points & Progress */}
        <div className="space-y-6">
          <AgentPointsProgress
            agentId={agent.id}
            refreshTrigger={refreshTrigger}
            initialPointsData={initialPointsData}
          />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Account Status</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Earned</span>
                <span className="font-medium">{initialPointsData.totalEarned} points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-medium">
                  {totalBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
