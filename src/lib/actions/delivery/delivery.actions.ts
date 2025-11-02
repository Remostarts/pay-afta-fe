'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/AuthOptions';
import { getErrorMessage } from '@/lib/responseError';
import {
  DeliveryProgressStatusValidation,
  UpdateDeliveryPayload,
} from '@/lib/validations/delivery.validation';

/**
 * Get all verified logistic partners (for user/admin)
 */
console.log(process.env.BACKEND_URL);
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

/**
 * Get all requested deliveries for logistic (status = REQUESTED)
 */

export async function getRequestedDeliveries() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;
    if (!token) throw new Error('Unauthorized: No access token found.');

    const response = await fetch(`${process.env.BACKEND_URL}/delivery/requested-deliveries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requested deliveries');
    }

    return await response.json();
  } catch (error) {
    console.error('🔥 getRequestedDeliveries error:', error);
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Get all active/accepted deliveries for logistic
 * (status = APPROVED, PICKED_UP, IN_TRANSIT)
 */
export async function getActiveDeliveries() {
  try {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;
    // if (!token) throw new Error('Unauthorized: No access token found.');

    const response = await fetch(`${process.env.BACKEND_URL}/delivery/active-deliveries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch active deliveries');
    }

    return await response.json();
  } catch (error) {
    console.error('🔥 getActiveDeliveries error:', error);
    throw new Error(getErrorMessage(error));
  }
}

/**
 *  Get single delivery detail with timeline (for logistic)
 */
export async function getDeliveryDetail(deliveryId: string) {
  try {
    if (!deliveryId) throw new Error('Delivery ID is required');

    const session = await getServerSession(authOptions);
    const token = (session as any)?.accessToken;
    if (!token) throw new Error('Unauthorized: No access token found.');

    const response = await fetch(
      `${process.env.BACKEND_URL}/delivery/delivery-detail/${deliveryId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch delivery detail');
    }

    return await response.json();
  } catch (error) {
    console.error('🔥 getDeliveryDetail error:', error);
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Update delivery progress/status
 */
export async function updateDeliveryProgressStatus(
  payload: UpdateDeliveryPayload,
  deliveryId: string
) {
  console.log('🌼 🔥🔥 updateDeliveryProgressStatus 🔥🔥 payload🌼', payload);

  try {
    // Validate action (status)
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
