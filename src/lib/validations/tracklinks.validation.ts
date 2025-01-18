import { z } from 'zod';

// raise dispute schema
export const raiseDisputeSchema = z.object({
  reasonOfDispute: z.string().min(1, 'Select an option'),
  describeYourExperience: z.string().min(1, 'Discribe Your Experience'),
  uploadFile: z.string().optional(),
});

export type TRaiseDisputeSchema = z.infer<typeof raiseDisputeSchema>;

// request refund schema
export const requestRefundSchema = z.object({
  reasonOfDispute: z.string().min(1, 'Select an option'),
  describeYourExperience: z.string().min(1, 'Discribe Your Experience'),
});

export type TRequestRefundSchema = z.infer<typeof requestRefundSchema>;
