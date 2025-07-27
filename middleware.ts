import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple logging for debugging
  console.log('Middleware hit:', request.nextUrl.pathname);

  // Just pass through for now
  const response = NextResponse.next();

  return response;
}

export const config = {
  matcher: [
    // Only match specific paths to avoid issues
    '/dashboard/:path*',
    '/api/:path*',
  ],
};
