/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { useSocket } from './socketProvider';

import { getErrorMessage } from '@/lib/responseError';
import { Chat } from '@/types/chat.type';

type OnlineUsers = {
  [email: string]: string;
};

interface ChatListContextType {
  chats: Chat[];
  addChat: (chat: Omit<Chat, 'id'>) => string;
  session: any;
  loadChats: () => Promise<void>;
  onlineUsers: OnlineUsers;
}

const ChatListContext = createContext<ChatListContextType | undefined>(undefined);

export function ChatListProvider({ children, session }: { children: ReactNode; session: any }) {
  console.log('🌼 🔥🔥 ChatListProvider 🔥🔥 session🌼', session);

  const [chats, setChats] = useState<Chat[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});
  const { socket } = useSocket();

  const loadChats = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/chat/get-by-participant`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.accessToken,
        },
        cache: 'no-store',
      });

      const data = await response.json();
      console.log('🌼 🔥🔥 loadChats 🔥🔥 data🌼', data?.data);
      setChats(data?.data);
    } catch (error) {
      console.log('🌼 🔥🔥 partialSignup 🔥🔥 error🌼', error);

      getErrorMessage(error);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    loadChats();
  }, [session, socket, loadChats]);

  useEffect(() => {
    if (socket) {
      const handleReceiveOnlineUser = (data: OnlineUsers) => {
        console.log('🌼 🔥🔥 handleReceiveOnlineUser 🔥🔥 data🌼', data);
        setOnlineUsers(data);
      };

      socket.on('update_online_users', handleReceiveOnlineUser);

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('update_online_users');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      const handleReceiveChatCreated = () => {
        // console.log('🌼 🔥🔥 messageSend 🔥🔥 message🌼', message);
        loadChats();
      };
      socket.on('receive_chat_created', handleReceiveChatCreated);

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('receive_chat_created');
      };
    }
  }, [socket, loadChats]);

  // useEffect(() => {
  //   localStorage.setItem('chats', JSON.stringify(chats));
  // }, [chats]);

  const addChat = (chat: Omit<Chat, 'id'>) => {
    const newId = Date.now().toString(); // Using timestamp for unique IDs
    const newChat = { ...chat, id: newId };
    setChats((prevChats) => [...prevChats, newChat]);
    return newId;
  };

  return (
    <ChatListContext.Provider value={{ chats, addChat, session, loadChats, onlineUsers }}>
      {children}
    </ChatListContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatListContext);
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatProvider');
  }
  return context;
}
