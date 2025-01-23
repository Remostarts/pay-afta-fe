import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { jwtHelpers } from '@/helpers/jwtHelpers';
import { getNewAccessToken } from '@/lib/actions/getNewAccessToken';

console.log(process.env.BACKEND_URL);

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'pay-afta-backend',
      type: 'credentials',

      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log(process.env.BACKEND_URL);
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          const { data } = await res.json();
          const verifiedToken: any = jwtHelpers.verifyToken(
            data?.accessToken,
            process.env.JWT_SECRET!
          );
          // console.log(data, "auth option")
          if (res.ok && data) {
            return {
              ...data,
              ...verifiedToken,
            };
          }
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('🌼 🔥🔥 session 🔥🔥 tokenbefore🌼', token);

      const verifiedToken = jwtHelpers.verifyToken(token?.accessToken, process.env.JWT_SECRET!);

      if (!verifiedToken) {
        const { data } = await getNewAccessToken(token?.refreshToken);
        token.accessToken = data?.accessToken;
      }
      console.log('🌼 🔥🔥 session 🔥🔥 tokenafter🌼', token);

      return {
        ...session,
        ...token,
      };
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/sign-in',
    signOut: '/sign-in',
  },
};
