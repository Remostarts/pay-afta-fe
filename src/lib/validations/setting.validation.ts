import * as z from 'zod';

// profile info schema
export const profileInformationSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  phone: z.string().min(1, 'Phone number is required.'),
  email: z.string().min(1, 'Email is required.'),
  dateOfBirth: z.union([
    z.date(), // Accepts a Date object
    z.string().min(1, 'DOB is required.'), // Accepts a non-empty string
  ]),
  gender: z.string().min(1, 'Gender is required.'),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  dateOfBirth: z.union([
    z.date(), // Accepts a Date object
    z.string().min(1, 'DOB is required.'), // Accepts a non-empty string
  ]),
  gender: z.string().min(1, 'Gender is required.'),
});

export type TProfileUpdate = z.infer<typeof profileUpdateSchema>;

export type TProfileInformation = z.infer<typeof profileInformationSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one upper case letter')
      .regex(/[a-z]/, 'Password must contain at least one lower case letter')
      .regex(
        /[0-9!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one number or special character'
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type TChangePassInputs = z.infer<typeof changePasswordSchema>;

// Change Transcation Pin schema
export const pinSchema = z
  .object({
    oldPin: z.string().length(4, 'PIN must be 4 digits'),
    pin: z.string().length(4, 'PIN must be 4 digits'),
    confirmPin: z.string().length(4, 'PIN must be 4 digits'),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ['confirmPin'],
  });

export type PinFormData = z.infer<typeof pinSchema>;
