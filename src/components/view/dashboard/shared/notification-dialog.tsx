import { MessageNotification, NotificationType } from '@/types/messageNotification.type';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMessageNotification } from '@/context/MessageNotificationProvider';
import { MilestoneDetails } from './milestone-details';
import { WithdrawalSuccess } from './withdrawal-success';

interface NotificationDialogProps {
  notification: MessageNotification | null;
}

export function NotificationDialog({ notification }: NotificationDialogProps) {
  const { setActiveNotification } = useMessageNotification();

  return (
    <Dialog open={notification !== null} onOpenChange={() => setActiveNotification(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {notification?.title} {notification?.emoji}
          </DialogTitle>
        </DialogHeader>
        {notification && (
          <div className="mt-4">
            {notification.type === NotificationType.milestone && (
              <MilestoneDetails notification={notification} />
            )}
            {notification.type === NotificationType.withdrawalSuccess && (
              <WithdrawalSuccess notification={notification} />
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              {/* Received at: {notification?.createdAt?.toLocaleTimeString()} */}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}