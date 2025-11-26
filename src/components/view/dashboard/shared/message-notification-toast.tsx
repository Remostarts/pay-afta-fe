'use client';

import { Bell, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useMessageNotification } from '@/context/MessageNotificationProvider';
import { MessageNotification, NotificationType } from '@/types/messageNotification.type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationToastProps {
  notification: MessageNotification;
  onClose: () => void;
  index: number;
  onView: () => void;
}

export function MessageNotificationToast({ notification, onClose, index }: NotificationToastProps) {
  const { setActiveNotification, markAsRead } = useMessageNotification();

  const [isVisible, setIsVisible] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // change the timer as per the needs

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!isVisible) {
      const dismissTimer = setTimeout(() => {
        onClose();
      }, 300); // delay to allow for fade-out animation

      return () => clearTimeout(dismissTimer);
    }
  }, [isVisible, onClose]);

  const handleView = () => {
    setActiveNotification(notification);
    markAsRead(notification.id);
    if (notification.type === NotificationType.message) {
      router.push(`/dashboard/chats/${notification.actionInfo}`);
    } else {
      setActiveNotification(notification);
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 rounded-lg border bg-white p-4 pr-8 shadow-lg',
        'animate-in slide-in-from-right',
        'before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-lg before:bg-[#03045B]',
        isVisible ? 'opacity-100' : 'opacity-0 transition-opacity duration-300',
        'transform transition-transform duration-300 ease-in-out hover:scale-105'
      )}
      style={{
        zIndex: 1000 - index, // higher index, lower z-index
        transform: `translateY(-${index * 10}px)`, // stacking effect
      }}
    >
      <Button variant="ghost" size="icon" className="absolute -right-1 -top-1" onClick={onClose}>
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </Button>

      <div className="rounded-full bg-[#E9F5FB] p-2">
        <Bell className="size-4 text-[#03045B]" />
      </div>

      <div className="grid gap-1">
        <h3 className="font-semibold">
          {notification.title} {notification.emoji}
        </h3>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
      </div>
    </div>
  );
}
