export type DeliveryStatus = 'accepted' | 'picked-up' | 'in-transit' | 'delivered' | 'failed';

export interface OrderData {
  id: string;
  status: DeliveryStatus;
  amount: string;
  sellerName: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress?: string;
  estimatedDelivery?: string;
}

export interface DeliveryStep {
  key: string;
  label: string;
  step: number;
}

type ProgressStep = {
  id: string;
  orderId: string;
  status: string;
  step: number;
  timestamp: string;
  notes: string;
};

type Milestone = {
  id: string;
  orderId: string;
  title: string;
  amount: string;
  deliveryDate: string;
  status: 'PENDING' | 'PAID' | 'FAILED'; // Extend if needed
  paymentId: string | null;
};

type PaymentDetails = {
  id: string;
  orderId: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  hasInstallments: boolean;
  status: 'PENDING' | 'COMPLETED' | 'FAILED'; // Extend if needed
  updatedAt: string;
  createdAt: string;
};

type Transaction = unknown; // Define when structure is known

type UserProfile = {
  firstName: string;
  lastName: string;
  username: string | null;
  id: string;
  profileImage: string | null;
  email: string;
};

type Item = {
  quantity: number;
};

export type OrderDetails = {
  id: string;
  buyerId: string;
  sellerId: string;
  deliveryDate: string;
  detailAboutItem: string;
  paymentType: string;
  transactionFee: string;
  transactionType: 'Product' | 'Services'; // Extend if needed
  amount: number;
  status: 'PENDING' | 'AGREEMENT' | 'PAYMENT' | 'SHIPPING' | 'DELIVERY' | 'CLOSED' | 'DISPUTED';
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  progressHistory: ProgressStep[];
  milestones: Milestone[];
  items: Item[];
  Payment: PaymentDetails;
  Transaction: Transaction[]; // Empty array in this case
  buyer: UserProfile;
  seller: UserProfile;
};

export type TWalletData = {
  id: string;
  walletId: string | null;
  type: 'ONE_TIME'; // could be union if more types exist
  userId: string;
  balance: string; // keeping as string since it's returned as string
  currency: string;
  isActive: boolean;
  accountName: string;
  accountNumber: string;
  bankName: string;
  referenceId: string;
  transactionId: string;
  expiredAt: string; // ISO datetime
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  orderId: string | null;
};
