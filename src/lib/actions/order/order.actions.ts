'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import { createOrderZodSchema, TCreateOrderInput } from '@/lib/validations/newOrder.validation';
// import { authOptions } from '@/lib/AuthOptions';

console.log(process.env.BACKEND_URL);

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
