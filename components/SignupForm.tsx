'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState, useFormStatus } from 'react-dom';
import { signupUser } from '@/app/auth/actions';

export default function SignupForm() {
  const initialState = {
    message: '',
  };

  const [state, formAction] = useFormState(signupUser, initialState);

  return (
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

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}
