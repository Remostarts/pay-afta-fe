// helpers/utils/stepLogic.ts

import { OrderDetails } from '@/types/order';

export const STEP_CONFIG = {
  product: ['Agreement', 'Payment', 'Shipping', 'Delivery', 'Completed'],
  service: ['Agreement', 'Payment', 'Delivery', 'Completed'],
};

// Helper function to check if both parties have confirmed agreement
const hasBothPartiesAgreed = (history?: any[]) => {
  if (!history || !Array.isArray(history)) return false;

  const buyerConfirmed = history.some((progress) => progress.status === 'BUYER_AGREED');
  const sellerConfirmed = history.some((progress) => progress.status === 'SELLER_AGREED');

  return buyerConfirmed && sellerConfirmed;
};

export function getStepByOrderType(order: OrderDetails, type: 'product' | 'service'): number {
  const status = order?.status;
  const currentStep = order?.currentStep ?? 0;
  const progressHistory = order?.progressHistory;

  switch (status) {
    case 'PENDING':
      return currentStep === 0 ? 1 : currentStep;

    case 'BUYER_AGREED':
    case 'SELLER_AGREED':
      return hasBothPartiesAgreed(progressHistory) ? 2 : 1;

    case 'PAID':
      // Product: Payment → Shipping (step 3)
      // Service: Payment → Delivery (step 3)
      // Product: Payment → Shipping (step 3), Service: Payment → Delivery (step 3)
      return 3;

    case 'SHIPPED':
      // Only applicable for products; Service skips this (stays at 3)
      return type === 'product' ? 4 : 3;

    case 'DELIVERED':
      // Product: step 5, Service: step 4
      // Product: step 5
      // Service: step 4
      return type === 'product' ? 5 : 4;

    // case 'CLOSED':
    case 'COMPLETED':
      // Product: 5 steps total
      // Service: 4 steps total
      return type === 'product' ? 5 : 4;

    case 'CANCELED':
    case 'REJECTED':
    case 'DISPUTED':
      // Terminal states - last step for both
      return type === 'product' ? 5 : 4;

    default:
      return 1;
  }
}
