'use server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import { TProfileUpdate } from '@/lib/validations/setting.validation';

export async function userProfileUpdate(formData: TProfileUpdate) {
  console.log('🌼 🔥🔥 businessProfileUpdate 🔥🔥 formData🌼', formData);

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
