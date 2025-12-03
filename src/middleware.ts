import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { userRoles } from './constants/shared';

const { ADMIN, USER, LOGISTIC } = userRoles;
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
  logistic: `${process.env.FRONTEND_URL}/logistic-dashboard`,
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (!token) {
    if (hybridRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/sign-in`, request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);

    return NextResponse.redirect(redirectUrl);
  }

  const role = token?.role as string;

  if (!role) {
    const redirectUrl = new URL(`${process.env.FRONTEND_URL}/sign-in`, request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from `/sign-in` to their dashboard
  if (pathname === '/' || pathname.startsWith('/sign-in')) {
    if (role in rolesRedirect) {
      return NextResponse.redirect(rolesRedirect[role]);
    }
  }

  if (
    (role === ADMIN && pathname.startsWith('/admin-dashboard')) ||
    (role === USER && pathname.startsWith('/dashboard')) ||
    (role === LOGISTIC && pathname.startsWith('/logistic-dashboard'))
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
    '/dashboard/:page*',
    '/admin-dashboard/:page*',
    '/logistic-dashboard/:page*',
  ],
};
