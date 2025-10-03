'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';

import { OtpProvider } from './OtpProvider';
import { GeneralProvider } from './generalProvider';
import { ChatProvider } from './ChatProvider';
import { ChatListProvider } from './ChatListProvider';
import { SocketProvider } from './socketProvider';

import { Toaster } from '@/components/ui/toaster';
import { store } from '@/redux/store';
import { MessageNotificationProvider } from './MessageNotificationProvider';
import { DialogProvider } from '@/components/view/dashboard/shared/Dialog';

const Providers = ({ children, session }: { children: ReactNode; session: any }) => {
  const methods = useForm();

  return (
    <div>
      <Provider store={store}>
        <GeneralProvider session={session}>
          <SocketProvider session={session}>
            <ChatListProvider session={session}>
              <ChatProvider>
                <FormProvider {...methods}>
                  <DialogProvider>
                    <OtpProvider>
                      <MessageNotificationProvider>
                        <NextThemesProvider
                          attribute="class"
                          forcedTheme="light"
                          defaultTheme="light"
                          disableTransitionOnChange
                        >
                          {children}
                          <Toaster />
                        </NextThemesProvider>
                      </MessageNotificationProvider>
                    </OtpProvider>
                  </DialogProvider>
                </FormProvider>
              </ChatProvider>
            </ChatListProvider>
          </SocketProvider>
        </GeneralProvider>
      </Provider>
    </div>
  );
};

export default Providers;