import { z } from 'zod';

export const whiteListSchema = z.object({
  // name: z.string().min(1, 'Full name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
});
export type TWhiteList = z.infer<typeof whiteListSchema>;
