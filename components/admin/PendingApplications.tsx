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
  DialogFooter,
} from '@/components/ui/dialog';
import { Check, X, Edit, Trash2 } from 'lucide-react';

interface Application {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  agencies: {
    name: string;
    city: string;
    country: string;
  };
}

// Add this to your admin dashboard for booking verification
interface BookingVerification {
  id: string;
  guest_name: string;
  hotels: { hotel_name: string };
  room_type_points: { room_type_name: string };
  reward_points: number;
  verification_status: string;
  agents: { first_name: string; last_name: string };
}

export default function PendingApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<Partial<Application>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApprove = async (application: Application) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          notes,
        }),
      });

      if (response.ok) {
        await fetchApplications();
        setNotes('');
        alert('Agent approved and credentials sent!');
      }
    } catch (error) {
      console.error('Error approving application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (applicationId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/applications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, notes }),
      });

      if (response.ok) {
        await fetchApplications();
        setNotes('');
        alert('Application rejected');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/applications/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: selectedApp?.id,
          ...editData,
        }),
      });

      if (response.ok) {
        await fetchApplications();
        setEditDialog(false);
        setEditData({});
      }
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchApplications();
        alert('Application deleted');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    } finally {
      setLoading(false);
    }
  };

  // const verifyBooking = async (bookingId: string, status: 'approved' | 'rejected', notes?: string) => {
  //   try {
  //     const response = await fetch('/api/admin/bookings/verify', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         bookingId,
  //         status,
  //         notes,
  //       }),
  //     });

  //     if (response.ok) {
  //       alert('Booking verification updated');
  //       // Refresh the list
  //     }
  //   } catch (error) {
  //     console.error('Error verifying booking:', error);
  //   }
  // };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Agent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {app.first_name} {app.last_name}
                      </h3>
                      <Badge
                        variant={
                          app.status === 'pending'
                            ? 'outline'
                            : app.status === 'approved'
                              ? 'default'
                              : 'destructive'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Email: {app.email} | Phone: {app.telephone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agency: {app.agencies.name} - {app.agencies.city}, {app.agencies.country}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApp(app);
                          setEditData(app);
                          setEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(app)}
                        disabled={loading}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(app.id)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(app.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {app.status === 'pending' && (
                  <div className="mt-4">
                    <Label htmlFor={`notes-${app.id}`}>Admin Notes</Label>
                    <Textarea
                      id={`notes-${app.id}`}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes for this application..."
                      className="mt-1"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-first-name">First Name</Label>
                <Input
                  id="edit-first-name"
                  value={editData.first_name || ''}
                  onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-last-name">Last Name</Label>
                <Input
                  id="edit-last-name"
                  value={editData.last_name || ''}
                  onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-telephone">Phone</Label>
              <Input
                id="edit-telephone"
                value={editData.telephone || ''}
                onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
