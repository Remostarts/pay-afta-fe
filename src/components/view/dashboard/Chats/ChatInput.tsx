'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Paperclip, ArrowUp, Mic, FileText, Music, Video, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  inputMessage: string;
  isUploading: boolean;
  isRecording: boolean;
  isDisabled: boolean;
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
  isDisabled,
  isRecording,
  onMessageChange,
  onSendMessage,
  onFileSelect,
  onToggleRecording,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(40);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.min(Math.max(40, scrollHeight), 120); // Min 40px, max 120px
      setTextareaHeight(newHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputMessage]);

  // Ensure textarea is accessible on mobile
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;

      // Force focus on mobile to ensure it's clickable
      const handleFocus = () => {
        textarea.style.fontSize = '16px'; // Prevent zoom on iOS
      };

      textarea.addEventListener('focus', handleFocus);

      return () => {
        textarea.removeEventListener('focus', handleFocus);
      };
    }
  }, []);

  const handleFileTypeSelect = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Create a synthetic event that matches the expected input event
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: e.target.value,
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onMessageChange(syntheticEvent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  // Handle touch events for mobile - only prevent default on specific elements
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only prevent default on buttons to avoid interference with textarea
    if (e.currentTarget.tagName === 'BUTTON') {
      e.preventDefault();
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 md:gap-3 border-t bg-white p-2 md:p-3 w-full relative z-50',
        isUploading && 'pointer-events-none opacity-60'
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileSelect}
        disabled={isUploading || isRecording || isDisabled}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />

      {/* File attachment button */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Attach file"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 rounded-full text-muted-foreground hover:bg-primary-100 md:size-10"
            disabled={isUploading || isRecording || isDisabled}
            style={{ touchAction: 'manipulation' }}
          >
            <Paperclip className="size-4 md:size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="z-[200] w-40 bg-white md:w-48"
          style={{ touchAction: 'manipulation' }}
        >
          {fileTypes.map((type) => (
            <DropdownMenuItem
              key={type.label}
              onClick={() => handleFileTypeSelect(type.accept)}
              className="flex items-center hover:bg-primary-100"
              style={{ touchAction: 'manipulation', minHeight: '44px' }}
            >
              {type.icon}
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Auto-resizable textarea */}
      <div className="min-w-0 flex-1">
        <Textarea
          ref={textareaRef}
          placeholder={
            isRecording ? 'Recording...' : isUploading ? 'Uploading...' : 'Start Messaging'
          }
          value={inputMessage}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={isRecording || isUploading || isDisabled}
          className={cn(
            'w-full resize-none rounded-md border bg-background px-3 py-2  placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-opacity duration-200',
            (isRecording || isUploading) && 'opacity-50',
            'min-h-[44px] max-h-[160px] md:min-h-[40px] md:max-h-[120px]',
            'text-[16px] md:text-sm',
            'leading-6 md:leading-5',
            'px-3 py-2.5 md:py-2'
          )}
          style={{
            height: `${textareaHeight}px`,
            touchAction: 'manipulation',
            WebkitUserSelect: 'text',
            WebkitTouchCallout: 'none',
            WebkitAppearance: 'none',
            borderRadius: '6px',
          }}
          rows={1}
        />
      </div>

      {/* Send button */}
      <div className="flex items-center justify-between">
        <Button
          size="icon"
          aria-label="Send message"
          className="size-10 rounded-full text-white bg-[#03045B]"
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isUploading || isRecording}
          style={{ touchAction: 'manipulation' }}
        >
          <ArrowUp size="icon" className="size-5" />
        </Button>
      </div>

      {/* Microphone button */}
      {/* <Button
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        className={cn(
          'flex-shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-primary-100',
          isRecording && 'bg-red-500 hover:bg-red-600 text-white'
        )}
        variant="outline"
        size="icon"
        onClick={onToggleRecording}
        disabled={isUploading || isDisabled}
        style={{ touchAction: 'manipulation' }}
      >
        <Mic className={cn('size-4 md:size-5', isRecording ? 'text-white' : 'text-black')} />
      </Button> */}
    </div>
  );
}
