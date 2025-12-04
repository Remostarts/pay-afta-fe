import { z } from 'zod';

// Enums
export const FeeTransactionTypeEnum = z.enum([
  'invoice',
  'transfer',
  'payment',
  'withdrawal',
  'airtime',
]);
export const FeeTypeEnum = z.enum(['percentage', 'flat']);

// Create FeeRate schema
export const createFeeRateZod = z.object({
  title: z.string().min(1, 'Title is required'),
  country: z.string().optional(),
  currencyCode: z.string().optional(),
  currencySymbol: z.string().optional(),
  minAmount: z.number().min(0, 'Minimum amount cannot be negative').optional().default(0),
  maxAmount: z.number().optional(),
  transactionType: FeeTransactionTypeEnum,
  feeType: FeeTypeEnum,
  value: z.number().min(0, 'Fee value must be at least 0'),
  isActive: z.boolean().optional().default(true),
});

// Update FeeRate schema
export const updateFeeRateZod = z.object({
  id: z.string().uuid('Invalid FeeRate ID'),
  title: z.string().min(1, 'Title is required').optional(),
  country: z.string().optional(),
  currencyCode: z.string().optional(),
  currencySymbol: z.string().optional(),
  minAmount: z.number().min(0, 'Minimum amount cannot be negative').optional(),
  maxAmount: z.number().optional(),
  transactionType: FeeTransactionTypeEnum.optional(),
  feeType: FeeTypeEnum.optional(),
  value: z.number().min(0, 'Fee value must be at least 0').optional(),
  isActive: z.boolean().optional(),
});

// TypeScript types
export type TCreateFeeRate = z.infer<typeof createFeeRateZod>;
export type TUpdateFeeRate = z.infer<typeof updateFeeRateZod>;
