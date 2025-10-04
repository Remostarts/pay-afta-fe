'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

import {
  MessageNotification,
  MessageNotificationContextType,
} from '@/types/messageNotification.type';

const MessageNotificationContext = createContext<MessageNotificationContextType | undefined>(
  undefined
);

export const useMessageNotification = () => {
  const context = useContext(MessageNotificationContext);

  if (context === undefined) {
    throw new Error('useMessageNotification must be used within a MessageNotificationProvider');
  }

  return context;
};

export function MessageNotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);

  const [activeNotification, setActiveNotification] = useState<MessageNotification | null>(null);

  // function to add notification message
  const addNotification = useCallback(
    (notification: Omit<MessageNotification, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>) => {
      console.log('🌼 🔥🔥 MessageNotificationProvider 🔥🔥 notification🌼', notification);

      const newNotification: MessageNotification = {
        ...notification as MessageNotification,
        // id: Date.now().toString(),
        // createdAt: new Date(),
        // updatedAt: new Date(),
        // isRead: false,
      };
      setNotifications((prevNotification) => [...prevNotification, newNotification]);
    },
    []
  );

  // function to remove notification message
  const removeNotification = useCallback((id: string) => {
    setNotifications((prevNotification) => prevNotification.filter((n) => n.id !== id));
  }, []);

  // function to mark notification message as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prevNotification) =>
      prevNotification.map((n) => (n.id === id ? { ...n, isRead: true, updatedAt: new Date() } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prevNotification) =>
      prevNotification.map((n) => ({ ...n, isRead: true, updatedAt: new Date() }))
    );
  }, []);

  return (
    <MessageNotificationContext.Provider
      value={{
        notifications,
        activeNotification,
        addNotification,
        removeNotification,
        setActiveNotification,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </MessageNotificationContext.Provider>
  );
}
