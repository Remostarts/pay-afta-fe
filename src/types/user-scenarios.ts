// User Types and Scenarios for Agreement and Payment Flow

import { OrderDetails, TWalletData } from './order';

export type UserRole = 'buyer' | 'seller';

export type UserRegistrationStatus = 'registered' | 'guest';

export type UserContext = {
  id?: string;
  role: UserRole;
  registrationStatus: UserRegistrationStatus;
  name: string;
  email: string;
  phoneNumber?: string;
};

export type TransactionScenario =
  | 'REGISTERED_BUYER_TO_REGISTERED_SELLER'
  | 'REGISTERED_SELLER_TO_REGISTERED_BUYER'
  | 'REGISTERED_BUYER_TO_GUEST_SELLER'
  | 'REGISTERED_SELLER_TO_GUEST_BUYER';

export type OrderStatus =
  | 'pending_agreement'
  | 'agreement_accepted'
  | 'payment_pending'
  | 'payment_completed'
  | 'completed'
  | 'rejected';

export interface InvoiceData {
  id: string;
  issueDate: string;
  dueDate: string;
  seller: {
    name: string;
    email: string;
    id?: string;
  };
  buyer: {
    name: string;
    email: string;
    id?: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    deliveryDate: string;
    amount: number;
  }>;
  totals?: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

// Extended OrderData type that combines OrderDetails with additional properties
export interface OrderData extends OrderDetails {
  scenario: TransactionScenario;
  invoiceData: InvoiceData;
}

export interface PaymentData {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'wallet' | 'card';
  transactionId?: string;
  reference?: string;
  createdAt: string;
  completedAt?: string;
}

export type UserAction =
  | 'view_invoice'
  | 'accept_agreement'
  | 'provide_contact_details'
  | 'initiate_payment'
  | 'complete_payment'
  | 'reject_agreement';

// Scenario-specific UI configurations
export interface ScenarioConfig {
  showInvoicePreview: boolean;
  showFinalizePayment: boolean;
  showBankTransferModal: boolean;
  showAgreementButton: boolean;
  requiresContactDetails: boolean;
  userActions: UserAction[];
}

// Props for enhanced components
export interface EnhancedInvoicePreviewProps {
  orderData: OrderData | null;
  // currentUser: UserContext;
  onAccept?: () => void;
  onReject?: () => void;
  onProceedToPayment?: () => void;
}

export interface EnhancedFinalizeOrderPayProps {
  // orderData: OrderData;
  // currentUser: UserContext;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
  onAgreementAccepted?: () => void;
  oneTimeUseWallet?: TWalletData;
}

export interface EnhancedBankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderData: OrderData;
  currentUser: UserContext;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  oneTimeUseWallet?: TWalletData;
}

// Context for managing user scenarios
export interface UserScenarioContextType {
  currentUser: UserContext | null;
  orderData: OrderData | null;
  scenario: TransactionScenario | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: UserContext) => void;
  setOrderData: (order: OrderData) => void;
  refreshOrderData: () => Promise<void>;
}

// Utility functions
export const determineScenario = (
  initiator: UserContext,
  counterparty: UserContext
): TransactionScenario => {
  const initiatorKey = `${initiator.registrationStatus.toUpperCase()}_${initiator.role.toUpperCase()}`;
  const counterpartyKey = `${counterparty.registrationStatus.toUpperCase()}_${counterparty.role.toUpperCase()}`;

  return `${initiatorKey}_TO_${counterpartyKey}` as TransactionScenario;
};

export const getScenarioConfig = (scenario: TransactionScenario): ScenarioConfig => {
  const configs: Record<TransactionScenario, ScenarioConfig> = {
    REGISTERED_BUYER_TO_REGISTERED_SELLER: {
      showInvoicePreview: true,
      showFinalizePayment: false,
      showBankTransferModal: false,
      showAgreementButton: true,
      requiresContactDetails: false,
      userActions: ['view_invoice', 'accept_agreement'],
    },
    REGISTERED_SELLER_TO_REGISTERED_BUYER: {
      showInvoicePreview: true,
      showFinalizePayment: true,
      showBankTransferModal: true,
      showAgreementButton: false,
      requiresContactDetails: true,
      userActions: [
        'view_invoice',
        'provide_contact_details',
        'initiate_payment',
        'complete_payment',
      ],
    },
    REGISTERED_BUYER_TO_GUEST_SELLER: {
      showInvoicePreview: true,
      showFinalizePayment: true,
      showBankTransferModal: true,
      showAgreementButton: true,
      requiresContactDetails: false,
      userActions: ['view_invoice', 'accept_agreement'],
    },
    REGISTERED_SELLER_TO_GUEST_BUYER: {
      showInvoicePreview: true,
      showFinalizePayment: true,
      showBankTransferModal: true,
      showAgreementButton: true,
      requiresContactDetails: true,
      userActions: ['view_invoice', 'provide_contact_details', 'accept_agreement'],
    },
  };

  return configs[scenario] || configs.REGISTERED_BUYER_TO_REGISTERED_SELLER;
};
