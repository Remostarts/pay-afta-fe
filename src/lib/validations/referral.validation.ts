import { z } from 'zod';

// Referral Form Schema with all mandatory fields
export const referralSchema = z.object({
  // Referee Details
  refereeName: z.string().min(2, 'Referee full name must be at least 2 characters'),
  refereeEmail: z.string().email('Invalid email address'),
  refereeCurrentCompany: z.string().min(2, 'Current company is required'),

  // Referral Context
  referralSource: z.string().min(1, 'Referral source is required'),
  referralDate: z.coerce.date(),

  // Additional Context
  referralReason: z
    .string()
    .min(20, 'Please provide a detailed reason for this referral (minimum 20 characters)'),
  additionalComments: z.string().optional(),
});

export type TReferralSchema = z.infer<typeof referralSchema>;

// Default values for the form
export const referralDefaultValues: Partial<TReferralSchema> = {
  refereeCurrentCompany: '',
  referralSource: '',
  referralDate: new Date(),
  referralReason: '',
  additionalComments: '',
};
