'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import {
  personalKycSchema,
  PinFormData,
  pinSchema,
  settlementKycSchema,
  TPersonalKyc,
  TSettlementKyc,
} from '@/lib/validations/onboarding.validation';

console.log(process.env.BACKEND_URL);

export async function kycPersonalInfo(formData: TPersonalKyc) {
  const validation = personalKycSchema.safeParse(formData);
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;
  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/kyc-personal-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ ...validation.data }),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 kycPersonalInfo 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}
export async function kycBankInfo(formData: TSettlementKyc) {
  const validation = settlementKycSchema.safeParse(formData);
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;
  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/kyc-bank-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ ...validation.data }),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 kycBankInfo 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}
export async function kycPin(formData: PinFormData) {
  const validation = pinSchema.safeParse(formData);
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;
  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/kyc-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ ...validation.data }),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 kycPin 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function usernameValidityCheck(username: string) {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/username-validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ username }),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 checkUsername 🔥🔥 error🌼', error);
    getErrorMessage(error);
  }
}
