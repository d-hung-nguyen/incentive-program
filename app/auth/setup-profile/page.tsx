import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
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

// Add this export to force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function SetupProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  async function setupProfile(formData: FormData) {
    'use server';

    const supabase = createClient();
    const userType = formData.get('user_type') as string;
    const firstName = formData.get('first_name') as string;
    const lastName = formData.get('last_name') as string;
    const phone = formData.get('phone') as string;

    const { error } = await supabase.from('user_profiles').upsert({
      id: user.id,
      user_type: userType,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
    });

    if (error) {
      console.error('Error setting up profile:', error);
      return;
    }

    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={setupProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" name="first_name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" name="last_name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_type">User Type</Label>
              <Select name="user_type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Travel Agent</SelectItem>
                  <SelectItem value="regional">Regional Manager</SelectItem>
                  <SelectItem value="resort">Resort Manager</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
