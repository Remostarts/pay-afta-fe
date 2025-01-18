import { z } from 'zod';

// dispute form schema
export const disputeFormSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
});

export type TDisputeForm = z.infer<typeof disputeFormSchema>;

export const chatMessageSchema = z.object({
  chatId: z.string({ required_error: 'chatId is required' }),
  senderId: z.string({ required_error: 'senderId is required' }),
  receiverId: z.string({ required_error: 'receiverId is required' }),
  content: z.string({ required_error: 'content is required' }),
  type: z.enum(['image', 'pdf', 'audio', 'video', 'text', 'invoice']),
  receiverEmail: z.string({ required_error: 'receiverEmail is required' }),
});

export type TChatMessage = z.infer<typeof chatMessageSchema>;
