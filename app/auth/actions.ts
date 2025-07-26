'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const PUBLIC_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';

export async function loginUser(currentState: { message: string }, formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
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

export async function signup(currentState: { message: string }, formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${PUBLIC_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Check your email to continue sign in process',
  };
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

export async function resetPassword(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    return { message: 'Both password fields are required' };
  }

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match' };
  }

  if (password.length < 6) {
    return { message: 'Password must be at least 6 characters' };
  }

  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { message: 'Error updating password' };
  }

  redirect('/login?message=Password updated successfully');
}
