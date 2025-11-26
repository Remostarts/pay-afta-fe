import * as z from 'zod';

export const withdrawfundSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').trim(),
  bankCode: z
    .string()
    .min(3, 'Bank code must be at least 3 characters')
    .max(6, 'Bank code is too long')
    .trim(),
  accountNumber: z.string().regex(/^\d{10,12}$/, 'Account number must be 10–12 digits'),
  accountName: z.string().min(1, 'Account name verification is required').trim(),
  narration: z.string().optional(),
  amountWithdraw: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than zero'),
});

export type TWithdrawfund = z.infer<typeof withdrawfundSchema>;

export const transferfundSchema = z.object({
  amountWithdraw: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Amount must be greater than zero'),
  narration: z.string().optional(),
});

export type TTransferfundSchema = z.infer<typeof transferfundSchema>;
