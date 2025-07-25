import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { userRoles } from './constants/shared';

const { ADMIN, USER } = userRoles;
console.log(process.env.BACKEND_URL);

const hybridRoutes = [
  '/',
  '/sign-in',
  '/sign-in/admin',
  '/sign-up',
  '/sign-up/admin',
  '/sign-up/verification',
];

const rolesRedirect: Record<string, string> = {
  user: `${process.env.FRONTEND_URL}/dashboard`,
  admin: `${process.env.FRONTEND_URL}/admin-dashboard`,
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (!token) {
    if (hybridRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }

  const role = token?.role as string;

  if (!role) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }

  // Redirect authenticated users away from `/sign-in` to their dashboard
  if (pathname === '/' || pathname.startsWith('/sign-in')) {
    if (role in rolesRedirect) {
      return NextResponse.redirect(rolesRedirect[role]);
    }
  }

  // Handle onboarding route protection
  const onboardingStatus = token?.onboardingStatus as boolean;
  if (pathname === '/onboarding' && onboardingStatus) {
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }

  if (
    (role === ADMIN && pathname.startsWith('/admin-dashboard')) ||
    (role === USER && pathname.startsWith('/dashboard'))
  ) {
    return NextResponse.next();
  }

  return NextResponse.redirect(`${process.env.FRONTEND_URL}`);
}

export const config = {
  matcher: [
    '/',
    '/sign-in/:page*',
    '/sign-up/:page*',
    '/onboarding',
    '/dashboard/:page*',
    '/admin-dashboard/:page*',
  ],
};
