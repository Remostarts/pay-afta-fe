'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

import { OtpProvider } from './OtpProvider';
import { GeneralProvider } from './generalProvider';
import { ChatProvider } from './ChatProvider';

import { Toaster } from '@/components/ui/toaster';
import { store } from '@/redux/store';

const Providers = ({ children, session }: { children: ReactNode; session: any }) => {
  const methods = useForm();

  return (
    <div>
      <Provider store={store}>
        <GeneralProvider session={session}>
          <ChatProvider>
            <FormProvider {...methods}>
              <OtpProvider>
                <NextThemesProvider
                  attribute="class"
                  forcedTheme="light"
                  defaultTheme="light"
                  disableTransitionOnChange
                >
                  {children}

                  <Toaster />
                </NextThemesProvider>
              </OtpProvider>
            </FormProvider>
          </ChatProvider>
        </GeneralProvider>
      </Provider>
    </div>
  );
};

export default Providers;
