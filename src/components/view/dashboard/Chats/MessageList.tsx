'use client';

import React from 'react';

// eslint-disable-next-line import/order
import { AudioPlayer } from './AudioPlayer';

// import { InvoiceMessage } from './Invoice/InvoiceMessage';

import { MessageStatus } from './MessageStatus';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types/chat.type';
// import { MessageStatus } from '@/components/view/dashboard/business-dashboard/chats/MessageStatus';
// import { FileMessage } from '@/components/view/dashboard/business-dashboard/chats/FileMessage';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  currentlyPlayingAudio: string | null;
  onAudioPlayPause: (messageId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
  uploadingMessage?: Message | null;
}

export function MessageList({
  messages,
  currentlyPlayingAudio,
  onAudioPlayPause,
  session,
  uploadingMessage,
}: MessageListProps) {
  console.log('🌼 🔥🔥 messages🌼', messages);

  // function formatTimeToAmPm(isoDateTime: string) {
  //   const date = new Date(isoDateTime);
  //   let hours = date.getUTCHours();
  //   const minutes = date.getUTCMinutes();
  //   const amPm = hours >= 12 ? 'PM' : 'AM';
  //   hours = hours % 12 || 12;
  //   return `${hours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  // }

  // function to format time to user's time zone
  function formatTimeToUserTimeZone(isoDateTime: string) {
    const date = new Date(isoDateTime);
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Ensures AM/PM format if required changed it to false for 24-hour format
    };
    return new Intl.DateTimeFormat(undefined, options).format(date); // 'undefined' uses user's locale and time zone
  }

  const allMessages = uploadingMessage ? [...messages, uploadingMessage] : messages;

  return (
    <div className="size-full h-full max-w-full space-y-4 overflow-x-hidden px-2 md:px-4">
      {allMessages?.map((message) => (
        <div
          key={message.id}
          className={cn('group flex items-start gap-3 max-w-full', {
            'flex-row-reverse': message.senderId === session?.id,
            'flex-row': message.senderId !== session?.id,
          })}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarImage
              src={
                message.senderId === session?.id
                  ? '/assets/dashboard/Dashboard/profile-img.png'
                  : '/assets/admin-dashboard/dashboard/user-profile.png'
              }
              alt={message.senderId === session?.id ? 'receiver' : 'sender'}
            />
          </Avatar>
          <div
            className={cn('flex flex-col w-full max-w-[calc(100%-50px)] overflow-x-hidden', {
              'items-end': message.senderId === session?.id,
              'items-start': message.senderId !== session?.id,
            })}
          >
            {/* {(message.type === 'pdf' || message.type === 'image' || message.type === 'video') && (
              <div className="max-w-full overflow-x-hidden">
                <FileMessage message={message} isLoading={message === uploadingMessage} />
              </div>
            )} */}

            {message?.file?.type === 'audio' && message?.file?.url && (
              <div className="w-full max-w-sm">
                <AudioPlayer
                  audioUrl={message?.file?.url}
                  isPlaying={currentlyPlayingAudio === message.id}
                  onPlayPause={() => onAudioPlayPause(message.id)}
                />
              </div>
            )}

            {message.type === 'text' && (
              <div
                className={cn(
                  'max-w-full w-fit overflow-x-hidden overflow-ellipsis rounded-md bg-white p-3 shadow-lg break-words',
                  {
                    'rounded-br-none': message.senderId === session?.id,
                    'rounded-bl-none': message.senderId !== session?.id,
                  }
                )}
              >
                <p className="max-w-full break-words">{message.content}</p>
              </div>
            )}

            {message.type === 'invoice' && (
              // <InvoiceMessage status={message.status} id={message.invoice?.id as string} />
              <p>Invoice message</p>
            )}

            {/* {true && <InvoiceMessage status={message.status} id={message.invoice?.id as string} />} */}

            <div className="mt-2 flex max-w-full items-center gap-2 overflow-x-hidden text-sm text-gray-500">
              <span className="truncate">
                {message.createdAt ? formatTimeToUserTimeZone(message.createdAt) : 'Sending...'}
              </span>
              {message.senderId === session?.id && (
                <MessageStatus status={message.status || 'sent'} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
