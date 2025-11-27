'use client';

import { Bell, X } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMessageNotification } from '@/context/MessageNotificationProvider';
import { MessageNotification, NotificationType } from '@/types/messageNotification.type';
import NotificationList from './notification-list';

interface NotificationsProps {
  handleNotificationBtn: () => void;
}

function Notifications({ handleNotificationBtn }: NotificationsProps) {
  const { notifications, setActiveNotification, markAsRead } = useMessageNotification();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  console.log(notifications);

  const router = useRouter();

  const handleView = (notification: MessageNotification) => {
    markAsRead(notification.id);
    if (notification.type === NotificationType.message) {
      router.push(`/dashboard/chats/${notification.actionInfo}`);
    } else {
      setActiveNotification(notification);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Notifications Dropdown */}
      <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild onClick={handleNotificationBtn}>
          <div className="relative flex size-10 cursor-pointer items-center justify-center rounded-full border">
            <Bell
              className="size-6  text-gray-600 transition-colors hover:text-gray-800"
              aria-label="Notifications"
            />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-2 flex size-5  items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="ml-2 w-[400px] bg-white">
          <DropdownMenuLabel className="flex items-center justify-between px-2 py-3 font-semibold ">
            <h2 className="text-lg font-medium">Notifications</h2>
            <Button
              variant="ghost"
              size="icon"
              className=" rounded-ful"
              onClick={() => setIsOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </DropdownMenuLabel>
          <div className="mt-2">
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-2 gap-4">
                <TabsTrigger
                  value="all"
                  className="bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#03045B] data-[state=active]:text-[#03045B] data-[state=active]:transition data-[state=active]:duration-300"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#03045B] data-[state=active]:text-[#03045B] data-[state=active]:transition data-[state=active]:duration-300"
                >
                  Unread{' '}
                  <span className="ml-1 rounded-lg bg-gray-200 px-2 py-1 text-xs text-muted-foreground">
                    {unreadCount}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <NotificationList notifications={notifications} onView={handleView} />
              </TabsContent>

              <TabsContent value="unread">
                <NotificationList
                  notifications={notifications.filter((n) => !n.isRead)}
                  onView={handleView}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default Notifications;
