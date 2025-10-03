// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { QueryFunctionContext, useQuery } from '@tanstack/react-query';

// import { MessageNotificationToast } from './message-notification-toast';
// import { NotificationDialog } from './notification-dialog';

// import { useMessageNotification } from '@/context/MessageNotificationProvider';
// import { MessageNotification, NotificationType } from '@/types/messageNotification.type';
// import { useGeneral } from '@/context/generalProvider';
// import { useSocket } from '@/context/socketProvider';
// import { useChats } from '@/context/ChatListProvider';
// // import { useSocket } from '@/context/socketProvider';

// const SAMPLE_NOTIFICATIONS: MessageNotification[] = [
//   {
//     id: '1',
//     title: 'Invoice Generated',
//     message: 'A new invoice has been generated for your recent order.',
//     email: 'user@example.com',
//     type: NotificationType.invoice,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '📄',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '2',
//     title: 'General Notification',
//     message: 'This is a general notification.',
//     email: 'user@example.com',
//     type: NotificationType.general,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '📢',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '3',
//     title: 'New Message',
//     message: 'You have received a new message.',
//     email: 'user@example.com',
//     type: NotificationType.message,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '💬',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '4',
//     title: 'System Update',
//     message: 'System maintenance scheduled for tonight.',
//     email: 'user@example.com',
//     type: NotificationType.system,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '🖥️',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '5',
//     title: 'Alert!',
//     message: 'Unusual activity detected on your account.',
//     email: 'user@example.com',
//     type: NotificationType.alert,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '🚨',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '6',
//     title: 'Payment Received',
//     message: 'You have received a payment of $100.',
//     email: 'user@example.com',
//     type: NotificationType.payment,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '💰',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },

//   {
//     id: '7',
//     title: 'Admin Notice',
//     message: 'Please update your profile information.',
//     email: 'user@example.com',
//     type: NotificationType.admin,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '👑',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '8',
//     title: 'Invoice Rejected',
//     message: 'Your invoice has been rejected. Please address the issues and resubmit.',
//     email: 'user@example.com',
//     type: NotificationType.invoiceRejected,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '❌',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '9',
//     title: 'Milestone Reached',
//     message: 'Congratulations! You have reached a project milestone.',
//     email: 'user@example.com',
//     type: NotificationType.milestone,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '🏆',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     id: '10',
//     title: 'Withdrawal Success',
//     message: 'Your withdrawal has been processed successfully.',
//     email: 'user@example.com',
//     type: NotificationType.withdrawalSuccess,
//     userId: 'user-123',
//     user: { id: 'user-123' },
//     emoji: '💸',
//     chatId: 'chat-123',
//     isRead: false,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// type QueryKey = [string, string | undefined];

// const fetchChatById = async ({
//   queryKey,
// }: QueryFunctionContext<QueryKey>): Promise<MessageNotification[]> => {
//   const [, accessToken] = queryKey;

//   if (!accessToken) {
//     throw new Error('Missing accessToken');
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/get-by-user-id`,
//     {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: accessToken,
//       },
//       cache: 'no-store',
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Error fetching notifications`);
//   }

//   const data = await response.json();
//   console.log('🤔🤔🤔🤔 notification data🌼', data);

//   return data?.data; // Ensure you return the correct data type
// };

// export function MessageNotificationManager() {
//   const { notifications, activeNotification, addNotification, setActiveNotification, markAsRead } =
//     useMessageNotification();
//   const { socket } = useSocket();

//   const [visibleNotifications, setVisibleNotifications] = useState<MessageNotification[]>([]);

//   const router = useRouter();
//   // const { socket } = useSocket();

//   const { session } = useChats();

//   const {
//     data: notificationsData = [] as MessageNotification[],

//     /* error,
//     isFetching, */
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ['notification', session?.accessToken as string],
//     queryFn: fetchChatById,
//     refetchOnWindowFocus: false,
//   });
//   console.log(
//     '🌼 🙄🙄🙄🙄🙄🙄🙄 MessageNotificationManager 🔥🔥 notificationsData🌼',
//     notificationsData
//   );

//   useEffect(() => {
//     if (notificationsData) {
//       notificationsData.forEach((notification) => {
//         addNotification(notification);
//       });
//     }
//   }, [notificationsData]);

//   const HARD_CODED_CHAT_ID = 'a330320d-8a32-4cb5-a5f9-a8cdf7b02739'; //  remove this. it is only for testing purpose

//   const { invoiceId, setInvoiceId } = useGeneral();

//   useEffect(() => {
//     if (socket) {
//       // Add event listeners
//       const handleReceiveResponse = (message: unknown) => {
//         console.log('🌼 🔥🔥 receive_response 🔥🔥 message🌼', message);
//         addNotification(message as MessageNotification);
//       };

//       socket.on('notification', handleReceiveResponse);

//       // Cleanup event listeners when component unmounts or socket changes
//       return () => {
//         socket.off('notification');
//       };
//     }
//   }, [socket]);

//   const handleReadNotification = async (id: string) => {
//     markAsRead(id);
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/update?id=${id}`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: session?.accessToken,
//         },
//         cache: 'no-store',
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Error updating notification status`);
//     }

//     const data = await response.json();
//     // refetch();
//     console.log('🤔🤔🤔🤔 notification data🌼', data);
//   };

//   //  useEffect(() => {
//   //    // Show a new notification every 1 seconds
//   //    const interval = setInterval(() => {
//   //      const randomNotification =
//   //        SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];
//   //      addNotification(randomNotification);
//   //    }, 5000);
//   //
//   //    // Show initial notification
//   //    addNotification(SAMPLE_NOTIFICATIONS[0]);
//   //
//   //    // Clearing interval on unmount
//   //    return () => clearInterval(interval);
//   //  }, [addNotification]);
//   const dismissToast = (id: string) => {
//     setVisibleNotifications((prev) => prev.filter((notification) => notification.id !== id));
//   };

//   // useEffect(() => {
//   //   // Show a new notification every 1 seconds
//   //   const interval = setInterval(() => {
//   //     const randomNotification =
//   //       SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];

//   //     addNotification(randomNotification);
//   //     const newNotification = randomNotification;

//   //     setVisibleNotifications((prev) => [...prev, newNotification] as MessageNotification[]);
//   //   }, 10000);

//   //   addNotification(SAMPLE_NOTIFICATIONS[0]);
//   //   const initialNotification = SAMPLE_NOTIFICATIONS[0];

//   //   setVisibleNotifications([initialNotification]);

//   //   // Clearing interval on unmount
//   //   return () => clearInterval(interval);
//   // }, [addNotification]);

//   // useEffect(() => {
//   //   if (socket) {
//   //     // Add event listeners
//   //     const handleInvoiceRejected = (message: { rejectReason: string; chatId: string }) => {
//   //       console.log('🌼 🔥🔥 handleReceiveSeenStatus 🔥🔥 message🌼', message);
//   //       addNotification({
//   //         title: 'Invoice Rejected',
//   //         message: message?.rejectReason,
//   //         emoji: '📝',
//   //         type: 'invoiceRejected',
//   //         chatId: message.chatId,
//   //       });
//   //     };

//   //     socket.on('invoiceRejected', handleInvoiceRejected);

//   //     // Cleanup event listeners when component unmounts or socket changes
//   //     return () => {
//   //       socket.off('invoiceRejected');
//   //     };
//   //   }
//   // }, [addNotification, socket]);

//   // useEffect(() => {
//   //   if (socket) {
//   //     // Add event listeners
//   //     const handleMessage = (message: { message: string }) => {
//   //       addNotification({
//   //         title: 'Socket Error',
//   //         message: message?.message,
//   //         emoji: '📝',
//   //         type: 'error',
//   //       });
//   //     };
//   //     console.log('🌼 🔥🔥 handleMessage 🔥🔥 handleMessage🌼', handleMessage);

//   //     socket.on('error', handleMessage);

//   //     // Cleanup event listeners when component unmounts or socket changes
//   //     return () => {
//   //       socket.off('error');
//   //     };
//   //   }
//   // }, [addNotification, socket]);

//   return (
//     <>
//       <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
//         {notifications
//           .filter((notification) => !notification.isRead)
//           .map((notification) => (
//             <MessageNotificationToast
//               key={notification.id}
//               index={5}
//               notification={notification}
//               onClose={() => handleReadNotification(notification.id)}
//               onView={() => {
//                 markAsRead(notification.id);
//                 if (notification.type === NotificationType.message) {
//                   router.push(`/dashboard/chats/${HARD_CODED_CHAT_ID}`); // change with original chatid
//                 } else if (notification.type === NotificationType.invoice) {
//                   router.push(`/dashboard/chats/${HARD_CODED_CHAT_ID}`); // change with original chatid
//                   setInvoiceId('267494b5-f594-46eb-b312-57302e8351d0'); // change with original dynamic invoiceId this is only for testing purpose.
//                   open('invoice');
//                 } else {
//                   setActiveNotification(notification);
//                 }
//               }}
//             />
//           ))}
//       </div>

//       {activeNotification &&
//         activeNotification.type !== NotificationType.message &&
//         activeNotification.type !== NotificationType.invoice && (
//           <NotificationDialog notification={activeNotification} />
//         )}
//     </>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { MessageNotificationToast } from './message-notification-toast';
import { NotificationDialog } from './notification-dialog';

import { useMessageNotification } from '@/context/MessageNotificationProvider';
import { MessageNotification, NotificationType } from '@/types/messageNotification.type';
import { useSocket } from '@/context/socketProvider';

// Dummy data instead of API calls
const DUMMY_NOTIFICATIONS: MessageNotification[] = [
  {
    id: '1',
    title: 'General Notification',
    message: 'This is a general notification.',
    email: 'user@example.com',
    type: NotificationType.general,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '📢',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    updatedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '2',
    title: 'New Message',
    message: 'You have received a new message.',
    email: 'user@example.com',
    type: NotificationType.message,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '💬',
    chatId: 'chat-123',
    actionInfo: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: '3',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight.',
    email: 'user@example.com',
    type: NotificationType.system,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '🖥️',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '4',
    title: 'Alert!',
    message: 'Unusual activity detected on your account.',
    email: 'user@example.com',
    type: NotificationType.alert,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '🚨',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: '5',
    title: 'Payment Received',
    message: 'You have received a payment of $100.',
    email: 'user@example.com',
    type: NotificationType.payment,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '💰',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 3600000), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 3600000),
  },
  {
    id: '6',
    title: 'Admin Notice',
    message: 'Please update your profile information.',
    email: 'user@example.com',
    type: NotificationType.admin,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '👑',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 86400000),
  },
  {
    id: '7',
    title: 'Milestone Reached',
    message: 'Congratulations! You have reached a project milestone.',
    email: 'user@example.com',
    type: NotificationType.milestone,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '🏆',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: '8',
    title: 'Withdrawal Success',
    message: 'Your withdrawal has been processed successfully.',
    email: 'user@example.com',
    type: NotificationType.withdrawalSuccess,
    userId: 'user-123',
    user: { id: 'user-123' },
    emoji: '💸',
    chatId: 'chat-123',
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 86400000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 86400000),
  },
];

export function MessageNotificationManager() {
  const { notifications, activeNotification, addNotification, setActiveNotification, markAsRead } =
    useMessageNotification();
  const { socket } = useSocket();

  const router = useRouter();

  // Load dummy data on mount
  useEffect(() => {
    DUMMY_NOTIFICATIONS.forEach((notification) => {
      addNotification(notification);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      // Add event listeners
      const handleReceiveResponse = (message: unknown) => {
        console.log('🌼 🔥🔥 receive_response 🔥🔥 message🌼', message);
        addNotification(message as MessageNotification);
      };

      socket.on('notification', handleReceiveResponse);

      // Cleanup event listeners when component unmounts or socket changes
      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  const handleReadNotification = (id: string) => {
    markAsRead(id);
    // Removed API call - now just updates local state
    console.log('Notification marked as read locally:', id);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifications
          .filter((notification) => !notification.isRead)
          .map((notification) => (
            <MessageNotificationToast
              key={notification.id}
              index={5}
              notification={notification}
              onClose={() => handleReadNotification(notification.id)}
              onView={() => {
                markAsRead(notification.id);
                if (notification.type === NotificationType.message) {
                  router.push(`/dashboard/chats/${notification.actionInfo}`);
                } else {
                  setActiveNotification(notification);
                }
              }}
            />
          ))}
      </div>

      {activeNotification && activeNotification.type !== NotificationType.message && (
        <NotificationDialog notification={activeNotification} />
      )}
    </>
  );
}
