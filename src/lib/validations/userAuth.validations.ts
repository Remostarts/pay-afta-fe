import * as z from 'zod';

// select user category
export const userCategorySchema = z.object({
  selectedOption: z.enum(['user', 'logisticsUser'], {
    required_error: 'Please Select an option',
  }),
});

export type IUserCategory = z.infer<typeof userCategorySchema>;

// initial signup for logistic
export const initialSignUpForLogisticSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    email: z.string().min(1, 'Email is required'),
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

export type TInitialSignUpForLogistic = z.infer<typeof initialSignUpForLogisticSchema>;

// initial signup schema
export const initialSignUpSchema = z
  .object({
    // companyName: z.string().optional(),
    email: z.string().min(1, 'Email is required'),
    referral: z.string().optional(),
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
