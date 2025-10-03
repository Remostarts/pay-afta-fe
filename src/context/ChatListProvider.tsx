/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { useSocket } from './socketProvider';

// import { getErrorMessage } from '@/lib/responseError';
import { Chat } from '@/types/chat.type';

type OnlineUsers = {
  [email: string]: string;
};

interface ChatListContextType {
  chats: Chat[];
  addChat: (chat: Omit<Chat, 'id'>) => string;
  session: any;
  // loadChats: () => Promise<void>;
  onlineUsers: OnlineUsers;
}

const ChatListContext = createContext<ChatListContextType | undefined>(undefined);

// const initialChats = [
//   { id: '1', title: 'Company Registration', status: 'completed', user: 'Anthony V', online: true },
//   { id: '2', title: 'Trade Mark Registration', status: 'active', user: 'Anthony V', online: false },
//   { id: '3', title: 'Founders Agreement', status: 'completed', user: 'Anthony V', online: false },
//   { id: '4', title: 'Employment Agreement', status: 'active', user: 'Anthony V', online: true },
//   {
//     id: '5',
//     title: 'Non-Disclosure Agreement',
//     status: 'completed',
//     user: 'Anthony V',
//     online: false,
//   },
// ] as const;

const initialChats = [
  {
    id: '1',
    name: 'Company Registration', // Add name (used in rendering)
    title: 'Company Registration', // Keep title if needed elsewhere
    status: 'completed',
    user: 'Anthony V',
    online: true,
    participants: [
      // Add dummy participants to avoid errors
      { id: 'user1', email: 'user@example.com', fullName: 'Anthony V' },
      { id: 'receiver1', email: 'receiver@example.com', fullName: 'Receiver' },
    ],
    messages: [], // Add empty messages (or populate with dummies below)
  },
  {
    id: '2',
    name: 'Trade Mark Registration',
    title: 'Trade Mark Registration',
    status: 'active',
    user: 'Anthony V',
    online: false,
    participants: [
      { id: 'user1', email: 'user@example.com', fullName: 'Anthony V' },
      { id: 'receiver2', email: 'receiver@example.com', fullName: 'Receiver' },
    ],
    messages: [],
  },
  {
    id: '3',
    name: 'Founders Agreement',
    title: 'Founders Agreement',
    status: 'completed',
    user: 'Anthony V',
    online: false,
    participants: [
      { id: 'user1', email: 'user@example.com', fullName: 'Anthony V' },
      { id: 'receiver3', email: 'receiver@example.com', fullName: 'Receiver' },
    ],
    messages: [],
  },
  {
    id: '4',
    name: 'Employment Agreement',
    title: 'Employment Agreement',
    status: 'active',
    user: 'Anthony V',
    online: true,
    participants: [
      { id: 'user1', email: 'user@example.com', fullName: 'Anthony V' },
      { id: 'receiver4', email: 'receiver@example.com', fullName: 'Receiver' },
    ],
    messages: [],
  },
];

export function ChatListProvider({ children, session }: { children: ReactNode; session: any }) {
  console.log('🌼 🔥🔥 ChatListProvider 🔥🔥 session🌼', session);

  // const [chats, setChats] = useState<Chat[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({});
  const { socket } = useSocket();
  const [chats, setChats] = useState<Chat[]>(() => {
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem('chats');
      return savedChats ? JSON.parse(savedChats) : initialChats;
    }
    return initialChats;
  });

  console.log(chats);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  // const loadChats = useCallback(async () => {
  //   try {
  //     const response = await fetch(`${process.env.BACKEND_URL}/chat/get-by-participant`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: session?.accessToken,
  //       },
  //       cache: 'no-store',
  //     });

  //     const data = await response.json();
  //     console.log('🌼 🔥🔥 loadChats 🔥🔥 data🌼', data?.data);
  //     setChats(data?.data);
  //   } catch (error) {
  //     console.log('🌼 🔥🔥 partialSignup 🔥🔥 error🌼', error);

  //     getErrorMessage(error);
  //   }
  // }, [session?.accessToken]);

  // useEffect(() => {
  //   loadChats();
  // }, [session, socket, loadChats]);

  // useEffect(() => {
  //   if (socket) {
  //     const handleReceiveOnlineUser = (data: OnlineUsers) => {
  //       console.log('🌼 🔥🔥 handleReceiveOnlineUser 🔥🔥 data🌼', data);
  //       setOnlineUsers(data);
  //     };

  //     socket.on('update_online_users', handleReceiveOnlineUser);

  //     // Cleanup event listeners when component unmounts or socket changes
  //     return () => {
  //       socket.off('update_online_users');
  //     };
  //   }
  // }, [socket]);

  // useEffect(() => {
  //   if (socket) {
  //     const handleReceiveChatCreated = () => {
  //       // console.log('🌼 🔥🔥 messageSend 🔥🔥 message🌼', message);
  //       loadChats();
  //     };
  //     socket.on('receive_chat_created', handleReceiveChatCreated);

  //     // Cleanup event listeners when component unmounts or socket changes
  //     return () => {
  //       socket.off('receive_chat_created');
  //     };
  //   }
  // }, [socket, loadChats]);

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
    <ChatListContext.Provider value={{ chats, addChat, session, onlineUsers }}>
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
