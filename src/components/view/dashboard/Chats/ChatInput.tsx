'use client';

import React, { useRef } from 'react';
import { Paperclip, ArrowUp, Mic, FileText, Music, Video, ImageIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  inputMessage: string;
  isUploading: boolean;
  isRecording: boolean;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleRecording: () => void;
}

const fileTypes = [
  { label: 'Images', accept: 'image/*', icon: <ImageIcon className="mr-2 size-4" /> },
  { label: 'Documents', accept: '.pdf,.doc,.docx', icon: <FileText className="mr-2 size-4" /> },
  { label: 'Audio', accept: 'audio/*', icon: <Music className="mr-2 size-4" /> },
  { label: 'Video', accept: 'video/*', icon: <Video className="mr-2 size-4" /> },
];

export function ChatInput({
  inputMessage,
  isUploading,
  isRecording,
  onMessageChange,
  onSendMessage,
  onFileSelect,
  onToggleRecording,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileTypeSelect = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t p-4 w-full h-full',
        isUploading && 'pointer-events-none opacity-60'
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileSelect}
        disabled={isUploading || isRecording}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-10 hover:bg-primary-100"
            disabled={isUploading || isRecording}
          >
            <Paperclip className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-white">
          {fileTypes.map((type) => (
            <DropdownMenuItem
              key={type.label}
              onClick={() => handleFileTypeSelect(type.accept)}
              className="flex items-center hover:bg-primary-100"
            >
              {type.icon}
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        placeholder={
          isRecording ? 'Recording...' : isUploading ? 'Uploading...' : 'Start Messaging'
        }
        value={inputMessage}
        onChange={onMessageChange}
        disabled={isRecording || isUploading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        className={cn(
          'transition-opacity duration-200',
          (isRecording || isUploading) && 'opacity-50'
        )}
      />

      <div className="flex items-center justify-between">
        <Button
          size="icon"
          className="size-10 rounded-full text-white bg-[#03045B]"
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isUploading || isRecording}
        >
          <ArrowUp size="icon" className="size-5" />
        </Button>
      </div>

      {/* <Button
        className={cn(
          'rounded-xl hover:bg-primary-100',
          isRecording && 'bg-red-500 hover:bg-red-600 text-white'
        )}
        variant="ghost"
        onClick={onToggleRecording}
        disabled={isUploading}
      >
        <Mic className={cn('size-5', isRecording ? 'text-white' : 'text-black')} />
      </Button> */}
    </div>
  );
}
