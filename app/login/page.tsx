'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginUser, signInWithGoogle, signInWithGithub } from '@/app/auth/actions';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const [state, formAction] = useFormState(loginUser, { message: '' });

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <Card className="w-full max-w-md feature-card">
        <CardHeader className="space-y-1">
          <div className="flex justify-center py-4">
            <Link href="/">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </Link>
          </div>

          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Welcome back to TravelIncentive
          </CardDescription>
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
                placeholder="Enter your password"
                required
              />
            </div>
            {state.message && <div className="text-sm text-red-600">{state.message}</div>}
            <Button type="submit" className="w-full cta-button">
              Sign In
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
            <form action={signInWithGoogle}>
              <Button variant="outline" type="submit" className="w-full">
                Google
              </Button>
            </form>
            <form action={signInWithGithub}>
              <Button variant="outline" type="submit" className="w-full">
                GitHub
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline hover:text-primary">
              Sign up
            </Link>
          </p>
          <div className="text-center text-sm">
            <Link href="/forgot-password" className="text-orange-600 hover:text-orange-700 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
