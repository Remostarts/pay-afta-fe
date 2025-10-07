'use client';

import { useParams } from 'next/navigation';
import React, { useState, useRef, useEffect, useCallback } from 'react';
// COMMENTED OUT: API Query imports
// import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { useChat } from '@/context/ChatProvider';
import { Chat, Message } from '@/types/chat.type';
import { toast } from '@/components/ui/use-toast';
import { useChats } from '@/context/ChatListProvider';
import { useSocket } from '@/context/socketProvider';
import { useGeneral } from '@/context/generalProvider';
// import { TChatMessage } from '@/types/chats.validation';
// import SkeletonMessageLoader from './SkeletonMessageLoader';
import Header from './Header';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
// import { mockChats, mockMessages } from '@/lib/data/chat-mock-data';

// COMMENTED OUT: API fetch function
/*
type ChatData = Chat;
type QueryKey = [string, string | undefined, string | undefined];

const fetchChatById = async ({ queryKey }: QueryFunctionContext<QueryKey>): Promise<ChatData> => {
  const [, chatId, accessToken] = queryKey;

  if (!chatId || !accessToken) {
    throw new Error('Missing chatId or accessToken');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/get-by-id/${chatId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Error fetching chat with ID ${chatId}`);
  }

  const data = await response.json();
  return data?.data;
};
*/

export default function ChatUI() {
  const params = useParams();
  const chatId = params.id as string;
  const { session } = useChats();

  // USE CHAT PROVIDER INSTEAD OF API
  const { chats, setCurrentChat, updateMessage, addMessage } = useChat();
  const chat = chats.find((c) => c.id === chatId);

  const { socket } = useSocket();
  const { setChatId, setLawyerId, setClientId, setAmount } = useGeneral();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [, setSelectedFile] = useState<File | null>(null);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const uploadingRef = useRef(false);
  const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const audioChunksRef = useRef<Blob[]>([]);
  const [uploadingMessage, setUploadingMessage] = useState<Message | null>(null);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastScrollHeightRef = useRef<number>(0);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [isRead, setIsRead] = useState(true);
  const [isChatDisabled, setIsChatDisabled] = useState(false);

  // COMMENTED OUT: API Query
  /*
  const {
    data: chat = {} as ChatData,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ['chat', chatId, session?.accessToken], queryFn: fetchChatById });
  */

  // No loading state needed with mock data
  const isLoading = false;

  console.log('🌼 🔥🔥 ChatUI 🔥🔥 chat🌼', chat);

  // COMMENTED OUT: Chat metadata setup
  /*
  useEffect(() => {
    if (chat?.id) {
      setChatId(chat?.id);
      setLawyerId(chat.participants.find((p) => p?.lawyer?.id)?.id as string);
      setClientId(chat.participants.find((p) => !p?.lawyer?.id)?.id as string);
      setAmount(chat?.service?.minimumPrice as number);
      setLawService(chat?.service?.title);
      setClientEmail(chat.participants.find((p) => !p?.lawyer?.id)?.email as string);
      const invoice = chat?.messages?.find((m) => m.type === 'invoice');
      if (invoice) setInvoiceId(invoice.id);
      else setInvoiceId('');
    }

    if (chat?.status === 'active') {
      setChatIsDisabled(false);
    } else if (chat?.status === 'completed' || chat?.status === 'canceled') {
      setChatIsDisabled(true);
    }
  }, [chat]);
  */

  // Scroll to bottom function
  const scrollToBottom = useCallback(
    (force: boolean = false) => {
      if (!scrollAreaRef.current) return;

      const scrollElement = scrollAreaRef.current;
      const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
      const isNearBottom = maxScroll - scrollElement.scrollTop <= 100;

      if (force || isNearBottom || shouldAutoScroll) {
        requestAnimationFrame(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: force ? 'auto' : 'smooth',
          });
        });
      }
    },
    [shouldAutoScroll]
  );

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const maxScroll = element.scrollHeight - element.clientHeight;
    const isNearBottom = maxScroll - element.scrollTop <= 100;
    setShouldAutoScroll(isNearBottom);
  }, []);

  // Monitor content changes and scroll
  useEffect(() => {
    if (!scrollAreaRef.current) return;

    const scrollElement = scrollAreaRef.current;
    const currentScrollHeight = scrollElement.scrollHeight;

    if (currentScrollHeight !== lastScrollHeightRef.current) {
      scrollToBottom(true);
      lastScrollHeightRef.current = currentScrollHeight;
    }
  }, [chat?.messages, uploadingMessage, scrollToBottom]);

  // COMMENTED OUT: Socket listener for receive_response
  /*
  useEffect(() => {
    if (socket) {
      const handleReceiveResponse = (message: unknown) => {
        console.log('🌼 🔥🔥 receive_response 🔥🔥 message🌼', message);
        refetch();
      };

      socket.on('receive_response', handleReceiveResponse);

      return () => {
        socket.off('receive_response');
      };
    }
  }, [socket, refetch]);
  */

  // COMMENTED OUT: Socket listener for messageSent
  /*
  useEffect(() => {
    if (socket) {
      const handleMessageSent = (message: unknown) => {
        console.log('🌼 🔥🔥 messageSend 🔥🔥 message🌼', message);
        refetch();
      };
      socket.on('messageSent', handleMessageSent);

      return () => {
        socket.off('messageSent');
      };
    }
  }, [socket, refetch]);
  */

  // COMMENTED OUT: Socket listener for typing status
  /*
  useEffect(() => {
    if (socket) {
      const handleTyping = ({
        chatId: id,
        receiverEmail,
      }: {
        chatId: string;
        receiverEmail: string;
      }) => {
        console.log('🌼 🔥🔥 typing message 🔥🔥 message🌼', {
          id,
          receiverEmail,
        });
        if (id === chatId) setIsTyping(true);
      };
      socket.on('receive_start_typing', handleTyping);

      return () => {
        socket.off('receive_start_typing');
      };
    }
  }, [socket, refetch]);
  */

  // COMMENTED OUT: Socket listener for stop typing
  /*
  useEffect(() => {
    if (socket) {
      const handleTyping = ({
        chatId: id,
        receiverEmail,
      }: {
        chatId: string;
        receiverEmail: string;
      }) => {
        console.log('🌼 🔥🔥 typing message 🔥🔥 message🌼', {
          id,
          receiverEmail,
        });
        if (id === chatId) setIsTyping(false);
      };
      socket.on('receive_stop_typing', handleTyping);

      return () => {
        socket.off('receive_stop_typing');
      };
    }
  }, [socket, refetch]);
  */

  // COMMENTED OUT: Socket listener for message read
  /*
  useEffect(() => {
    if (socket) {
      const handleTyping = ({
        chatId: id,
        receiverEmail,
      }: {
        chatId: string;
        receiverEmail: string;
      }) => {
        console.log('🌼 🔥🔥 typing message 🔥🔥 message🌼', {
          id,
          receiverEmail,
        });
        if (id === chatId) refetch();
      };
      socket.on('receive_message_read', handleTyping);

      return () => {
        socket.off('receive_message_read');
      };
    }
  }, [socket, refetch, chatId]);
  */

  // Set current chat
  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
      scrollToBottom();
    }

    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };
  }, [chatId, setCurrentChat, mediaRecorder, scrollToBottom]);

  // Set message status
  useEffect(() => {
    if (chat?.messages?.length) {
      const lastMessage = chat?.messages[chat?.messages?.length - 1];
      if (lastMessage.status !== 'read') setIsRead(false);
    }
  }, [chat?.messages]);

  // Handle send message - USES CHAT PROVIDER CONTEXT
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || !chatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      status: 'sent',
      senderId: session?.id || '1',
    };

    // Add message to context - THIS UPDATES THE UI
    addMessage(chatId, newMessage);

    // COMMENTED OUT: Socket emit for sending message
    /*
    socket?.emit('send_message', {
      chatId,
      message: newMessage,
    });
    */

    setInputMessage('');
    setIsTyping(false);
    scrollToBottom();

    // Simulate status updates
    setTimeout(() => {
      const updatedMessage = { ...newMessage, status: 'delivered' as const };
      updateMessage(chatId, updatedMessage);
    }, 1000);

    setTimeout(() => {
      const readMessage = { ...newMessage, status: 'read' as const };
      updateMessage(chatId, readMessage);
    }, 2000);
  }, [inputMessage, chatId, session?.id, addMessage, updateMessage, scrollToBottom]);

  // Log file details
  const logFileDetails = useCallback((file: File) => {
    console.log('File Upload Details:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      lastModified: new Date(file.lastModified).toLocaleString(),
    });
  }, []);

  // Add file message - USES CHAT PROVIDER CONTEXT
  const addFileMessage = useCallback(
    (file: File, fileUrl: string) => {
      if (!chatId) return;

      logFileDetails(file);

      const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const fileType = file.type.includes('pdf')
        ? 'pdf'
        : file.type.includes('audio')
          ? 'audio'
          : file.type.includes('video')
            ? 'video'
            : file.type.includes('image')
              ? 'image'
              : 'text';

      const newMessage: Message = {
        id: Date.now().toString(),
        type: fileType,
        fileName: file.name,
        fileSize,
        fileUrl,
        senderId: session?.id || '1',
        pages: fileType === 'pdf' ? 1 : undefined,
        duration: fileType === 'audio' ? '0:30' : undefined,
        audioUrl: fileType === 'audio' ? fileUrl : undefined,
        status: 'sent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
      };

      // Add message to context - THIS UPDATES THE UI
      addMessage(chatId, newMessage);

      // COMMENTED OUT: API call to upload file
      /*
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: session?.accessToken,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('File uploaded:', data);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
      */

      scrollToBottom();

      // Simulate status updates
      setTimeout(() => {
        const deliveredMessage = { ...newMessage, status: 'delivered' as const };
        updateMessage(chatId, deliveredMessage);
      }, 1000);

      setTimeout(() => {
        const readMessage = { ...newMessage, status: 'read' as const };
        updateMessage(chatId, readMessage);
      }, 2000);
    },
    [chatId, logFileDetails, session?.id, addMessage, updateMessage, scrollToBottom]
  );

  // Handle file select
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || uploadingRef.current) return;

      const MAX_FILE_SIZE = 50 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: 'File too large',
          description: 'Please select a file smaller than 50MB',
          variant: 'destructive',
        });
        return;
      }

      uploadingRef.current = true;
      setIsUploading(true);

      // Create temporary message for loading state
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        type: file.type.includes('image')
          ? 'image'
          : file.type.includes('video')
            ? 'video'
            : file.type.includes('audio')
              ? 'audio'
              : 'pdf',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        senderId: session?.id || '1',
        status: 'sending',
      };

      setUploadingMessage(tempMessage);
      setSelectedFile(file);

      // Simulate upload delay
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(file);
        addFileMessage(file, fileUrl);

        uploadingRef.current = false;
        setIsUploading(false);
        setUploadingMessage(null);
        setSelectedFile(null);
      }, 1500);
    },
    [session?.id, addFileMessage]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // COMMENTED OUT: Socket emit for typing
    /*
    const data: { chatId: string; receiverEmail: string } = {
      chatId,
      receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
    };
    socket?.emit('start_typing', data);
    */

    if (typingTimeoutRef.current !== undefined) {
      clearTimeout(typingTimeoutRef.current);
    }

    // COMMENTED OUT: Socket emit for stop typing
    /*
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('stop_typing', data);
    }, 1000);
    */
  };

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const file = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
        console.log('🌼 🔥🔥 startRecording 🔥🔥 file🌼', file);

        const fileUrl = URL.createObjectURL(audioBlob);
        addFileMessage(file, fileUrl);

        audioChunksRef.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
    }
  }, [addFileMessage]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => track.stop());
      setMediaRecorder(null);
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  // Handle audio play/pause
  const handleAudioPlayPause = useCallback((messageId: string) => {
    setCurrentlyPlayingAudio((current) => (current === messageId ? null : messageId));
  }, []);

  // COMMENTED OUT: Update message status API
  /*
  const handleUpdateMessageStatus = async () => {
    if (isRead) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/update-status/${chatId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.accessToken,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Error updating message status for chat ${chatId}`);
    }
    setIsRead(true);
    const data: { chatId: string; receiverEmail: string } = {
      chatId,
      receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
    };
    socket?.emit('message_read', data);
  };
  */

  // If no chat selected
  if (!chatId) {
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <Image
          src="/assets/dashboard/Chats/empty-chat.svg"
          alt="no-chats"
          width={139}
          height={108.14}
        />
        <p className="text-md font-inter text-gray-300">Tap a chat to preview</p>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-screen flex-1 flex-col overflow-hidden bg-white">
      {/* Header */}
      {chat && (
        <div className="shrink-0">
          <Header chat={chat} />
        </div>
      )}

      {/* Messages area */}
      <div
        className="relative grow overflow-y-auto p-2 md:px-4"
        ref={scrollAreaRef}
        style={{
          maxHeight: 'calc(100vh - 200px)',
        }}
        onScroll={handleScroll}
      >
        <div className="min-h-full">
          {!chat || chat?.messages?.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-8">
              <p className="text-center text-sm text-gray-500">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            <MessageList
              messages={chat?.messages ?? []}
              currentlyPlayingAudio={currentlyPlayingAudio}
              onAudioPlayPause={handleAudioPlayPause}
              session={session}
              uploadingMessage={uploadingMessage}
            />
          )}

          {/* Typing indicators */}
          <div className="space-y-2">
            {remoteTyping && <TypingIndicator position="left" />}
            {isTyping && <TypingIndicator position="left" />}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative shrink-0">
        <ChatInput
          inputMessage={inputMessage}
          isDisabled={isChatDisabled}
          isUploading={isUploading}
          isRecording={isRecording}
          onMessageChange={handleInputChange}
          onSendMessage={handleSendMessage}
          onFileSelect={handleFileSelect}
          onToggleRecording={toggleRecording}
        />
      </div>
    </div>
  );
}
