import * as z from 'zod';

// Withdraw Fund schema

export const withdrawfundSchema = z.object({
  bankName: z.string().min(1, 'Bank name should be required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  amountWithdraw: z.string().min(1, 'minimum amount should be required.'),
});

export type TWithdrawfund = z.infer<typeof withdrawfundSchema>;

// Transfre bank schema

export const transferfundSchema = z.object({
  amountWithdraw: z.string().min(1, 'minimum amount should be required.'),
});

export type TTransferfundSchema = z.infer<typeof transferfundSchema>;
