// 'use client';

// import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
// import Image from 'next/image';
// import { useParams } from 'next/navigation';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// // import { toast as Toast } from 'sonner';

// import Header from './Header';
// import SkeletonMessageLoader from './SkeletonMessageLoader';
// import { TypingIndicator } from './TypingIndicator';
// // import { InvoiceDialog } from './Invoice/InvoiceDialog';

// import { toast } from '@/components/ui/use-toast';
// import { ChatInput } from '@/components/view/dashboard/Chats/ChatInput';
// import { MessageList } from '@/components/view/dashboard/Chats/MessageList';
// import { useChats } from '@/context/ChatListProvider';
// import { useChat } from '@/context/ChatProvider';
// import { Chat, Message } from '@/types/chat.type';
// // import { getErrorMessage } from '@/lib/responseError';
// import { useGeneral } from '@/context/generalProvider';
// import { useSocket } from '@/context/socketProvider';
// import { TChatMessage } from '@/lib/validations/chats.validation';
// // Define the data type returned by your API
// type ChatData = Chat; // Replace with your actual data type if known

// // Define the query key type
// type QueryKey = [string, string | undefined, string | undefined];

// const fetchChatById = async ({ queryKey }: QueryFunctionContext<QueryKey>): Promise<ChatData> => {
//   const [, chatId, accessToken] = queryKey;

//   if (!chatId || !accessToken) {
//     throw new Error('Missing chatId or accessToken');
//   }

//   const response = await fetch(`${process.env.BACKEND_URL}/chat/get-by-id/${chatId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: accessToken,
//     },
//     cache: 'no-store',
//   });

//   if (!response.ok) {
//     throw new Error(`Error fetching chat with ID ${chatId}`);
//   }

//   const data = await response.json();
//   return data?.data; // Ensure you return the correct data type
// };

// export default function ChatUI() {
//   const params = useParams();
//   const chatId = params.id as string;
//   const { session } = useChats();
//   const { setCurrentChat, updateMessage, addMessage } = useChat();
//   const { socket } = useSocket();
//   const { setChatId, setLawyerId, setClientId, setAmount } = useGeneral();
//   console.log('🌼 🔥🔥 ChatUI 🔥🔥 socket🌼', socket);

//   // const chat = chats.find((c) => c.id === chatId);
//   // const [chat, setChat] = useState<Chat | null>(null);

//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [, setSelectedFile] = useState<File | null>(null);
//   const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const uploadingRef = useRef(false);
//   const uploadIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const [uploadingMessage, setUploadingMessage] = useState<Message | null>(null);

//   const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

//   const lastScrollHeightRef = useRef<number>(0);

//   const [remoteTyping, setRemoteTyping] = useState(false);
//   const [isRead, setIsRead] = useState(true);

//   const {
//     data: chat = {} as ChatData,
//     /* error,
//     isFetching, */
//     isLoading,
//     refetch,
//   } = useQuery({ queryKey: ['chat', chatId, session?.accessToken], queryFn: fetchChatById });
//   console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww 🌼 🔥🔥 ChatUI 🔥🔥 chatData🌼', chat);

//   useEffect(() => {
//     if (chat.id) {
//       setChatId(chat.id);
//       // setLawyerId(chat.participants.find((p) => p?.lawyer?.id)?.id as string);
//       // setClientId(chat.participants.find((p) => !p?.lawyer?.id)?.id as string);
//       // setAmount(chat.participants.find((p) => p?.lawyer?.id)?.lawyer.fee as number);
//     }
//   }, [chat]);

//   // function to scroll to bottom
//   const scrollToBottom = useCallback(
//     (force: boolean = false) => {
//       if (!scrollAreaRef.current) return;

//       const scrollElement = scrollAreaRef.current;
//       const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
//       const isNearBottom = maxScroll - scrollElement.scrollTop <= 100;

//       if (force || isNearBottom || shouldAutoScroll) {
//         requestAnimationFrame(() => {
//           scrollElement.scrollTo({
//             top: scrollElement.scrollHeight,
//             behavior: force ? 'auto' : 'smooth',
//           });
//         });
//       }
//     },
//     [shouldAutoScroll]
//   );

//   // Handle scroll events to determine auto-scroll behavior
//   const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
//     const element = e.currentTarget;
//     const maxScroll = element.scrollHeight - element.clientHeight;
//     const isNearBottom = maxScroll - element.scrollTop <= 100;
//     setShouldAutoScroll(isNearBottom);
//   }, []);

//   // Monitor content changes and scroll accordingly
//   useEffect(() => {
//     if (!scrollAreaRef.current) return;

//     const scrollElement = scrollAreaRef.current;
//     const currentScrollHeight = scrollElement.scrollHeight;

//     if (currentScrollHeight !== lastScrollHeightRef.current) {
//       scrollToBottom(true);
//       lastScrollHeightRef.current = currentScrollHeight;
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chat?.messages, uploadingMessage]);

//   useEffect(() => {
//     if (socket) {
//       // Add event listeners
//       const handleReceiveResponse = (message: unknown) => {
//         console.log('🌼 🔥🔥 receive_response 🔥🔥 message🌼', message);
//         refetch();
//       };

//       socket.on('receive_response', handleReceiveResponse);

//       // Cleanup event listeners when component unmounts or socket changes
//       return () => {
//         socket.off('receive_response');
//       };
//     }
//   }, [socket, refetch]);

//   // Depend on socket so it re-runs only when socket is updated
//   useEffect(() => {
//     if (socket) {
//       const handleMessageSent = (message: unknown) => {
//         console.log('🌼 🔥🔥 messageSend 🔥🔥 message🌼', message);
//         refetch();
//       };
//       socket.on('messageSent', handleMessageSent);

//       // Cleanup event listeners when component unmounts or socket changes
//       return () => {
//         socket.off('messageSent');
//       };
//     }
//   }, [socket, refetch]);

//   // receive typing status
//   useEffect(() => {
//     if (socket) {
//       const handleTyping = ({
//         chatId: id,
//         receiverEmail,
//       }: {
//         chatId: string;
//         receiverEmail: string;
//       }) => {
//         console.log('🌼 🔥🔥 typing message 🔥🔥 message🌼', {
//           id,
//           receiverEmail,
//         });
//         if (id === chatId) setIsTyping(true);
//       };
//       socket.on('receive_start_typing', handleTyping);

//       // Cleanup event listeners when component unmounts or socket changes
//       return () => {
//         socket.off('receive_start_typing');
//       };
//     }
//   }, [socket, refetch]);

//   // receive typing stop status
//   useEffect(() => {
//     if (socket) {
//       const handleTyping = ({
//         chatId: id,
//         receiverEmail,
//       }: {
//         chatId: string;
//         receiverEmail: string;
//       }) => {
//         console.log('🌼 🔥🔥 typing message 🔥🔥 message🌼', {
//           id,
//           receiverEmail,
//         });
//         if (id === chatId) setIsTyping(false);
//       };
//       socket.on('receive_stop_typing', handleTyping);

//       // Cleanup event listeners when component unmounts or socket changes
//       return () => {
//         socket.off('receive_stop_typing');
//       };
//     }
//   }, [socket, refetch]);

//   // receive message read status
//   useEffect(() => {
//     if (socket) {
//       const handleTyping = ({
//         chatId: id,
//         receiverEmail,
//       }: {
//         chatId: string;
//         receiverEmail: string;
//       }) => {
//         console.log('🌼 🔥🔥 typing message 🔥🔥 message🌼', {
//           id,
//           receiverEmail,
//         });
//         if (id === chatId) refetch();
//       };
//       socket.on('receive_message_read', handleTyping);

//       // Cleanup event listeners when component unmounts or socket changes
//       return () => {
//         socket.off('receive_message_read');
//       };
//     }
//   }, [socket, refetch, chatId]);

//   // getting the current chat through there id
//   useEffect(() => {
//     if (chatId) {
//       setCurrentChat(chatId);
//       scrollToBottom();
//     }

//     return () => {
//       // clearing the upload interval after successfully uploading the file
//       if (uploadIntervalRef.current) {
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         clearInterval(uploadIntervalRef.current);
//       }
//       if (mediaRecorder) {
//         mediaRecorder.stop();
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [chatId, setCurrentChat, mediaRecorder]);

//   // set message status to read
//   useEffect(() => {
//     if (chat?.messages?.length) {
//       const lastMessage = chat.messages[chat?.messages?.length - 1];
//       if (lastMessage.status !== 'read') setIsRead(false);
//     }
//   }, [chat.messages, chat.messages?.length]);

//   // function to handle the send messages
//   const handleSendMessage = useCallback(() => {
//     if (!inputMessage.trim()) return;

//     const newMessage: TChatMessage = {
//       chatId,
//       receiverId: 'hello world',
//       // receiverId:  (chat?.participants.find((p) => p.id !== session.id)?.id as string),
//       senderId: session.id,
//       content: inputMessage,
//       type: 'text',
//       receiverEmail: 'hello world',
//       // receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
//     };
//     console.log('🌼 🔥🔥 handleSendMessage 🔥🔥 newMessage🌼', newMessage);

//     console.log('Socket instance:', socket);

//     socket?.emit('sendMessage', newMessage);

//     // addMessage(chatId, newMessage);
//     setInputMessage('');
//     setIsTyping(false);
//     scrollToBottom();

//     // setTimeout(() => updateMessage(chatId, { ...newMessage, status: 'delivered' }), 1000);
//     // setTimeout(() => updateMessage(chatId, { ...newMessage, status: 'read' }), 2000);
//   }, [inputMessage, chatId, chat?.participants, session.id, socket, scrollToBottom]);

//   // function to log out the files in the console log
//   const logFileDetails = useCallback((file: File) => {
//     console.log('File Upload Details:', {
//       name: file.name,
//       type: file.type,
//       size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
//       lastModified: new Date(file.lastModified).toLocaleString(),
//     });
//   }, []);

//   // function for adding or uploading file messages
//   const addFileMessage = useCallback(
//     (file: File, fileUrl: string) => {
//       logFileDetails(file);

//       const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
//       const fileType = file.type.includes('pdf')
//         ? 'pdf'
//         : file.type.includes('audio')
//           ? 'audio'
//           : file.type.includes('video')
//             ? 'video'
//             : file.type.includes('image')
//               ? 'image'
//               : 'text';

//       // const newMessage: Message = {
//       //   id: Date.now().toString(),
//       //   type: fileType,
//       //   fileName: file.name,
//       //   fileSize,
//       //   fileUrl,
//       //   senderId: session.id,
//       //   pages: fileType === 'pdf' ? 1 : undefined,
//       //   duration: fileType === 'audio' ? '0:30' : undefined,
//       //   audioUrl: fileType === 'audio' ? fileUrl : undefined,
//       //   status: 'sent',
//       // };

//       // addMessage(chatId, newMessage);
//       // scrollToBottom();

//       // setTimeout(() => updateMessage(chatId, { ...newMessage, status: 'delivered' }), 1000);
//       // setTimeout(() => updateMessage(chatId, { ...newMessage, status: 'read' }), 2000);
//     },
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [chatId, addMessage, updateMessage, logFileDetails, session.id]
//   );

//   // function for simulating file uploads
//   // const simulateFileUpload = useCallback(
//   //   (file: File) => {
//   //     setIsUploading(true);
//   //     setUploadProgress(0);

//   //     uploadIntervalRef.current = setInterval(() => {
//   //       setUploadProgress((prev) => {
//   //         if (prev >= 100) {
//   //           if (uploadIntervalRef.current) {
//   //             clearInterval(uploadIntervalRef.current);
//   //           }
//   //           setIsUploading(false);
//   //           const fileUrl = URL.createObjectURL(file);
//   //           addFileMessage(file, fileUrl);
//   //           setSelectedFile(null);
//   //           uploadingRef.current = false;
//   //           return 0;
//   //         }
//   //         return prev + 10;
//   //       });
//   //     }, 300);
//   //   },
//   //   [addFileMessage]
//   // );

//   // function to handle file selection
//   // const handleFileSelect = useCallback(
//   //   (event: React.ChangeEvent<HTMLInputElement>) => {
//   //     const file = event.target.files?.[0];
//   //     console.log('🌼 🔥🔥 ChatUI 🔥🔥 file🌼', file);

//   //     if (!file || uploadingRef.current) return;

//   //     const MAX_FILE_SIZE = 50 * 1024 * 1024;
//   //     if (file.size > MAX_FILE_SIZE) {
//   //       toast({
//   //         title: 'File too large',
//   //         description: 'Please select a file smaller than 50MB',
//   //         variant: 'destructive',
//   //       });
//   //       return;
//   //     }

//   //     uploadingRef.current = true;
//   //     setSelectedFile(file);
//   //     simulateFileUpload(file);

//   //     // Prepare FormData
//   //     const formData = new FormData();
//   //     formData.append('file', file);
//   //     formData.append('metadata', JSON.stringify({ key1: 'value1', key2: 'value2' }));

//   //     try {
//   //       const response = await fetch('/api/upload', {
//   //         method: 'POST',
//   //         body: formData,
//   //       });

//   //       if (response.ok) {
//   //         const result = await response.json();
//   //         toast({
//   //           title: 'Upload Successful',
//   //           description: `File uploaded successfully: ${result.fileName}`,
//   //           variant: 'success',
//   //         });
//   //       } else {
//   //         toast({
//   //           title: 'Upload Failed',
//   //           description: 'There was an issue uploading your file. Please try again.',
//   //           variant: 'destructive',
//   //         });
//   //       }
//   //     } catch (error) {
//   //       console.error('Error uploading file:', error);
//   //       toast({
//   //         title: 'Error',
//   //         description: 'An unexpected error occurred while uploading the file.',
//   //         variant: 'destructive',
//   //       });
//   //     } finally {
//   //       uploadingRef.current = false;
//   //     }
//   //   },
//   //   [simulateFileUpload]
//   // );

//   // function to handle file select
//   const handleFileSelect = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const file = event.target.files?.[0];
//       if (!file || uploadingRef.current) return;

//       const MAX_FILE_SIZE = 50 * 1024 * 1024;
//       if (file.size > MAX_FILE_SIZE) {
//         toast({
//           title: 'File too large',
//           description: 'Please select a file smaller than 50MB',
//           variant: 'destructive',
//         });
//         return;
//       }

//       uploadingRef.current = true;
//       setIsUploading(true);

//       // Create temporary message for loading state
//       // const tempMessage: Message = {
//       //   id: `temp-${Date.now()}`,
//       //   type: file.type.includes('image')
//       //     ? 'image'
//       //     : file.type.includes('video')
//       //       ? 'video'
//       //       : file.type.includes('audio')
//       //         ? 'audio'
//       //         : 'pdf',
//       //   fileName: file.name,
//       //   fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
//       //   senderId: session.id,
//       //   status: 'sending',
//       // };

//       // setUploadingMessage(tempMessage);
//       setSelectedFile(file);

//       // const data = {
//       //   chatId,
//       //   receiverId: chat?.participants.find((p) => p.id !== session?.id)?.id as string,
//       //   senderId: session?.id,
//       //   type: file.type.includes('image')
//       //     ? 'image'
//       //     : file.type.includes('video')
//       //       ? 'video'
//       //       : file.type.includes('audio')
//       //         ? 'audio'
//       //         : 'pdf',
//       // };

//       // const formData = new FormData();
//       // formData.append('media', file);
//       // formData.append('data', JSON.stringify(data));

//       // fetch(`${process.env.BACKEND_URL}/chat/upload-file`, {
//       //   method: 'POST',
//       //   headers: {
//       //     Authorization: session?.accessToken,
//       //   },
//       //   body: formData,
//       //   cache: 'no-store',
//       // })
//       //   .then(async (response) => {
//       //     if (response.ok) {
//       //       await response.json();
//       //       // toast({
//       //       //   title: 'Upload Successful',
//       //       //   description: `File uploaded successfully: ${result.fileName}`,
//       //       //   variant: 'success',
//       //       // });
//       //       socket?.emit('file_uploaded', {
//       //         receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
//       //       });
//       //       refetch();
//       //     } else {
//       //       // toast({
//       //       //   title: 'Upload Failed',
//       //       //   description: 'There was an issue uploading your file. Please try again.',
//       //       //   variant: 'destructive',
//       //       // });
//       //     }
//       //   })
//       //   .catch((error) => {
//       //     console.error('Error uploading file:', error);
//       //     // toast({
//       //     //   title: 'Error',
//       //     //   description: 'An unexpected error occurred while uploading the file.',
//       //     //   variant: 'destructive',
//       //     // });
//       //   })
//       //   .finally(() => {
//       //     uploadingRef.current = false;
//       //     setIsUploading(false);
//       //     setUploadingMessage(null);
//       //     setSelectedFile(null);
//       //   });
//     },
//     [chat, chatId, session?.id, refetch, session?.accessToken, socket]
//   );

//   // function for handling chat input filed messages
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputMessage(e.target.value);
//     // const data: { chatId: string; receiverEmail: string } = {
//     //   chatId,
//     //   receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
//     // };
//     // socket?.emit('start_typing', data);
//     // if (typingTimeoutRef.current !== undefined) {
//     //   clearTimeout(typingTimeoutRef.current);
//     // }
//     // typingTimeoutRef.current = setTimeout(() => {
//     //   socket?.emit('stop_typing', data);
//     // }, 1000);
//   };

//   // function for speech recognition to start recording
//   const startRecording = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data);
//         }
//       };

//       recorder.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//         const file = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
//         console.log('🌼 🔥🔥 startRecording 🔥🔥 file🌼', file);

//         // const data = {
//         //   chatId,
//         //   receiverId: chat?.participants.find((p) => p.id !== session?.id)?.id as string,
//         //   senderId: session?.id,
//         //   type: 'audio',
//         // };
//         // console.log('🌼 🔥🔥 startRecording 🔥🔥 data🌼', data);

//         // // Prepare FormData
//         // const formData = new FormData();
//         // formData.append('media', file);
//         // formData.append('data', JSON.stringify(data));

//         // fetch(`${process.env.BACKEND_URL}/chat/upload-file`, {
//         //   method: 'POST',
//         //   headers: {
//         //     Authorization: session?.accessToken,
//         //   },
//         //   body: formData,
//         //   cache: 'no-store',
//         // })
//         //   .then(async (response) => {
//         //     console.log('🌼 🔥🔥 .then 🔥🔥 response🌼', response);

//         //     if (response.ok) {
//         //       await response.json();
//         //       // toast({
//         //       //   title: 'Upload Successful',
//         //       //   description: `File uploaded successfully: ${result.fileName}`,
//         //       //   variant: 'success',
//         //       // });
//         //       socket?.emit('file_uploaded', {
//         //         receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
//         //       });
//         //       refetch();
//         //     } else {
//         //       // toast({
//         //       //   title: 'Upload Failed',
//         //       //   description: 'There was an issue uploading your file. Please try again.',
//         //       //   variant: 'destructive',
//         //       // });
//         //     }
//         //   })
//         //   .catch((error) => {
//         //     console.log('🌼 🔥🔥 handleFileSelect 🔥🔥 error🌼', error);

//         //     console.error('Error uploading file:', error);
//         //     // toast({
//         //     //   title: 'Error',
//         //     //   description: 'An unexpected error occurred while uploading the file.',
//         //     //   variant: 'destructive',
//         //     // });
//         //   })
//         //   .finally(() => {
//         //     uploadingRef.current = false;
//         //   });

//         // addFileMessage(file, URL.createObjectURL(audioBlob));
//         // audioChunksRef.current = [];
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setIsRecording(true);

//       // toast({
//       //   title: 'Recording started',
//       //   description: 'Click the microphone again to stop recording',
//       // });
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//       // toast({
//       //   title: 'Error',
//       //   description: 'Could not access microphone',
//       //   variant: 'destructive',
//       // });
//     }
//   }, [
//     addFileMessage,
//     chat?.participants,
//     chatId,
//     refetch,
//     session?.accessToken,
//     session.id,
//     socket,
//   ]);

//   // function for speech recognition to stop recoding
//   const stopRecording = useCallback(() => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       const tracks = mediaRecorder.stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       setMediaRecorder(null);
//       setIsRecording(false);
//     }
//   }, [mediaRecorder]);

//   // function for speech recognition for toggling the mic
//   const toggleRecording = useCallback(() => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   }, [isRecording, stopRecording, startRecording]);

//   // function for handling the play/pause button in the audio
//   const handleAudioPlayPause = useCallback((messageId: string) => {
//     setCurrentlyPlayingAudio((current) => (current === messageId ? null : messageId));
//   }, []);

//   const handleUpdateMessageStatus = async () => {
//     if (isRead) return;
//     const response = await fetch(`${process.env.BACKEND_URL}/chat/update-status/${chatId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: session?.accessToken,
//       },
//       cache: 'no-store',
//     });

//     if (!response.ok) {
//       throw new Error(`Error updating message status for chat ${chatId}`);
//     }
//     setIsRead(true);
//     // const data: { chatId: string; receiverEmail: string } = {
//     //   chatId,
//     //   receiverEmail: chat?.participants.find((p) => p.id !== session.id)?.email as string,
//     // };
//     // socket?.emit('message_read', data);
//   };

//   // if no chats are there this will be rendered
//   if (!chatId) {
//     return (
//       <div className="flex size-full flex-col items-center justify-center bg-white">
//         <Image
//           src="/assets/dashboard/business-dashboard/chats/empty-chat.svg"
//           alt="no-chats"
//           width={139}
//           height={108.14}
//         />
//         <p className="text-md font-inter text-gray-300">Tap a chat to preview</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div
//         role="button"
//         tabIndex={0}
//         onClick={handleUpdateMessageStatus}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             handleUpdateMessageStatus();
//           }
//         }}
//         className="flex h-full max-h-screen flex-1 flex-col overflow-hidden bg-white"
//       >
//         {isLoading ? (
//           <SkeletonMessageLoader />
//         ) : (
//           <>
//             {/* Fixed height header */}
//             {chat && (
//               <div className="shrink-0">
//                 <Header chat={chat} />
//               </div>
//             )}

//             {/* Scrollable messages area with flex-grow */}
//             <div
//               className="relative grow overflow-y-auto px-4 py-2"
//               ref={scrollAreaRef}
//               style={{
//                 maxHeight: 'calc(100vh - 250px)',
//               }}
//               onScroll={handleScroll}
//             >
//               {/* <OrStrike text="Today" /> */}

//               {/* <div className="min-h-full">
//                 {!chat || chat.messages.length === 0 ? (
//                   <div className="flex h-full flex-col items-center justify-center py-8">
//                     <p className="text-center text-sm text-gray-500">
//                       Send a message to start the conversation
//                     </p>
//                   </div>
//                 ) : (
//                   <MessageList
//                     messages={chat.messages}
//                     currentlyPlayingAudio={currentlyPlayingAudio}
//                     onAudioPlayPause={handleAudioPlayPause}
//                     session={session}
//                     uploadingMessage={uploadingMessage}
//                   />
//                 )}
//                 <div className="space-y-2">
//                   {remoteTyping && <TypingIndicator position="left" />}
//                   {isTyping && <TypingIndicator position="left" />}
//                 </div>
//                 <div ref={messagesEndRef} />
//               </div> */}
//             </div>

//             {/* Fixed height input */}
//             <div className="shrink-0">
//               <ChatInput
//                 inputMessage={inputMessage}
//                 isUploading={isUploading}
//                 isRecording={isRecording}
//                 onMessageChange={handleInputChange}
//                 onSendMessage={handleSendMessage}
//                 onFileSelect={handleFileSelect}
//                 onToggleRecording={toggleRecording}
//               />
//             </div>
//           </>
//         )}

//         {/* Invoice dialog window */}
//         {/* <DialogProvider.Window name="invoice" title="">
//           <InvoiceDialog />
//         </DialogProvider.Window> */}

//         {/* invoice accept or reject window  */}
//         {/* <DialogProvider.Window
//           name="invoiceAcceptReject"
//           title=""
//           className="w-[380px] md:w-[420px] "
//         >
//           <InvoiceAcceptReject />
//         </DialogProvider.Window> */}

//         {/* invoice reject window  */}
//         {/* <DialogProvider.Window name="rejectInvoice" title="" className="w-[380px] md:w-[420px] ">
//           <InvoiceReject />
//         </DialogProvider.Window> */}

//         {/* reject invoice success window  */}
//         {/* <DialogProvider.Window
//           name="rejectInvoiceSuccess"
//           title=""
//           className="w-[380px] md:w-[420px] "
//         >
//           <SuccessMessage dialogWindowName="rejectInvoiceSuccess" />
//         </DialogProvider.Window> */}
//       </div>
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Header from './Header';
import SkeletonMessageLoader from './SkeletonMessageLoader';
import { TypingIndicator } from './TypingIndicator';

import { toast } from '@/components/ui/use-toast';
import { ChatInput } from '@/components/view/dashboard/Chats/ChatInput';
import { MessageList } from '@/components/view/dashboard/Chats/MessageList';
import { useChats } from '@/context/ChatListProvider';
import { Chat, Message } from '@/types/chat.type';
import { mockChats, mockMessages } from '@/lib/data/chat-mock-data';

export default function ChatUI() {
  const params = useParams();
  const chatId = params.id as string;
  const { session } = useChats();

  // Use mock data instead of API
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const uploadingRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const audioChunksRef = useRef<Blob[]>([]);
  const [uploadingMessage, setUploadingMessage] = useState<Message | null>(null);

  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastScrollHeightRef = useRef<number>(0);

  // Load mock data based on chatId
  useEffect(() => {
    if (chatId) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        const foundChat = mockChats.find((c) => c.id === chatId);
        if (foundChat) {
          setChat({
            ...foundChat,
            messages: mockMessages[chatId] || [],
          });
        }
        setIsLoading(false);
      }, 500);
    }
  }, [chatId]);

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
  }, [chat?.messages, uploadingMessage, scrollToBottom]);

  // function to handle the send messages
  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || !chat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      status: 'sent' as const,
      senderId: session?.id || 'current-user',
    };

    // Add message to current chat
    setChat((prevChat) => {
      if (!prevChat) return prevChat;
      return {
        ...prevChat,
        messages: [...(prevChat.messages || []), newMessage],
      };
    });

    setInputMessage('');
    scrollToBottom();

    // Simulate status updates
    setTimeout(() => {
      setChat((prevChat) => {
        if (!prevChat) return prevChat;
        const updatedMessages = (prevChat.messages || []).map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        );
        return { ...prevChat, messages: updatedMessages };
      });
    }, 1000);

    setTimeout(() => {
      setChat((prevChat) => {
        if (!prevChat) return prevChat;
        const updatedMessages = (prevChat.messages || []).map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
        );
        return { ...prevChat, messages: updatedMessages };
      });
    }, 2000);
  }, [inputMessage, chat, session?.id, scrollToBottom]);

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
      if (!chat) return;

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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        senderId: session?.id || 'current-user',
        pages: fileType === 'pdf' ? 1 : undefined,
        duration: fileType === 'audio' ? '0:30' : undefined,
        audioUrl: fileType === 'audio' ? fileUrl : undefined,
        status: 'sent',
      };

      setChat((prevChat) => {
        if (!prevChat) return prevChat;
        return {
          ...prevChat,
          messages: [...(prevChat.messages || []), newMessage],
        };
      });

      scrollToBottom();

      // Simulate status updates
      setTimeout(() => {
        setChat((prevChat) => {
          if (!prevChat) return prevChat;
          const updatedMessages = (prevChat.messages || []).map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
          );
          return { ...prevChat, messages: updatedMessages };
        });
      }, 1000);

      setTimeout(() => {
        setChat((prevChat) => {
          if (!prevChat) return prevChat;
          const updatedMessages = (prevChat.messages || []).map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
          );
          return { ...prevChat, messages: updatedMessages };
        });
      }, 1000);
    },
    [chat, logFileDetails, session?.id, scrollToBottom]
  );

  // function to handle file selection
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
        senderId: session?.id || 'current-user',
        status: 'sending' as const,
      };

      setUploadingMessage(tempMessage);

      // Simulate file upload delay
      setTimeout(() => {
        const fileUrl = URL.createObjectURL(file);
        addFileMessage(file, fileUrl);

        uploadingRef.current = false;
        setIsUploading(false);
        setUploadingMessage(null);

        toast({
          title: 'Upload Successful',
          description: `File uploaded successfully: ${file.name}`,
        });
      }, 2000);
    },
    [addFileMessage, session?.id]
  );

  // function for handling chat input filed messages
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // Simulate typing indicator
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
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

        addFileMessage(file, URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      toast({
        title: 'Recording started',
        description: 'Click the microphone again to stop recording',
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
    }
  }, [addFileMessage]);

  // function for speech recognition to stop recording
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [mediaRecorder]);

  // if no chats are there this will be rendered
  if (!chatId) {
    return (
      <div className="flex size-full flex-col items-center justify-center bg-white">
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
      {isLoading ? (
        <SkeletonMessageLoader />
      ) : (
        <>
          {/* Fixed height header */}
          {chat && (
            <div className="shrink-0">
              <Header chat={chat} />
            </div>
          )}

          {/* Scrollable messages area with flex-grow */}
          <div
            className="relative grow overflow-y-auto px-4 py-2"
            ref={scrollAreaRef}
            style={{
              maxHeight: 'calc(100vh - 250px)',
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
                  messages={chat.messages || []}
                  currentlyPlayingAudio={currentlyPlayingAudio}
                  onAudioPlayPause={handleAudioPlayPause}
                  session={session}
                  uploadingMessage={uploadingMessage}
                />
              )}
              <div className="space-y-2">{isTyping && <TypingIndicator position="left" />}</div>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Fixed height input */}
          <div className="shrink-0">
            <ChatInput
              inputMessage={inputMessage}
              isUploading={isUploading}
              isRecording={isRecording}
              onMessageChange={handleInputChange}
              onSendMessage={handleSendMessage}
              onFileSelect={handleFileSelect}
              onToggleRecording={toggleRecording}
            />
          </div>
        </>
      )}
    </div>
  );
}
