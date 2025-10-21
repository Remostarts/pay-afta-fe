'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Chat } from '@/types/chat.type';
import { TUser } from '@/types/general.type';
import { getErrorMessage } from '@/lib/responseError';
import { useSocket } from './socketProvider';

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
  loadUserData: () => Promise<void>;
  onboardingStatus: boolean | null;
  session: any;
  isChatDisabled: boolean;
  setChatIsDisabled: (isChatDisabled: boolean) => void;
  loadingUser: boolean;
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export function GeneralProvider({ children, session }: { children: ReactNode; session: any }) {
  const { socket } = useSocket();

  const [invoiceId, setInvoiceId] = useState<string>('');
  const [chatData, setChatData] = useState<ChatData>({} as ChatData);
  const [chatId, setChatId] = useState<string>('');
  const [lawyerId, setLawyerId] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const [user, setUser] = useState<TUser | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<boolean | null>(null);
  const [isChatDisabled, setChatIsDisabled] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load full user profile
  const loadUserData = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      setLoadingUser(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-user-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.accessToken,
        },
        cache: 'no-store',
        next: { revalidate: 0 },
      });

      const data = await response.json();

      if (data?.data) {
        setUser({ ...data.data });
        setOnboardingStatus(data.data?.profile?.onBoardingStatus ?? null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('❌ loadUserData error:', getErrorMessage(error));
    } finally {
      setLoadingUser(false);
    }
  }, [session?.accessToken]);

  // Initial load
  useEffect(() => {
    if (session?.accessToken) loadUserData();
  }, [session?.accessToken, loadUserData]);

  // Listen to generic user updates
  useEffect(() => {
    if (!socket) return;

    const handleUserUpdate = (updatedFields: Partial<TUser>) => {
      setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
    };

    socket.on('user:update', handleUserUpdate);

    return () => {
      socket.off('user:update', handleUserUpdate);
    };
  }, [socket]);

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
        onboardingStatus,
        session,
        isChatDisabled,
        setChatIsDisabled,
        loadingUser,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

export function useGeneral() {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error('useGeneral must be used within a GeneralProvider');
  }
  return context;
}
