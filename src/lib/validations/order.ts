import { z } from 'zod';

export const OrderProgressStatus: {
  PENDING: 'PENDING';
  AGREEMENT: 'AGREEMENT';
  PAYMENT: 'PAYMENT';
  SHIPPING: 'SHIPPING';
  DELIVERY: 'DELIVERY';
  CLOSED: 'CLOSED';
  DISPUTED: 'DISPUTED';
} = {
  PENDING: 'PENDING',
  AGREEMENT: 'AGREEMENT',
  PAYMENT: 'PAYMENT',
  SHIPPING: 'SHIPPING',
  DELIVERY: 'DELIVERY',
  CLOSED: 'CLOSED',
  DISPUTED: 'DISPUTED',
};

export const updateOrderProgressSchema = z.object({
  status: z.nativeEnum(OrderProgressStatus),
  step: z.number().int().min(1).max(5),
  notes: z.string().optional(),
});

export type UpdateOrderProgressDTO = z.infer<typeof updateOrderProgressSchema>;

export const PersonalWalletPayment = z.object({
  buyerId: z.string().min(1, 'Buyer ID is required'),
  amount: z.number().min(1, 'Amount must be at least 1'),
  sellerId: z.string().min(1, 'Seller ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  milestoneId: z.string().min(1, 'Milestone ID is required'),
});

export type TPersonalWalletPaymentInput = z.infer<typeof PersonalWalletPayment>;

export const OneTimeUseWallet = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  orderId: z.string().min(1, 'Order ID is required'),
});

export type TOneTimeUseWallet = z.infer<typeof OneTimeUseWallet>;
