import React, { useState } from 'react';
import { Download, Eye, X } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Message } from '@/types/chat.type';
import { LoadingMessage } from './LoadingMessage';
import { LazyMedia } from './LazyMedia';

interface FileMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function FileMessage({ message, isLoading = false }: FileMessageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleDownload = async () => {
    if (!message?.file?.url) return;

    try {
      const response = await fetch(message?.file?.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = message.fileName || 'file';
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
          <>
            <div className="group/image relative w-full max-w-xs overflow-hidden rounded-lg sm:max-w-sm md:max-w-md lg:max-w-lg">
              <LazyMedia
                type="image"
                src={message?.file?.url as string}
                alt={message?.file?.name || 'image'}
                className=" w-full cursor-pointer"
              />
              {/* Blur Overlay - appears on hover */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center   opacity-0 backdrop-blur-lg transition-opacity duration-300 group-hover/image:pointer-events-auto group-hover/image:opacity-100">
                <div className="flex space-x-4">
                  {/* Download Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="
                  size-12
                rounded-full
                bg-black/80
                font-bold
                text-white 
                transition-all 
                duration-300 
              "
                    onClick={handleDownload}
                    title="Download Image"
                  >
                    <Download className="size-5" />
                  </Button>

                  {/* View Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="
                size-12
                rounded-full
                bg-black/80 
                font-bold
                text-white
                transition-all 
                duration-200
              "
                    title="View Image"
                    onClick={handleView}
                  >
                    <Eye className="size-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Image Dialog Modal */}
            {isDialogOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
                {/* Backdrop - Click to close */}
                <button
                  className="absolute inset-0 size-full cursor-default"
                  onClick={closeDialog}
                  aria-label="Close dialog"
                />

                {/* Dialog Content */}
                <div className="flex h-full items-center justify-center p-6">
                  <div className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-4">
                    {/* Close Button  */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="
                        absolute 
                        -right-4 
                        -top-4 
                        z-20 
                        size-12 
                        rounded-full 
                        border-2 
                        border-white/40 
                        bg-white/10 
                        text-white 
                        shadow-lg 
                        backdrop-blur-md 
                        transition-all
                        duration-200
                        hover:scale-110
                        hover:border-white/60
                        hover:bg-white/20
                      "
                      onClick={closeDialog}
                      title="Close"
                    >
                      <X className="size-6" />
                    </Button>

                    {/* Image Container */}
                    <div className="relative overflow-hidden rounded-xl shadow-2xl">
                      <LazyMedia
                        type="image"
                        src={message?.file?.url as string}
                        alt={message?.file?.name || 'image'}
                        className="max-h-[80vh] max-w-full object-contain"
                      />
                    </div>

                    {/* Download Button */}
                    <Button
                      variant="outline"
                      className="
                        flex 
                        items-center 
                        gap-2 
                        rounded-full 
                        border-2 
                        border-white/40 
                        bg-white/10 
                        px-6 
                        py-3 
                        text-white 
                        shadow-lg 
                        backdrop-blur-md 
                        transition-all 
                        duration-200
                        hover:scale-105
                        hover:border-white/60
                        hover:bg-white/20
                        hover:text-white
                      "
                      onClick={handleDownload}
                    >
                      <Download className="size-5" />
                      <span className="font-medium">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      case 'video':
        return (
          <div className="group relative w-full max-w-xs overflow-hidden rounded-lg sm:max-w-sm md:max-w-md lg:max-w-lg">
            <LazyMedia type="video" src={message?.file?.url as string} className="w-full" />
            <Button
              variant="default"
              size="icon"
              className="
              absolute
                right-2 
                top-2 
                z-10 
                bg-black
                text-white
                opacity-0 
                transition-opacity 
                hover:bg-black/80 
                group-hover:opacity-100
              "
              onClick={handleDownload}
            >
              <Download className="size-4 font-bold" />
            </Button>
          </div>
        );

      default: {
        // DOCX file
        const isDocx =
          message?.file?.type === 'docx' || message?.file?.name?.toLowerCase().endsWith('.docx');
        if (isDocx) {
          return (
            <div className="w-full max-w-md overflow-hidden rounded-lg bg-blue-500 text-white">
              <div className="flex items-center justify-between p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="shrink-0 rounded bg-white/20 p-2">
                    <Image
                      src="/assets/dashboard/Chats/docx.svg"
                      alt="docx-icon"
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

        // PDF and other files
        return (
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-[#F8F8F8] text-white">
            <div className="flex items-center justify-between p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="shrink-0 rounded bg-white/20 p-2">
                  <Image
                    src="/assets/dashboard/Chats/pdf.svg"
                    alt="pdf-icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-black">{message?.file?.name}</p>
                  <p className="text-sm opacity-90 text-black">{message?.file?.size} mb</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-white hover:bg-white/20"
                onClick={handleDownload}
              >
                <Download className="size-5 text-black" />
              </Button>
            </div>
          </div>
        );
      }
    }
  };

  return renderFilePreview();
}
