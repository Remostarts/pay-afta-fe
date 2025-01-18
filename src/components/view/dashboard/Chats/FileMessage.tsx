import React from 'react';
import { Download } from 'lucide-react';
import Image from 'next/image';

import { LoadingMessage } from './LoadingMessage';
import { LazyMedia } from './LazyMedia';

import { Button } from '@/components/ui/button';
import { Message } from '@/types/chat.type';

interface FileMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function FileMessage({ message, isLoading = false }: FileMessageProps) {
  const handleDownload = async () => {
    if (!message?.file?.url) return;

    try {
      const response = await fetch(message?.file?.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = message.fileName || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const renderFilePreview = () => {
    if (isLoading) {
      return <LoadingMessage type={message.type as 'image' | 'video' | 'audio' | 'pdf'} />;
    }

    switch (message.type) {
      case 'image':
        return (
          <div className="group relative w-full max-w-xs overflow-hidden rounded-lg sm:max-w-sm md:max-w-md lg:max-w-lg">
            <LazyMedia
              type="image"
              src={message?.file?.url as string}
              alt={message?.file?.name || 'image'}
              className="w-full"
            />
            <Button
              variant="secondary"
              size="sm"
              className="
                absolute 
                bottom-2 
                right-2 
                z-10 
                text-white 
                opacity-0 
                transition-opacity 
                group-hover:opacity-100
              "
              onClick={handleDownload}
            >
              <Download className="size-4" />
            </Button>
          </div>
        );

      case 'video':
        return (
          <div className="group relative w-full max-w-xs overflow-hidden rounded-lg sm:max-w-sm md:max-w-md lg:max-w-lg">
            <LazyMedia type="video" src={message?.file?.url as string} className="w-full" />
            <Button
              variant="secondary"
              size="sm"
              className="
                absolute 
                bottom-2 
                right-2 
                z-10 
                opacity-0 
                transition-opacity 
                group-hover:opacity-100
              "
              onClick={handleDownload}
            >
              <Download className="size-4" />
            </Button>
          </div>
        );

      default:
        return (
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-primary-500 text-white">
            <div className="flex items-center justify-between p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="shrink-0 rounded bg-white/20 p-2">
                  <Image
                    src="/assets/dashboard/business-dashboard/chats/pdf.svg"
                    alt="pdf-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{message?.file?.name}</p>
                  <p className="text-sm opacity-90">{message?.file?.size} mb</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-white hover:bg-white/20"
                onClick={handleDownload}
              >
                <Download className="size-5" />
              </Button>
            </div>
          </div>
        );
    }
  };

  return renderFilePreview();
}
