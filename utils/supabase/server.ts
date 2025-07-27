import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  try {
    const cookieStore = cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            try {
              return cookieStore.get(name)?.value;
            } catch (error) {
              console.error('Error getting cookie:', error);
              return undefined;
            }
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Silently fail in Server Components
              console.log('Cookie set failed (this is normal in Server Components)');
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Silently fail in Server Components
              console.log('Cookie remove failed (this is normal in Server Components)');
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
};
