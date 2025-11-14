'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import { createOrderZodSchema, TCreateOrderInput } from '@/lib/validations/newOrder.validation';
import {
  assignDeliveryPartnerSchema,
  OneTimeUseWallet,
  PersonalWalletPayment,
  TAssignDeliveryPartnerInput,
  TOneTimeUseWallet,
  TPersonalWalletPaymentInput,
  UpdateOrderProgressDTO,
  updateOrderProgressSchema,
} from '@/lib/validations/order';

export async function createOrder(formData: TCreateOrderInput) {
  const validation = createOrderZodSchema.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ ...validation.data, role: 'user' }),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 createOrder 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function getSingleOrder(id: string) {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/order/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 getSingleOrder 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function getAllOrdersByUser(page: number) {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/order/get-by-user?page=${page}&limit=8`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        cache: 'no-store',
      }
    );

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 getOrder 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function updateOrderProgress(formData: UpdateOrderProgressDTO, id: string) {
  const validation = updateOrderProgressSchema.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/order/update-progress/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(validation.data),
      cache: 'no-store',
    });

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 updateOrderProgress 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function makeWalletPayment(formData: TPersonalWalletPaymentInput) {
  const validation = PersonalWalletPayment.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/pilla/payment`, {
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
    console.log('🌼 🔥🔥 makeWalletPayment 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function createOneTimeUseWallet(formData: TOneTimeUseWallet) {
  const validation = OneTimeUseWallet.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors = zodErrors + issue.path[0] + ':' + issue.message + '.';
    });
    throw new Error(zodErrors);
  }

  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/pilla/one-time-use`, {
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
    console.log('🌼 🔥🔥 makeWalletPayment 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function getUnassignOrdersAndStatsByUser(page: number) {
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/order/get-seller-service?page=${page}&limit=8`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        cache: 'no-store',
      }
    );

    return response.json();
  } catch (error) {
    console.log('🌼 🔥🔥 seller unassigned service order 🔥🔥 error🌼', error);

    getErrorMessage(error);
  }
}

export async function assignDeliveryPartner(formData: TAssignDeliveryPartnerInput) {
  // Validate with Zod
  const validation = assignDeliveryPartnerSchema.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors += `${issue.path[0]}: ${issue.message}. `;
    });
    throw new Error(zodErrors);
  }

  // Get session token
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/order/assign-delivery-partner`, {
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
    console.error('🌼 🔥🔥 assignDeliveryPartner 🔥🔥 error 🌼', error);
    getErrorMessage(error);
  }
}

export async function reAssignDeliveryPartner(formData: TAssignDeliveryPartnerInput) {
  // Validate with Zod
  const validation = assignDeliveryPartnerSchema.safeParse(formData);

  if (!validation.success) {
    let zodErrors = '';
    validation.error.issues.forEach((issue) => {
      zodErrors += `${issue.path[0]}: ${issue.message}. `;
    });
    throw new Error(zodErrors);
  }

  // Get session token
  const session = (await getServerSession(authOptions)) as any;
  const token = session?.accessToken;

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/order/assign-delivery-partner`, {
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
    console.error('🌼 🔥🔥 assignDeliveryPartner 🔥🔥 error 🌼', error);
    getErrorMessage(error);
  }
}
