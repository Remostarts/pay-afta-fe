/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { useSocket } from './socketProvider';
import { Chat } from '@/types/chat.type';
// import { getErrorMessage } from '@/lib/responseError';
import { mockChats } from '@/lib/data/chat-mock-data';

type OnlineUsers = {
  [email: string]: string;
};

interface ChatListContextType {
  chats: Chat[];
  addChat: (chat: Omit<Chat, 'id'>) => string;
  session: any;
  loadChats: () => Promise<void>;
  onlineUsers: OnlineUsers;
  isLoading: boolean;
}

const ChatListContext = createContext<ChatListContextType | undefined>(undefined);

export function ChatListProvider({ children, session }: { children: ReactNode; session: any }) {
  console.log('🌼 🔥🔥 ChatListProvider 🔥🔥 session🌼', session);

  // Use mock data instead of empty array
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using mock data
  const { socket } = useSocket();

  console.log('🌼 🔥🔥 ChatListProvider 🔥🔥 chats🌼', chats);

  // COMMENTED OUT: Load chats from API
  const loadChats = useCallback(async () => {
    console.log('🌼 🔥🔥 loadChats (MOCK DATA) 🔥🔥 🌼');

    setIsLoading(true);

    // COMMENTED OUT: API call
    /*
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/get-by-participant`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.accessToken || 'mock-token-123',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🌼 🔥🔥 loadChats 🔥🔥 data🌼', data?.data);

      setChats(data?.data || []);
    } catch (error) {
      console.log('🌼 🔥🔥 loadChats 🔥🔥 error🌼', error);
      getErrorMessage(error);

      // Set empty array on error so UI doesn't break
      setChats([]);
    } finally {
      setIsLoading(false);
    }
    */

    // Using mock data instead
    setTimeout(() => {
      setChats(mockChats);
      setIsLoading(false);
      console.log('🌼 🔥🔥 loadChats 🔥🔥 Mock data loaded🌼', mockChats);
    }, 500); // Simulate network delay
  }, [session?.accessToken]);

  // Load chats on mount and when session/socket changes
  useEffect(() => {
    if (session) {
      loadChats();
    }
  }, [session, loadChats]);

  // COMMENTED OUT: Listen for online users updates
  useEffect(() => {
    if (socket) {
      const handleReceiveOnlineUser = (data: OnlineUsers) => {
        console.log('🌼 🔥🔥 handleReceiveOnlineUser 🔥🔥 data🌼', data);
        setOnlineUsers(data);
      };

      // COMMENTED OUT: Socket listener
      // socket.on('update_online_users', handleReceiveOnlineUser);

      // Mock online users
      setOnlineUsers({
        'user1@example.com': 'online',
        'user2@example.com': 'online',
      });

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        // socket.off('update_online_users');
      };
    }
  }, [socket]);

  // COMMENTED OUT: Listen for new chat created events
  useEffect(() => {
    if (socket) {
      const handleReceiveChatCreated = () => {
        console.log('🌼 🔥🔥 receive_chat_created (MOCK) 🔥🔥 🌼');
        // loadChats(); // Commented out
      };

      // COMMENTED OUT: Socket listener
      // socket.on('receive_chat_created', handleReceiveChatCreated);

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        // socket.off('receive_chat_created');
      };
    }
  }, [socket, loadChats]);

  // Add a new chat locally (no backend sync)
  const addChat = useCallback((chat: Omit<Chat, 'id'>) => {
    const newId = Date.now().toString();
    const newChat = { ...chat, id: newId, messages: [] };

    setChats((prevChats) => [...prevChats, newChat]);

    // COMMENTED OUT: Send to backend
    /*
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: session?.accessToken,
      },
      body: JSON.stringify(chat),
    }).then(() => {
      loadChats(); // Reload to get server-generated ID
    }).catch(error => {
      console.error('Error creating chat:', error);
    });
    */

    return newId;
  }, []);

  return (
    <ChatListContext.Provider
      value={{ chats, addChat, session, onlineUsers, loadChats, isLoading }}
    >
      {children}
    </ChatListContext.Provider>
  );
}

export function useChats() {
  const context = useContext(ChatListContext);
  if (context === undefined) {
    throw new Error('useChats must be used within a ChatListProvider');
  }
  return context;
}
