'use client';

import { useParams } from 'next/navigation';

import ChatFallbackContainer from '@/components/view/dashboard/Chats/ChatFallbackContainer';
import ChatList from '@/components/view/dashboard/Chats/ChatList';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const params = useParams();
  return (
    <div className="flex size-full rounded-lg border">
      <ChatList />
      <div className={cn('flex-1 lg:block', !params?.id && 'hidden lg:block')}>
        <ChatFallbackContainer />
      </div>
    </div>
  );
}
