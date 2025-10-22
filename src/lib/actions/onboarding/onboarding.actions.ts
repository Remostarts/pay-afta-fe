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

export async function getPillaBanks() {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  if (!token) throw new Error('No access token found');

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/pilla/banks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: token },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error('🌼 🔥🔥 banks 🔥🔥 error🌼', error);
    throw error;
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

export async function addSettlementBankAccount(formData: TSettlementKyc) {
  const validation = settlementKycSchema.safeParse(formData);
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  if (!validation.success) {
    const errors = validation.error.issues
      .map((issue) => `${issue.path[0]}: ${issue.message}`)
      .join('. ');
    throw new Error(errors);
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/settlement-bank-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(validation.data),
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    getErrorMessage(error);
  }
}

export async function setDefaultBankAccount(accountId: string) {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  if (!accountId) {
    throw new Error('Account ID is required');
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/bank-set-default/${accountId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update default bank account');
    }

    return await response.json();
  } catch (error) {
    console.error('🔥 Error setting default bank account:', error);
    throw error;
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
