'use client';
import { toast } from '@/components/ui/use-toast';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children, session }: { children: ReactNode; session: any }) {
  const socketRef = useRef<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) return;

    const socketClient = io(`${process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL}`);

    socketRef.current = socketClient;

    socketClient.on('connect', () => {
      console.log('✅ Socket connected:', socketClient.id);
      socketClient.emit('connect_user', session.user.email);
      setSocketReady(true); // Notify consumers the socket is ready
       toast({
        title: 'Connection Status',
        description: 'You are online',
        variant: 'success',
      });
    });

    socketClient.on('connect_error', (err) => {
      console.error('❌ Socket connect error:', err);
    });

    socketClient.on('disconnect', (reason) => {
      console.log('⚠️ Socket disconnected:', reason);
    });

    return () => {
      socketClient.disconnect();
      socketRef.current = null;
      setSocketReady(false);
      console.log('🔌 Socket cleaned up on unmount or email change');
      toast({
        title: 'Connection Status',
        description: 'Connection lost',
        variant: 'destructive',
      });
    };
  }, [session?.user?.email]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
