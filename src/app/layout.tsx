import '../styles/globals.css';
// import { FormProvider } from 'react-hook-form';

import { getServerSession } from 'next-auth';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Inter, Playfair } from 'next/font/google';

import { TChildrenProps } from '@/types';
import Providers from '@/context/Providers';
import { authOptions } from '@/lib/AuthOptions';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const playfair = Playfair({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    template: 'PayAfta – %s',
    default: 'PayAfta',
  },
  description: '',
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function RootLayout({ children }: TChildrenProps) {
  const session = (await getServerSession(authOptions)) as any;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${(inter.variable, playfair.variable)}  `}>
        {/* <FormProvider> */}
        <Providers session={session}>
          <div>{children}</div>
          <Toaster
            richColors
            closeButton
            duration={3000}
            position="bottom-right"
            className="font-inter"
            toastOptions={{
              className: 'my-custom-toast',
            }}
          />
        </Providers>
        {/* </FormProvider> */}
      </body>
    </html>
  );
}
