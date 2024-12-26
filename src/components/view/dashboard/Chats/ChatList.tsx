'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChats } from '@/context/ChatListProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSocket } from '@/context/socketProvider';

// Skeleton Loader Component
const ChatListSkeleton = () => (
  <ScrollArea className="h-[calc(100vh-180px)] overflow-hidden">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="animate-pulse border-b p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-6 w-16 rounded bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          <div className="size-[0.4rem] rounded-full bg-gray-300"></div>
        </div>
      </div>
    ))}
  </ScrollArea>
);

export default function ChatList() {
  const router = useRouter();
  const params = useParams();
  const currentChatId = params.id;
  const pathUrl = usePathname();
  const pathName = pathUrl.split('/')[1];
  const { chats, session, onlineUsers } = useChats();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    // Set loading to false once chats are loaded
    if (chats && chats.length >= 0) {
      setIsLoading(false);
    }
  }, [chats]);

  const filteredChats = chats?.filter((chat) =>
    chat?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBack = () => {
    router.push(`/${pathName}/chats`);
  };

  return (
    <div className={cn('border-r w-full lg:w-80', currentChatId ? 'hidden lg:block' : 'block')}>
      <div className="border-b p-4">
        <div className="mb-4 flex items-center gap-2">
          {currentChatId && (
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={handleBack}>
              <ArrowLeft className="size-5" />
            </Button>
          )}
          {isLoading ? (
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-8 animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            </div>
          ) : (
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              Chats{' '}
              <span className="rounded-lg border px-2 py-1 text-sm">{chats?.length || 0}</span>
            </h2>
          )}
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute left-2 top-1/2 size-4 -translate-y-1/2" />
          <Input
            className="pl-8"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <ChatListSkeleton />
      ) : chats?.length === 0 || filteredChats?.length === 0 ? (
        <div className=" flex size-full flex-col items-center justify-center gap-2">
          <Image
            src="/assets/dashboard/business-dashboard/chats/empty-chat.svg"
            alt="empty-chat"
            width={139}
            height={108.14}
            loading="lazy"
          />
          <p className="text-gray-300">No chat Found</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)] overflow-hidden">
          {filteredChats?.map((chat) => (
            <div
              key={chat.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && router.push(`/${pathName}/chats/${chat.id}`)}
              className={cn(
                'hover:bg-muted/50 cursor-pointer p-4',
                currentChatId === chat.id && 'bg-primary-100'
              )}
              onClick={() => router.push(`/${pathName}/chats/${chat.id}`)}
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-medium">{chat.name}</h3>
                <Badge
                  variant={chat.status === 'completed' ? 'secondary' : 'default'}
                  className={cn(
                    'rounded-md',
                    chat.status === 'completed'
                      ? 'bg-[#EAF8FA] text-[#218698]'
                      : 'bg-[#FCEEF6] text-[#E455A2]'
                  )}
                >
                  {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>{chat.participants?.find((p) => p.id !== session?.id)?.fullName}</span>
                {socket?.connected &&
                onlineUsers[
                  chat.participants?.find((p) => p.id !== session?.id)?.email as string
                ] ? (
                  <div className="size-[0.4rem] rounded-full bg-green-400" />
                ) : (
                  <div className="size-[0.4rem] rounded-full bg-gray-400" />
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  );
}
