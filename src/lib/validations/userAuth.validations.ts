import * as z from 'zod';

// initial signup schema

export const initialSignUpSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one upper case letter')
      .regex(/[a-z]/, 'Password must contain at least one lower case letter')
      .regex(
        /[0-9!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one number or special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TInitialSignUp = z.infer<typeof initialSignUpSchema>;

// password schema
export const emailVerification = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({
      message: 'Invalid email format.',
    })
    .trim(),

  emailVerificationCode: z
    .string({
      required_error: 'code is required',
    })
    .trim(),
});

export type TEmailVerification = z.infer<typeof emailVerification>;

// user login schema
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type UserLoginFormData = z.infer<typeof userLoginSchema>;

// reset password schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one upper case letter')
      .regex(/[a-z]/, 'Password must contain at least one lower case letter')
      .regex(
        /[0-9!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one number or special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TResetPassword = z.infer<typeof resetPasswordSchema>;
