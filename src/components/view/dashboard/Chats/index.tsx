'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Paperclip, ArrowUp, FileText, X } from 'lucide-react';

// import OrStrike from '../../shared/OrStrike';

import { AudioPlayer } from './AudioPlayer';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  type: 'text' | 'pdf' | 'audio' | 'invoice';
  content?: string;
  fileName?: string;
  fileSize?: string;
  pages?: number;
  time: string;
  sender: 'user' | 'receiver';
  duration?: string;
  title?: string;
  audioUrl?: string;
}

// mock data for chats
const chats = [
  { title: 'sdkajmf', status: 'completed', user: 'Anthony V', online: true },
  {
    title: 'Trade Mark',
    status: 'active',
    user: 'Anthony V',
    online: false,
  },
  { title: 'Agreement', status: 'completed', user: 'Anthony V', online: false },
  { title: 'Employment Agreement', status: 'active', user: 'Anthony V', online: true },
  {
    title: 'Agreement',
    status: 'completed',
    user: 'Anthony V',
    online: false,
  },
];

export default function Chats() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'pdf',
      fileName: ' Letter.pdf',
      fileSize: '4 MB',
      pages: 1,
      time: '11:00 AM',
      sender: 'receiver',
    },
    {
      id: '2',
      type: 'audio',
      duration: '0:30',
      time: '11:00 AM',
      sender: 'user',
      audioUrl: '/path/to/audio.mp3',
    },
    {
      id: '3',
      type: 'pdf',
      fileName: ' Details.pdf',
      fileSize: '4 MB',
      pages: 1,
      time: '11:00 AM',
      sender: 'receiver',
    },
    {
      id: '4',
      type: 'invoice',
      title: 'Invoice',
      time: '11:00 AM',
      sender: 'user',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // function to scrollToBottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // function to send message
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'text',
        content: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setIsTyping(false);
    }
  };

  // function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      // console.log('clearing timeout', typingTimeoutRef.current);
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 10000);
  };

  // function to handle file upload
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please select a file smaller than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    simulateFileUpload(file);
  };

  // function to simulate file upload
  const simulateFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          addFileMessage(file);
          setSelectedFile(null);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  // function to add file message
  const addFileMessage = (file: File) => {
    const fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const fileType = file.type.includes('pdf')
      ? 'pdf'
      : file.type.includes('audio')
        ? 'audio'
        : 'text';

    const newMessage: Message = {
      id: Date.now().toString(),
      type: fileType,
      fileName: file.name,
      fileSize,
      pages: 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user',
      duration: fileType === 'audio' ? '0:30' : undefined,
      audioUrl: fileType === 'audio' ? URL.createObjectURL(file) : undefined,
    };

    setMessages([...messages, newMessage]);
  };

  // function to handle audio play pause
  const handleAudioPlayPause = (messageId: string) => {
    setCurrentlyPlayingAudio(currentlyPlayingAudio === messageId ? null : messageId);
  };

  return (
    <div className="flex h-screen w-full rounded-lg  border bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r">
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-semibold">Chats</h2>
            <Badge variant="secondary" className="bg-gray-100">
              5
            </Badge>
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-2.5 size-4" />
            <Input className="pl-9" placeholder="Search Messages" />
          </div>
        </div>

        {/* chats list area */}
        <ScrollArea className="h-[calc(100%-88px)]">
          {chats.map((chat, i) => (
            <div
              key={i}
              className={`hover:bg-muted/50 cursor-pointer p-4 ${i === 3 ? 'bg-primary-100' : ''}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium">{chat.title}</h3>
                <Badge
                  variant={chat.status === 'completed' ? 'secondary' : 'default'}
                  className={`rounded-md p-2 ${
                    chat.status === 'completed'
                      ? 'bg-[#EAF8FA] text-[#218698]'
                      : 'bg-[#FCEEF6] text-[#E455A2]'
                  }`}
                >
                  {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>{chat.user}</span>
                {chat.online && <div className="size-2 rounded-full bg-green-500" />}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Employment Agreement</h1>
              <p className="text-muted-foreground text-sm">Anthony V</p>
            </div>
            <Button variant="ghost" size="icon">
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Messages area*/}
        <ScrollArea className="flex-1 ">
          <div className="space-y-6 p-4">
            {/* <OrStrike text="Today" /> */}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`group flex items-start gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="size-8 shrink-0">
                  <AvatarImage
                    src={
                      message.sender === 'user'
                        ? '/assets/dashboard/business-dashboard/chats/sender-img.png'
                        : '/assets/dashboard/business-dashboard/chats/sender-img.png'
                    }
                    alt={message.sender}
                  />
                </Avatar>
                <div
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span>{message.time}</span>
                  </div>

                  {/* if message type is pdf file  */}
                  {message.type === 'pdf' && (
                    <div className="w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <div className="rounded bg-[#86C8E9] p-2">
                            <FileText className="size-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{message.fileName}</p>
                            <p className="text-sm opacity-90">
                              {message.pages} page • {message.fileSize}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                        >
                          <Download className="size-5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* if message type is audio  */}
                  {/* {message.type === 'audio' && message.audioUrl && (
                    <div className="w-full max-w-md">
                      <AudioPlayer
                        audioUrl={message.audioUrl}
                        isPlaying={currentlyPlayingAudio === message.id}
                        onPlayPause={() => handleAudioPlayPause(message.id)}
                      />
                    </div>
                  )} */}

                  {/* if message type is text */}
                  {message.type === 'text' && (
                    <div className="max-w-md rounded-md bg-white p-3 shadow-lg">
                      <p>{message.content}</p>
                    </div>
                  )}

                  {/* if message type is invoice  */}
                  {message.type === 'invoice' && (
                    <div className="w-full max-w-md overflow-hidden rounded-lg bg-[#E8FDEF] p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-white p-2">
                          <FileText className="size-5 text-[#12BA4A]" />
                        </div>
                        <div>
                          <p className="font-medium">{message.title}</p>
                          <Button variant="link" className="h-auto p-0">
                            VIEW
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* typing indicator */}
            {isTyping && (
              <div className="flex items-end justify-end gap-3">
                <Avatar className="size-8">
                  <AvatarImage
                    src="/assets/dashboard/business-dashboard/chats/sender-img.png"
                    alt="Typing"
                  />
                </Avatar>
                <div className="max-w-[50px] rounded-lg bg-gray-200 p-2">
                  <div className="flex items-center gap-1">
                    <div className="size-2 animate-bounce rounded-full bg-gray-400" />
                    <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]" />
                    <div className="size-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* uploading card  */}
        {isUploading && (
          <div className="bg-background border-t p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-muted-foreground size-4" />
                <span className="text-sm">{selectedFile?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="size-6 p-0"
                onClick={() => {
                  setIsUploading(false);
                  setSelectedFile(null);
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
            <Progress value={uploadProgress} className="h-1" />
          </div>
        )}

        <div className="bg-background flex items-center gap-2 border-t p-4">
          {/* file input  */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,audio/*"
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-5" />
          </Button>

          {/* message input  */}
          <Input
            placeholder="Start Messaging"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {/* send message button  */}
          <Button
            size="icon"
            className="size-10 rounded-full bg-[#3A3DF8] text-white hover:bg-[#3A3DF8]"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() && !selectedFile}
          >
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
