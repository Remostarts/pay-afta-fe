import type { Metadata } from 'next';
import '../styles/globals.css';
import { Inter, Playfair } from 'next/font/google';
import { Toaster } from 'sonner';
// import { FormProvider } from 'react-hook-form';

import { TChildrenProps } from '@/types';
import Providers from '@/context/Providers';

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
    template: 'Pay Afta – %s',
    default: 'Pay Afta',
  },
  description: '',
  icons: {
    icon: './favicon.svg',
  },
};

export default function RootLayout({ children }: TChildrenProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${(inter.variable, playfair.variable)}  `}>
        {/* <FormProvider> */}
        <Providers>
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
