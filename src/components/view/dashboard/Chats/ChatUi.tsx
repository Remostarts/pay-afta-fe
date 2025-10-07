'use client';

import { useParams } from 'next/navigation';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { useChat } from '@/context/ChatProvider';
import { Chat, Message } from '@/types/chat.type';
import { toast } from '@/components/ui/use-toast';
import { useChats } from '@/context/ChatListProvider';
import { useSocket } from '@/context/socketProvider';
import { useGeneral } from '@/context/generalProvider';
import { TChatMessage } from '@/types/chats.validation';
import SkeletonMessageLoader from './SkeletonMessageLoader';
import Header from './Header';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { mockChats, mockMessages } from '@/lib/data/chat-mock-data';

// Define the data type returned by your API
type ChatData = Chat; // Replace with your actual data type if known

// Define the query key type
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
  return data?.data; // Ensure you return the correct data type
};

export default function ChatUI() {
  const params = useParams();
  const chatId = params.id as string;
  const { session } = useChats();
  const { setCurrentChat, updateMessage, addMessage } = useChat();
  const { socket } = useSocket();
  const { setChatId, setLawyerId, setClientId, setAmount } = useGeneral();
  // console.log('🌼 🔥🔥 ChatUI 🔥🔥 socket🌼', socket);

  // const chat = chats.find((c) => c.id === chatId);
  // const [chat, setChat] = useState<Chat | null>(null);

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

  // Use mock data instead of API call
  // const chat = mockChats.find((c) => c.id === chatId) || mockChats[0];

  const {
    data: chat = {} as ChatData,
    /* error,

    isFetching, */
    isLoading,
    refetch,
  } = useQuery({ queryKey: ['chat', chatId, session?.accessToken], queryFn: fetchChatById });
  console.log('🌼 🔥🔥 ChatUI 🔥🔥 chat🌼', chat);

  // useEffect(() => {
  //   if (chat?.id) {
  //     setChatId(chat?.id);
  //     setLawyerId(chat.participants.find((p) => p?.lawyer?.id)?.id as string);
  //     setClientId(chat.participants.find((p) => !p?.lawyer?.id)?.id as string);
  //     setAmount(chat?.service?.minimumPrice as number);
  //     setLawService(chat?.service?.title);
  //     setClientEmail(chat.participants.find((p) => !p?.lawyer?.id)?.email as string);
  //     const invoice = chat?.messages?.find((m) => m.type === 'invoice');
  //     if (invoice) setInvoiceId(invoice.id);
  //     else setInvoiceId('');
  //   }

  //   if (chat?.status === 'active') {
  //     setChatIsDisabled(false);
  //   } else if (chat?.status === 'completed' || chat?.status === 'canceled') {
  //     setChatIsDisabled(true);
  //   }
  // }, [chat]);

  // for downloading the chat by the admin

  // const isAdmin = session?.role === 'lawyer'; // Adjust based on your user role structure

  // const handleDownloadChat = () => {
  //   if (!chat) {
  //     Toast.error('Chat data not available.');
  //     return;
  //   }

  //   const blob = new Blob([JSON.stringify(chat, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `chat_${chatId}.json`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   Toast.success('Chat downloaded successfully.');
  // };

  // function to scroll to bottom
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

  // Handle scroll events to determine auto-scroll behavior
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const maxScroll = element.scrollHeight - element.clientHeight;
    const isNearBottom = maxScroll - element.scrollTop <= 100;
    setShouldAutoScroll(isNearBottom);
  }, []);

  // Monitor content changes and scroll accordingly
  useEffect(() => {
    if (!scrollAreaRef.current) return;

    const scrollElement = scrollAreaRef.current;
    const currentScrollHeight = scrollElement.scrollHeight;

    if (currentScrollHeight !== lastScrollHeightRef.current) {
      scrollToBottom(true);
      lastScrollHeightRef.current = currentScrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.messages, uploadingMessage]);

  useEffect(() => {
    if (socket) {
      // Add event listeners
      const handleReceiveResponse = (message: unknown) => {
        console.log('🌼 🔥🔥 receive_response 🔥🔥 message🌼', message);
        refetch();
      };

      socket.on('receive_response', handleReceiveResponse);

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('receive_response');
      };
    }
  }, [socket, refetch]);

  // Depend on socket so it re-runs only when socket is updated
  useEffect(() => {
    if (socket) {
      const handleMessageSent = (message: unknown) => {
        console.log('🌼 🔥🔥 messageSend 🔥🔥 message🌼', message);
        refetch();
      };
      socket.on('messageSent', handleMessageSent);

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('messageSent');
      };
    }
  }, [socket, refetch]);

  // // receive typing status
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

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('receive_start_typing');
      };
    }
  }, [socket, refetch]);

  // // receive typing stop status
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

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('receive_stop_typing');
      };
    }
  }, [socket, refetch]);

  // // receive message read status
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

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('receive_message_read');
      };
    }
  }, [socket, refetch, chatId]);

  // getting the current chat through there id
  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
      scrollToBottom();
    }

    return () => {
      // clearing the upload interval after successfully uploading the file
      if (uploadIntervalRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearInterval(uploadIntervalRef.current);
      }
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, setCurrentChat, mediaRecorder]);

  // set message status to read
  useEffect(() => {
    if (chat?.messages?.length) {
      const lastMessage = chat?.messages[chat?.messages?.length - 1];
      if (lastMessage.status !== 'read') setIsRead(false);
    }
  }, [chat?.messages, chat?.messages?.length]);

  // function to handle the send messages
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim()) return;

    // Use mock message instead of API call
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      status: 'sent',
      senderId: session?.id,
    };

    // Add to mock messages
    const updatedMessages = [...(mockMessages[chatId] || []), newMessage];
    mockMessages[chatId] = updatedMessages;

    // Update chat with new messages
    const updatedChat = { ...chat, messages: updatedMessages };
    // In a real app, you would update the context/state here
    // setCurrentChat(updatedChat);

    setInputMessage('');
    setIsTyping(false);
    scrollToBottom();
  }, [inputMessage, chatId, chat, session?.id, scrollToBottom]);

  // function to log out the files in the console log
  const logFileDetails = useCallback((file: File) => {
    console.log('File Upload Details:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      lastModified: new Date(file.lastModified).toLocaleString(),
    });
  }, []);

  // function for adding or uploading file messages
  const addFileMessage = useCallback(
    (file: File, fileUrl: string) => {
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
        senderId: session?.id,
        pages: fileType === 'pdf' ? 1 : undefined,
        duration: fileType === 'audio' ? '0:30' : undefined,
        audioUrl: fileType === 'audio' ? fileUrl : undefined,
        status: 'sent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
      };

      // Add to mock messages
      const updatedMessages = [...(mockMessages[chatId] || []), newMessage];
      mockMessages[chatId] = updatedMessages;

      // Update chat with new messages
      const updatedChat = { ...chat, messages: updatedMessages };
      // In a real app, you would update the context/state here
      // setCurrentChat(updatedChat);

      scrollToBottom();

      // Simulate status updates
      setTimeout(() => {
        const deliveredMessage = { ...newMessage, status: 'delivered' as const };
        const updatedMessagesDelivered = updatedMessages.map((m) =>
          m.id === newMessage.id ? deliveredMessage : m
        );
        mockMessages[chatId] = updatedMessagesDelivered;
        // Update chat with new messages
        // setCurrentChat({ ...chat, messages: updatedMessagesDelivered });
      }, 1000);

      setTimeout(() => {
        const readMessage = { ...newMessage, status: 'read' as const };
        const updatedMessagesRead = updatedMessages.map((m) =>
          m.id === newMessage.id ? readMessage : m
        );
        mockMessages[chatId] = updatedMessagesRead;
        // Update chat with new messages
        // setCurrentChat({ ...chat, messages: updatedMessagesRead });
      }, 2000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatId, logFileDetails, session.id, chat]
  );

  // function for simulating file uploads
  // const simulateFileUpload = useCallback(
  //   (file: File) => {
  //     setIsUploading(true);
  //     setUploadProgress(0);

  //     uploadIntervalRef.current = setInterval(() => {
  //       setUploadProgress((prev) => {
  //         if (prev >= 100) {
  //           if (uploadIntervalRef.current) {
  //             clearInterval(uploadIntervalRef.current);
  //           }
  //           setIsUploading(false);
  //           const fileUrl = URL.createObjectURL(file);
  //           addFileMessage(file, fileUrl);
  //           setSelectedFile(null);
  //           uploadingRef.current = false;
  //           return 0;
  //         }
  //         return prev + 10;
  //       });
  //     }, 300);
  //   },
  //   [addFileMessage]
  // );

  // function to handle file selection
  // const handleFileSelect = useCallback(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = event.target.files?.[0];
  //     console.log('🌼 🔥🔥 ChatUI 🔥🔥 file🌼', file);

  //     if (!file || uploadingRef.current) return;

  //     const MAX_FILE_SIZE = 50 * 1024 * 1024;
  //     if (file.size > MAX_FILE_SIZE) {
  //       toast({
  //         title: 'File too large',
  //         description: 'Please select a file smaller than 50MB',
  //         variant: 'destructive',
  //       });
  //       return;
  //     }

  //     uploadingRef.current = true;
  //     setSelectedFile(file);
  //     simulateFileUpload(file);

  //     // Prepare FormData
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('metadata', JSON.stringify({ key1: 'value1', key2: 'value2' }));

  //     try {
  //       const response = await fetch('/api/upload', {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       if (response.ok) {
  //         const result = await response.json();
  //         toast({
  //           title: 'Upload Successful',
  //           description: `File uploaded successfully: ${result.fileName}`,
  //           variant: 'success',
  //         });
  //       } else {
  //         toast({
  //           title: 'Upload Failed',
  //           description: 'There was an issue uploading your file. Please try again.',
  //           variant: 'destructive',
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error uploading file:', error);
  //       toast({
  //         title: 'Error',
  //         description: 'An unexpected error occurred while uploading the file.',
  //         variant: 'destructive',
  //       });
  //     } finally {
  //       uploadingRef.current = false;
  //     }
  //   },
  //   [simulateFileUpload]
  // );

  // function to handle file select
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
        senderId: session.id,
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

  // function for handling chat input filed messages
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    // const data: { chatId: string; receiverEmail: string } = {
    //   chatId,
    //   receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
    // };
    // socket?.emit('start_typing', data);
    if (typingTimeoutRef.current !== undefined) {
      clearTimeout(typingTimeoutRef.current);
    }
    // typingTimeoutRef.current = setTimeout(() => {
    //   socket?.emit('stop_typing', data);
    // }, 1000);
  };

  // function for speech recognition to start recording
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

        // Simulate upload
        const fileUrl = URL.createObjectURL(audioBlob);
        addFileMessage(file, fileUrl);

        audioChunksRef.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // toast({
      //   title: 'Recording started',
      //   description: 'Click the microphone again to stop recording',
      // });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // toast({
      //   title: 'Error',
      //   description: 'Could not access microphone',
      //   variant: 'destructive',
      // });
    }
  }, [addFileMessage]);

  // function for speech recognition to stop recoding
  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      const tracks = mediaRecorder.stream.getTracks();
      tracks.forEach((track) => track.stop());
      setMediaRecorder(null);
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  // function for speech recognition for toggling the mic
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  // function for handling the play/pause button in the audio
  const handleAudioPlayPause = useCallback((messageId: string) => {
    setCurrentlyPlayingAudio((current) => (current === messageId ? null : messageId));
  }, []);

  // const handleUpdateMessageStatus = async () => {
  //   if (isRead) return;
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/update-status/${chatId}`,
  //     {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: session?.accessToken,
  //       },
  //       cache: 'no-store',
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`Error updating message status for chat ${chatId}`);
  //   }
  //   setIsRead(true);
  //   const data: { chatId: string; receiverEmail: string } = {
  //     chatId,
  //     receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
  //   };
  //   socket?.emit('message_read', data);
  // };

  // if no chats are there this will be rendered
  if (!chatId) {
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <Image
          src="/assets/dashboard/business-dashboard/chats/empty-chat.svg"
          alt="no-chats"
          width={139}
          height={108.14}
        />
        <p className="text-md font-inter text-gray-300">Tap a chat to preview</p>
      </div>
    );
  }

  return (
    <>
      <div
        // role="button"
        // tabIndex={0}
        // onClick={handleUpdateMessageStatus}
        // onKeyDown={(e) => {
        //   if (e.key === 'Enter' || e.key === ' ') {
        //     handleUpdateMessageStatus();
        //   }
        // }}
        className="flex h-full max-h-screen flex-1 flex-col overflow-hidden bg-white"
      >
        {/* {isLoading ? (
          <SkeletonMessageLoader />
        ) : ( */}
        <>
          {/* Fixed height header */}
          {chat && (
            <div className="shrink-0">
              <Header chat={chat} />
              {/* Download Chat Button for Admin */}
              {/* {isAdmin && (
                  <button
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={handleDownloadChat}
                  >
                    Download Chat
                  </button>
                )} */}
            </div>
          )}

          {/* Scrollable messages area with flex-grow */}
          <div
            className="relative grow overflow-y-auto p-2 md:px-4"
            ref={scrollAreaRef}
            style={{
              maxHeight: 'calc(100vh - 200px)',
            }}
            onScroll={handleScroll}
          >
            {/* <OrStrike text="Today" /> */}

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

              {/* Scroll target */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed height input */}
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
        </>
        {/* )} */}
      </div>
    </>
  );
}
