import { Badge, Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MessageNotification, NotificationType } from '@/types/messageNotification.type';
import { useMessageNotification } from '@/context/MessageNotificationProvider';

interface NotificationListProps {
  notifications: MessageNotification[];
  onView: (Notification: MessageNotification) => void;
}

export default function NotificationList({ notifications, onView }: NotificationListProps) {
  const { markAsRead } = useMessageNotification();

  // Helper function to format date
  function formatDate(date: Date): string {
    const now = new Date();
    const parsedDate = new Date(date);
    const diff = now.getTime() - parsedDate?.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  const getBadgeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.alert:
        return 'bg-red-500';
      case NotificationType.payment:
      case NotificationType.withdrawalSuccess:
        return 'bg-green-500';
      case NotificationType.milestone:
        return 'bg-blue-500';
      case NotificationType.invoiceRejected:
        return 'bg-red-500';
      default:
        return 'bg-primary-500';
    }
  };

  const handleReadNotification = (id: string) => {
    markAsRead(id);
    // Removed API call - now just updates local state
    console.log('Notification marked as read locally:', id);
  };

  return (
    <div className="max-h-[300px] overflow-auto p-0">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center justify-between gap-4 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50"
        >
          <div className="flex items-center space-x-4">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#E9F5FB]">
              <Bell className="size-4 text-[#03045B]" />
            </div>
            <div>
              <h3 className="text-sm font-medium">{notification.title}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(notification.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getBadgeColor(notification.type)} text-white`}>
              {notification.type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onView(notification);
                handleReadNotification(notification.id);
              }}
            >
              {notification.type === NotificationType.message ? 'View Chat' : 'View'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
