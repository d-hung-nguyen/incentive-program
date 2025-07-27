import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import DashboardHeaderProfileDropdown from './DashboardHeaderProfileDropdown';

async function getUserProfile(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select(
      `
      *,
      organizations (
        name,
        type
      )
    `
    )
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export default async function DashboardHeader() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const userProfile = user ? await getUserProfile(user.id) : null;

  // Get user type badge info
  const getUserTypeBadge = () => {
    if (!userProfile) return { text: 'Dev Mode', color: 'outline' };

    switch (userProfile.user_type) {
      case 'admin':
        return { text: 'Admin Access', color: 'destructive' };
      case 'regional':
        return { text: 'Regional Manager', color: 'default' };
      case 'agent':
        return { text: 'Agent Access', color: 'secondary' };
      case 'resort':
        return { text: 'Resort Manager', color: 'default' };
      default:
        return { text: 'User Access', color: 'outline' };
    }
  };

  const badgeInfo = getUserTypeBadge();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-2 flex items-center space-x-2" href="/dashboard">
            <Image src="/logo.png" alt="logo" width={25} height={25} />
          </Link>
          <Badge variant={badgeInfo.color as any} className="mr-2">
            {badgeInfo.text}
          </Badge>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <p className="text-sm text-muted-foreground">
              {user && userProfile
                ? `Welcome back, ${userProfile.first_name || user.email}`
                : user
                  ? `Welcome, ${user.email}`
                  : 'Development Mode'}
            </p>
          </div>
          <nav className="flex items-center">
            <DashboardHeaderProfileDropdown />
          </nav>
        </div>
      </div>
    </header>
  );
}
