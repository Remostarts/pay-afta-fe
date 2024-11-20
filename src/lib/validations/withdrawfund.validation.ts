import * as z from 'zod';

// Withdraw Fund schema

export const withdrawfundSchema = z.object({
  amountWithdraw: z.string().min(1, 'minimum amount should be required.'),
});

export type TWithdrawfund = z.infer<typeof withdrawfundSchema>;
