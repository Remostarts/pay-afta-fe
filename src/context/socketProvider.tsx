/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { toast } from '@/components/ui/use-toast';

// Define the context type
interface SocketContextType {
  socket: Socket | null;
}

// Create the Socket Context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider Component
export function SocketProvider({ children, session }: { children: ReactNode; session: any }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize the socket connection
    const socketClient = io(`${process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL}`); // Replace with your backend URL
    setSocket(socketClient); // Update state with the initialized socket

    console.log('Socket connected:', socketClient);

    // Event listener for successful connection
    socketClient.on('connect', () => {
      console.log('Socket connected:', socketClient.id); // Log socket ID when connected
      toast({
        title: 'Connection Status',
        description: 'You are online',
        variant: 'success',
      });
    });

    // Event listener for connection errors
    socketClient.on('connect_error', (err) => {
      console.error('socket connection error:', err); // Log error if connection fails
    });

    // Event listener for connection timeout
    socketClient.on('connect_timeout', (timeout) => {
      console.error('socket connection timeout:', timeout); // Log timeout error
    });

    // Event listener for disconnection
    socketClient.on('disconnect', (reason) => {
      console.log('Socket disconnected, reason:', reason); // Log disconnect reason
      toast({
        title: 'Connection Status',
        description: 'Connection lost',
        variant: 'destructive',
      });
    });

    socketClient.emit('connect_user', session?.user?.email);

    // Cleanup on component unmount
    return () => {
      socketClient.disconnect();
      console.log('Socket disconnected');
      toast({
        title: 'Connection Status',
        description: 'Connection lost',
        variant: 'destructive',
      });
    };
  }, [session?.user?.email]); // Re-run if the session email changes

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}

// Custom hook for consuming the context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
