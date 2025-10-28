import { z } from 'zod';

// personal kyc schema
export const personalKycSchema = z.object({
  nin: z.string().min(1, 'NIN is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.coerce.date(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  instaUsername: z.string().optional(),
  facebookUsername: z.string().optional(),
});

export type TPersonalKyc = z.infer<typeof personalKycSchema>;

// settlement kyc schema
export const settlementKycSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  bankCode: z.string().min(3, 'Bank code is required').optional().nullable(),
  accountNumber: z.string().length(10, 'account number must be 10 digit account number'),
  bvn: z.string().length(11, 'BVN must be 11 digits').optional(),
  accountHolder: z.string().optional(),
  isDefaultPayout: z.boolean().default(false).optional(),
});

export type TSettlementKyc = z.infer<typeof settlementKycSchema>;

// transactionPin schema
export const transactionPinSchema = z
  .object({
    verificationCode: z.string().min(4, 'Verification Code must be in 4 digit'),
    confirmVerificationCode: z.string(),
  })
  .refine((data) => data.verificationCode === data.confirmVerificationCode, {
    message: "Verification code don't match",
    path: ['confirmVerificationCode'],
  });

export type TTransactionPin = z.infer<typeof transactionPinSchema>;

export const pinSchema = z
  .object({
    pin: z.string().length(4, 'PIN must be 4 digits'),
    confirmPin: z.string().length(4, 'PIN must be 4 digits'),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ['confirmPin'],
  });

export type PinFormData = z.infer<typeof pinSchema>;
