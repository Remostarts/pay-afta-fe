'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

import { Chat, Message } from '@/types/chat.type';

interface ChatContextType {
  chats: Chat[];
  currentChat: string | null;
  setCurrentChat: (chatId: string) => void;
  updateMessage: (chatId: string, message: Message) => void;
  addMessage: (chatId: string, message: Message) => void;
  addNewChat: (chat: Chat) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const isUpdatingRef = useRef(false);

  const addNewChat = useCallback((chat: Chat) => {
    setChats((prevChats) => [...prevChats, chat]);
  }, []);

  const updateMessage = useCallback((chatId: string, updatedMessage: Message) => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    setChats((prevChats) => {
      const newChats = prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            ),
          };
        }
        return chat;
      });

      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);

      return newChats;
    });
  }, []);

  const addMessage = useCallback((chatId: string, newMessage: Message) => {
    console.log('🌼 🔥🔥 addMessage 🔥🔥 newMessage🌼', newMessage);

    console.log('add message called');
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 0);

        return chat;
      });
    });
  }, []);

  const handleSetCurrentChat = useCallback((chatId: string) => {
    setCurrentChat(chatId);
  }, []);

  const value = {
    chats,
    currentChat,
    setCurrentChat: handleSetCurrentChat,
    updateMessage,
    addMessage,
    addNewChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
