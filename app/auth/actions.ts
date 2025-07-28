'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';

export async function loginUser(_currentState: { message: string }, formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate inputs
  if (!email || !password) {
    return { message: 'Email and password are required' };
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { message: error.message };
    }

    // Redirect after successful login
    redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'An unexpected error occurred' };
  }
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithGithub() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signupUser(_currentState: { message: string }, formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const userType = formData.get('userType') as string;

  // Validate inputs
  if (!email || !password || !userType) {
    return { message: 'All fields are required' };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
        },
      },
    });

    if (error) {
      return { message: error.message };
    }

    if (data.user && !data.user.email_confirmed_at) {
      return { message: 'Please check your email to confirm your account' };
    }

    // Redirect after successful signup
    redirect('/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    return { message: 'An unexpected error occurred' };
  }
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { message: 'Email is required' };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/reset-password`,
  });

  if (error) {
    return { message: 'Error sending reset email' };
  }

  return { message: 'Password reset email sent! Check your inbox.' };
}

export async function resetPassword(_currentState: { message: string }, formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;

  if (!email) {
    return { message: 'Email is required' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${PUBLIC_URL}/auth/reset-password`,
    });

    if (error) {
      return { message: error.message };
    }

    return { message: 'Password reset email sent! Please check your inbox.' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { message: 'An unexpected error occurred' };
  }
}
