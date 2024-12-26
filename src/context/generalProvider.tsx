'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { set } from 'date-fns';

import { Chat } from '@/types/chat.type';

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
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export function GeneralProvider({ children }: { children: ReactNode }) {
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
