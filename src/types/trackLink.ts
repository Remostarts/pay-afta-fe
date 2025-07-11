// Enums
export type TransactionType = 'CREDIT' | 'WITHDRAWAL' | 'TRACK_LINK' | 'CARD_FUNDED';
export type TransactionStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED';

// Milestone
export interface Milestone {
  id: string;
  orderId: string;
  title: string;
  amount: string; // Still a string based on the JSON you gave
  deliveryDate: string; // ISO string
  status: string;
  paymentId: string | null;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  hasInstallments: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Progress history
export interface ProgressHistory {
  id: string;
  orderId: string;
  status: string;
  step: number;
  timestamp: string;
  notes: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  paymentId: string;
  paymentInstallmentId?: string | null;
  amount: number;
  paymentMethod: string;
  transactionReference?: string | null;
  status: TransactionStatus;
  type: TransactionType;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Order
export interface TOrder {
  id: string;
  buyerId: string;
  sellerId: string;
  deliveryDate: string;
  detailAboutItem: string;
  paymentType: string;
  transactionFee: string;
  transactionType: string;
  amount: number;
  status: string;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  progressHistory: ProgressHistory[];
  milestones: Milestone[];
  Payment: Payment;
  Transaction: Transaction[];
}
