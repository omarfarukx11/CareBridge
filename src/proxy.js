import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request) {
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  if (session?.email) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);

  loginUrl.searchParams.set('callbackUrl', pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/dashboard/:path*', '/my-bookings'],
};