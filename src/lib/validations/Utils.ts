import { z } from 'zod';

export const whiteListSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  // phoneNumber: z.string().min(1, 'Phone number is required'),
  // location: z.string().min(1, 'Location is required'),
});
export type TWhiteList = z.infer<typeof whiteListSchema>;
