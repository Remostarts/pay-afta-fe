'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import {
  DeliveryProgressStatusValidation,
  UpdateDeliveryProgressPayload,
} from '@/lib/validations/delivery.validation';

export async function getAllDeliverPartners() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;
    if (!token) throw new Error('Unauthorized: No access token found.');

    const response = await fetch(`${process.env.BACKEND_URL}/delivery/logistic-partners`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch delivery partners');
    }

    return await response.json();
  } catch (error) {
    console.error('🔥 getAllDeliverPartners error:', error);
    throw new Error(getErrorMessage(error));
  }
}

export async function updateDeliveryProgressStatus(
  payload: UpdateDeliveryProgressPayload,
  deliveryId: string
) {
  try {
    //  Validate action (status)
    const validation = DeliveryProgressStatusValidation.safeParse(payload.action);
    if (!validation.success) {
      throw new Error('Invalid delivery action/status');
    }

    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;
    if (!token) throw new Error('Unauthorized: No access token found.');

    const response = await fetch(
      `${process.env.BACKEND_URL}/delivery/update-delivery-progress/${deliveryId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update delivery progress');
    }

    return await response.json();
  } catch (error) {
    console.error('🔥 updateDeliveryProgressStatus error:', error);
    throw new Error(getErrorMessage(error));
  }
}
