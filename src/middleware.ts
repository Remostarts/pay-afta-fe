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
  // '/sign-in/lawyer',
  '/sign-up',
  '/sign-up/admin',

  // '/sign-up/lawyer/lawyers',
  // '/sign-up/lawyer/law-student',
];
const rolesRedirect: Record<string, unknown> = {
  user: `${process.env.FRONTEND_URL}/dashboard`,

  admin: `${process.env.FRONTEND_URL}/admin`,
};
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  console.log('🌼 🔥🔥 middleware 🔥🔥 token🌼', token);
  const { pathname } = request.nextUrl;
  if (!token) {
    if (hybridRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }

  const role = token?.role as string;
  console.log('🌼 🔥🔥 middleware 🔥🔥 role🌼', role);

  if (
    (role === ADMIN && pathname.startsWith('/admin')) ||
    (role === USER && pathname.startsWith('/dashboard'))
  ) {
    return NextResponse.next();
  }

  if (pathname === '/' && role && role in rolesRedirect) {
    return NextResponse.redirect(rolesRedirect[role] as string);
  }

  // NextResponse.rewrite(request.
  NextResponse.rewrite(`${process.env.FRONTEND_URL}/sign-in`);

  return NextResponse.redirect(`${process.env.FRONTEND_URL}`);
}

// See "Matching Paths" below to learn more

export const config = {
  matcher: [
    // hybrid routes
    '/',
    '/sign-in/:page',
    '/sign-up/:page',
    // business routes
    '/dashboard/:page*',

    // lawyer routes
    // '/lawyer/:page',

    // admin routes
    '/admin/:page*',
  ],
};
