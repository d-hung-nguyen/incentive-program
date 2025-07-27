import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const userType = formData.get('user_type') as 'admin' | 'regional' | 'agent' | 'resort';
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error('Signup error:', error);
    redirect('/auth/signup?error=signup_failed');
  }

  redirect('/auth/signup?success=check_email');
}
