import * as z from 'zod';

// initial contactusSchema
export const contactusSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  fullName: z.string().min(1, 'First name is required'),
  email: z.string().min(1, 'Email is required'),
});

export type TContactusSchema = z.infer<typeof contactusSchema>;
