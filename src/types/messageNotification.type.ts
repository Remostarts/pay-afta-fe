/* eslint-disable no-unused-vars */
export enum NotificationType {
  general = 'general',
  message = 'message',
  system = 'system',
  alert = 'alert',
  payment = 'payment',
  invoice = 'invoice',
  admin = 'admin',
  invoiceRejected = 'invoiceRejected',
  milestone = 'milestone',
  withdrawalSuccess = 'withdrawalSuccess',
}

export interface User {
  id: string;
  // Add other user fields as needed
}
export interface MessageNotification {
  id: string;
  title: string;
  message: string;
  email: string;
  isRead: boolean;
  createdAt: Date;
  type: NotificationType;
  updatedAt: Date;
  userId: string;
  actionInfo?: string;
  user: User;
  emoji?: string;
  status?: string;
  statusColor?: string;
  chatId?: string; // Add this field
}

export interface MessageNotificationContextType {
  notifications: MessageNotification[];
  activeNotification: MessageNotification | null;
  addNotification: (
    notification: Omit<MessageNotification, 'id' | 'createdAt' | 'updatedAt' | 'isRead'>
  ) => void;
  removeNotification: (id: string) => void;
  setActiveNotification: (notification: MessageNotification | null) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}
