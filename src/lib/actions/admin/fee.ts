import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import {
  createFeeRateZod,
  TCreateFeeRate,
  TUpdateFeeRate,
  updateFeeRateZod,
} from '@/lib/validations/fee.validation';

// Create Fee Rate
export async function createFeeRate(formData: TCreateFeeRate) {
  const validation = createFeeRateZod.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors += `${issue.path[0]}: ${issue.message}. `;
    });
    throw new Error(zodErrors);
  }

  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/fee/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(validation.data),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 createFeeRate 🔥🔥 error 🌼', error);
    getErrorMessage(error);
  }
}

// Update Fee Rate
export async function updateFeeRate(formData: TUpdateFeeRate, id: string) {
  const validation = updateFeeRateZod.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors += `${issue.path[0]}: ${issue.message}. `;
    });
    throw new Error(zodErrors);
  }

  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/fee/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(validation.data),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 updateFeeRate 🔥🔥 error 🌼', error);
    getErrorMessage(error);
  }
}

// List Fee Rates
export async function listFeeRates() {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/fee/list`, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 listFeeRates 🔥🔥 error 🌼', error);
    getErrorMessage(error);
  }
}

// Delete Fee Rate
export async function deleteFeeRate(id: string) {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/fee/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 deleteFeeRate 🔥🔥 error 🌼', error);
    getErrorMessage(error);
  }
}
