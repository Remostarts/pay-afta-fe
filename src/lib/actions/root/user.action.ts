'use server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import { TProfileUpdate } from '@/lib/validations/setting.validation';
import { TTransferfundSchema, TWithdrawfund } from '@/lib/validations/withdrawfund.validation';

export async function userProfileUpdate(formData: TProfileUpdate) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-user-profile`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(formData),
        cache: 'no-store',
      }
    );

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 partialSignup 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}


export async function withdrawFundFromWallet(
  data:
    | TWithdrawfund
    | (TTransferfundSchema & {
        savedAccountId?: string;
        newAccount?: {
          bankName: string;
          accountNumber: string;
          bankCode?: string;
        };
        withdrawPassword: string;
      })
) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const token = session?.accessToken;

    if (!token) throw new Error('Unauthorized. Please log in again.');

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pilla/transfer-from-wallet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Withdrawal failed.');

    return result;
  } catch (error) {
    console.error('🔥 withdrawFund error:', error);
    return { success: false, message: getErrorMessage(error) };
  }
}