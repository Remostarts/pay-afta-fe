import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtHelpers } from '@/helpers/jwtHelpers';
import { getNewAccessToken } from '@/lib/actions/getNewAccessToken';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'pay-afta-backend',
      name: 'Credentials',
      type: 'credentials',

      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
            credentials: 'include',
          });

          const result = await res.json().catch(() => ({}));

          // If backend returns error (401/403/404 etc.)
          if (!res.ok) {
            throw new Error(result?.message || 'Login failed');
          }

          // Access token verify (optional)
          const verifiedToken: any = jwtHelpers.verifyToken(
            result?.data?.accessToken,
            process.env.JWT_SECRET!
          );

          // Return user info (required)
          return {
            ...result.data,
            ...verifiedToken,
          };
        } catch (error: any) {
          console.error('❌ authorize error:', error);
          // Pass readable message to frontend
          throw new Error(error?.message || 'Something went wrong');
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    async jwt({ token, user }) {
      // merge token & user
      return { ...token, ...user };
    },

    async session({ session, token }: { session: any; token: any }) {
      console.log('🌼 🔥 session 🔥 token before refresh 🌼', token);

      // Verify access token
      const verifiedToken = jwtHelpers.verifyToken(token?.accessToken, process.env.JWT_SECRET!);

      // Refresh if expired
      try {
        if (!verifiedToken) {
          const { data } = await getNewAccessToken(token?.refreshToken);
          token.accessToken = data?.accessToken;
        }
      } catch (err) {
        console.error('Token refresh failed', err);
      }

      console.log('🌼 🔥 session 🔥 token after refresh 🌼', token);

      return {
        ...session,
        ...token,
      };
    },
  },

  // Session
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },

  // JWT secret
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  //   App secret
  secret: process.env.NEXTAUTH_SECRET,

  // Pages
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-in',
  },
};
