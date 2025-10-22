'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import {
  emailVerification,
  initialSignUpSchema,
  TInitialSignUp,
} from '@/lib/validations/userAuth.validations';
import { EmailVerificationParams, ResetPasswordParams } from '@/types/auth.type';
import { TChangePassInputs } from '@/lib/validations/setting.validation';
// import { authOptions } from '@/lib/AuthOptions';

console.log(process.env.BACKEND_URL);

export async function partialSignup(formData: TInitialSignUp) {
  const validation = initialSignUpSchema.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors += issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/create-partial-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validation.data, role: 'user' }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong!');
    }

    return data;
  } catch (error: any) {
    getErrorMessage(error.message || 'Unknown error');
    throw error;
  }
}

export async function verifyEmail(formData: EmailVerificationParams) {
  const validation = emailVerification.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/email-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function sendResetPassLink(email: string) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/send-reset-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send verification code');
    }

    return response.json();
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function resetPassword(data: ResetPasswordParams) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function changePassword(data: TChangePassInputs) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to reset password');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}
