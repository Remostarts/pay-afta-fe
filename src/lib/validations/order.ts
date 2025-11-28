import { z } from 'zod';

export const OrderProgressStatus: {
  CANCELED: 'CANCELED';
  BUYER_AGREED: 'BUYER_AGREED';
  SELLER_AGREED: 'SELLER_AGREED';
  REJECTED: 'REJECTED';
  SHIPPED: 'SHIPPED';
  DELIVERED: 'DELIVERED';
  COMPLETED: 'COMPLETED';
  DISPUTED_REQUESTED: 'DISPUTED_REQUESTED';
  DISPUTED: 'DISPUTED';
} = {
  CANCELED: 'CANCELED',
  BUYER_AGREED: 'BUYER_AGREED',
  SELLER_AGREED: 'SELLER_AGREED',
  REJECTED: 'REJECTED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  DISPUTED_REQUESTED: 'DISPUTED_REQUESTED',
  DISPUTED: 'DISPUTED',
};

export const updateOrderProgressSchema = z.object({
  status: z.nativeEnum(OrderProgressStatus),
  step: z.number().int().min(1),
  notes: z.string().optional(),
  userId: z.string().optional(),
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
  userId: z.string().min(1, 'user ID is required'),
});

export type TOneTimeUseWallet = z.infer<typeof OneTimeUseWallet>;

// assign delivery
export const DeliveryPickupTypeEnum = z.enum(['SELLER_DOOR', 'SELLER_DROP_OFF']);

// Assign Delivery Partner Schema
export const assignDeliveryPartnerSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  logisticId: z.string().min(1, 'Logistic ID is required'),
  pickupAddress: z.string().min(1, 'Pickup address is required'),
  dropoffAddress: z.string().min(1, 'Dropoff address is required'),
  distanceInMiles: z.number().min(0, 'Distance in miles must be a positive number'),
  pickupType: DeliveryPickupTypeEnum,
});

export type TAssignDeliveryPartnerInput = z.infer<typeof assignDeliveryPartnerSchema>;

// Edit Order validation schema
export const editOrderSchema = z.object({
  transactionType: z.enum(['Product', 'Services']),
  detailAboutItem: z.string().min(1, 'Item details are required'),
  paymentType: z.enum(['One time Payment', 'Milestone Payment']),
  transactionFee: z.enum([
    'I will pay for the transaction',
    'Seller pays for the transaction fee',
    'Both Parties Pay (50/50)',
  ]),
  deliveryDate: z.date().optional(),
  invoiceDate: z.date().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        price: z.string().min(1, 'Item price is required'),
        quantity: z.string().min(1, 'Item quantity is required'),
      })
    )
    .min(1, 'At least one item is required'),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1, 'Milestone title is required'),
        amount: z.string().min(1, 'Milestone amount is required'),
        deliveryDate: z.date(),
      })
    )
    .optional(),
});

export type TEditOrderInput = z.infer<typeof editOrderSchema>;

// Order rejection validation schema
export const rejectOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  // rejectionReason: z.enum(
  //   [
  //     'Payment Issue',
  //     'Product/Service Quality',
  //     'Delivery Issues',
  //     'Miscommunication',
  //     'Item Not as Described',
  //     'Price Dispute',
  //     'Timeline Issues',
  //     'Buyer/Seller Unresponsive',
  //     'Fraud/Security Concerns',
  //     'Other',
  //   ],
  //   {
  //     errorMap: () => ({ message: 'Please select a rejection reason' }),
  //   }
  // ),
  rejectionComments: z.string().min(10, 'Please provide detailed comments (minimum 10 characters)'),
  resolutionDetails: z.string().optional(),
  contactPreference: z
    .enum(['Email', 'Phone', 'Platform Messages'], {
      errorMap: () => ({ message: 'Please select your preferred contact method' }),
    })
    .optional(),
});

export type TRejectOrderInput = z.infer<typeof rejectOrderSchema>;
