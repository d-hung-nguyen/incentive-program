import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import DashboardHeaderProfileDropdown from './DashboardHeaderProfileDropdown';

export default async function DashboardHeader() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-2 flex items-center space-x-2" href="/dashboard">
            <Image src="/logo.png" alt="logo" width={25} height={25} />
          </Link>
          <Badge variant="outline" className="mr-2">
            {user ? 'Free Plan' : 'Dev Mode'}
          </Badge>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <p className="text-sm text-muted-foreground">
              {user ? `Welcome back, ${user.email}` : 'Development Mode'}
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
