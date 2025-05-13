'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { set } from 'date-fns';

import { Chat } from '@/types/chat.type';
import { TUser } from '@/types/general.type';
import { getErrorMessage } from '@/lib/responseError';

type ChatData = Chat;

interface GeneralContextType {
  invoiceId: string;
  setInvoiceId: (invoiceId: string) => void;
  chatData: ChatData;
  setChatData: (chatData: ChatData) => void;
  chatId: string;
  setChatId: (chatId: string) => void;
  lawyerId: string;
  setLawyerId: (lawyerId: string) => void;
  clientId: string;
  setClientId: (clientId: string) => void;
  amount: number;
  setAmount: (amount: number) => void;
  user: TUser | null;
  loadUserData: () => void;
  session: any;
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export function GeneralProvider({ children, session }: { children: ReactNode; session: any }) {
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [chatData, setChatData] = useState<ChatData>({} as ChatData);
  const [chatId, setChatId] = useState<string>('');
  console.log('🌼 🔥🔥 GeneralProvider 🔥🔥 chatId🌼', chatId);

  const [lawyerId, setLawyerId] = useState<string>('');
  console.log('🌼 🔥🔥 GeneralProvider 🔥🔥 lawyerId🌼', lawyerId);

  const [clientId, setClientId] = useState<string>('');
  console.log('🌼 🔥🔥 GeneralProvider 🔥🔥 clientId🌼', clientId);

  const [amount, setAmount] = useState<number>(0);
  console.log('🌼 🔥🔥 GeneralProvider 🔥🔥 amount🌼', amount);
  const [user, setUser] = useState<TUser | null>(null);
  console.log('🌼 🔥🔥 GeneralProvider 🔥🔥 user🌼', user);

  const loadUserData = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-user-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.accessToken,
        },
        cache: 'no-store',
      });

      const data = await response.json();
      setUser(data?.data);
    } catch (error) {
      getErrorMessage(error);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadUserData();
  }, [session, loadUserData]);

  return (
    <GeneralContext.Provider
      value={{
        invoiceId,
        setInvoiceId,
        chatData,
        setChatData,
        chatId,
        setChatId,
        lawyerId,
        setLawyerId,
        clientId,
        setClientId,
        amount,
        setAmount,
        user,
        loadUserData,
        session,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

export function useGeneral() {
  const context = useContext(GeneralContext);
  if (context === undefined) {
    throw new Error('useGeneral must be used within a GeneralProvider');
  }
  return context;
}
