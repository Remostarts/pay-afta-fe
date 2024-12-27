export type MessageStatusType = 'sent' | 'delivered' | 'read' | 'sending' | 'pending' | 'paid';

type File = {
  id: string;
  createdAt: string;
  size: number;
  url: string;
  type: string;
  name: string;
};

type Installment = {
  id: string;
  amount: number;
  isPaid: boolean;
  dueDate: string; // ISO date string
};

type User = {
  id: string;
  fullName: string;
};

export type Invoice = {
  id: string;
  amount: number;
  numOfInstallment: number;
  numOfInstallmentPaid: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  lawyer: User;
  client: User;
  installments: Installment[];
  status: 'paid' | 'pending' | 'unpaid'; // Enum for status
};

export interface Message {
  id: string;
  type: 'text' | 'pdf' | 'audio' | 'video' | 'image' | 'invoice';
  content?: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  audioUrl?: string;
  pages?: number;
  duration?: string;
  status: MessageStatusType;
  file?: File; // Adjust if other types exist
  invoice?: Invoice;
  createdAt?: string; // ISO Date String
  senderId: string;
  chatId?: string;
  read?: string;
}

type Lawyer = {
  id?: string;
  fee?: number;
};

type Participant = {
  id: string;
  fullName: string;
  email: string;
  lawyer: Lawyer;
};

export type Chat = {
  id: string;
  name: string;
  participants: Participant[];
  status: 'active' | 'completed' | 'canceled'; // Assuming "Inactive" as another possible status
  messages: Message[];
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};

export interface MediaItems {
  id: string;
  type: 'image' | 'video' | 'audio' | 'pdf';
  url: string;
}
