import React, { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';

import { MessageStatusType } from '@/types/chat.type';

interface MessageStatusProps {
  status: MessageStatusType;
}

export function MessageStatus({ status }: MessageStatusProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (status === 'sent' && audioRef.current) {
      audioRef.current.play();
    }
  }, [status]);

  if (status === 'sent') {
    return <Check className="size-4 text-gray-600" />;
  }

  if (status === 'delivered') {
    return <CheckCheck className="size-4 text-gray-600" />;
  }

  if (status === 'read') {
    return <CheckCheck className="size-4 text-blue-500" />;
  }

  // return (
  //   <>
  //     {status === 'sent' && <Check className="size-4 text-gray-400" />}
  //     {status === 'delivered' && <CheckCheck className="size-4 text-gray-400" />}
  //     {status === 'read' && <CheckCheck className="size-4 text-blue-500" />}
  //     {/* Audio element that plays when message is sent */}
  //     {/* <audio ref={audioRef} src="/assets/dashboard/business-dashboard/chats/sent-message.mp3" /> */}
  //   </>
  // );

  return null;
}
