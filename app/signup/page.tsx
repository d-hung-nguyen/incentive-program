'use client';

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { signupUser, signInWithGoogle, signInWithGithub } from '@/app/auth/actions';
import Link from 'next/link';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

export default function Signup() {
  const [state, formAction] = useFormState(signupUser, { message: '' });

  return (
    <div className="hero-gradient flex min-h-screen items-center justify-center">
      <Card className="feature-card w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center py-4">
            <Link href="/">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </Link>
          </div>

          <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
          <CardDescription className="text-center">Join TravelIncentive today!</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <select
                id="userType"
                name="userType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                required
              >
                <option value="">Select user type</option>
                <option value="agent">Agent</option>
                <option value="regional">Regional Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {state?.message && <div className="text-sm text-red-600">{state.message}</div>}

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={signInWithGoogle}>
              Google
            </Button>
            <Button variant="outline" onClick={signInWithGithub}>
              GitHub
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
