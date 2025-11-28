export type DeliveryStatus =
  | 'ACCEPTED'
  | 'PAID'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'FAILED';

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
  description: string;
  amount: number;
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
  id: string;
  quantity: number;
  detailAboutItem: string;
  amount: number;
};

type Delivery = {
  trackingNumber: string;
  status: string;
  totalCost: number;
};

export type OrderDetails = {
  id: string;
  buyerId: string;
  sellerId: string;
  deliveryDate: string;
  detailAboutItem: string;
  paymentType: string;
  transactionFee: string;
  transactionType: 'Product' | 'Services';
  amount: number;
  status:
    | 'PENDING'
    | 'BUYER_AGREED'
    | 'SELLER_AGREED'
    | 'CANCELED'
    | 'PAID'
    | 'REJECTED'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'DISPUTED_REQUESTED'
    | 'DISPUTED';
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  escrowFee: string;
  createdBy?: string;
  progressHistory: ProgressStep[];
  milestones: Milestone[];
  items: Item[];
  delivery: Delivery;
  Payment: PaymentDetails;
  Transaction: Transaction[]; // Empty array in this case
  buyer: UserProfile;
  seller: UserProfile;
  guest: UserProfile;
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
