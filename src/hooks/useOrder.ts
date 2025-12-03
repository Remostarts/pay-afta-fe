'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getSingleOrder, updateOrderProgress } from '@/lib/actions/order/order.actions';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { useGeneral } from '@/context/generalProvider';

export type UserRole = 'REAL_BUYER' | 'GUEST_BUYER' | 'REAL_SELLER' | 'GUEST_SELLER' | 'UNKNOWN';

export interface UseOrderReturn {
  order: any;
  loading: boolean;
  error: string | null;
  userRole: UserRole;
  userId: string;
  viewer: any;
  refreshOrder: () => Promise<void>;
  performAction: (action: string) => Promise<void>;
}

export const useOrder = (orderId: string): UseOrderReturn => {
  const { user: currentUser } = useGeneral();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('UNKNOWN');
  const [userId, setUserId] = useState<string>('');
  const [viewer, setViewer] = useState<any>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getSingleOrder(orderId);
      if (res?.success) {
        const data = res?.data;
        setOrder(data);

        let role: UserRole = 'UNKNOWN';
        let uid = '';
        let currentViewer: any = null;

        // if (!currentUser) {
        //   // Guest takes priority
        //   if (data.payBy === 'GUEST_BUYER') role = 'GUEST_BUYER';
        //   if (data.sellerType === 'GUEST') role = 'GUEST_SELLER';
        //   uid = data.guest?.id || '';
        //   currentViewer = data.guest || { role: 'Guest' };
        // } else {
        //   if (currentUser.id === data.buyerId || currentUser.id === data.sellerId) {
        //     uid = currentUser.id;
        //     currentViewer = currentUser;
        //   }

        //   if (data.payBy === 'REAL_BUYER' && currentUser.id === data.buyerId) role = 'REAL_BUYER';
        //   if (data.sellerType === 'REAL' && currentUser.id === data.sellerId) role = 'REAL_SELLER';
        // }

        if (!currentUser) {
          // No logged-in user → use guest info
          if (data.payBy === 'GUEST_BUYER') role = 'GUEST_BUYER';
          if (data.sellerType === 'GUEST') role = 'GUEST_SELLER';

          uid = data.guest?.id || '';
          currentViewer = data.guest || { role: 'Guest' };
        } else {
          // Logged-in user exists → check if they match buyer/seller
          const isBuyer = currentUser.id === data.buyerId;
          const isSeller = currentUser.id === data.sellerId;

          if (isBuyer) {
            role = 'REAL_BUYER';
            uid = currentUser.id;
            currentViewer = currentUser;
          } else if (isSeller) {
            role = 'REAL_SELLER';
            uid = currentUser.id;
            currentViewer = currentUser;
          } else {
            // Logged-in user BUT not part of this order → treat as guest
            if (data.payBy === 'GUEST_BUYER') role = 'GUEST_BUYER';
            if (data.sellerType === 'GUEST') role = 'GUEST_SELLER';

            uid = data.guest?.id || '';
            currentViewer = data.guest || { role: 'Guest' };
          }
        }

        setUserRole(role);
        setUserId(uid);
        setViewer(currentViewer);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId, currentUser]);

  const refreshOrder = async () => {
    await fetchOrder();
  };

  const performAction = async (action: string) => {
    if (!order) return;

    let status: UpdateOrderProgressDTO['status'];
    const step = (order.step || 0) + 1;

    switch (action) {
      case 'ACCEPT':
        status =
          userRole === 'REAL_BUYER' || userRole === 'GUEST_BUYER'
            ? 'BUYER_AGREED'
            : 'SELLER_AGREED';
        break;
      case 'REJECT':
        status = userRole === 'REAL_BUYER' || userRole === 'GUEST_BUYER' ? 'CANCELED' : 'REJECTED';
        break;
      case 'SHIP':
        status = 'SHIPPED';
        break;
      case 'DELIVER':
        status = 'DELIVERED';
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    try {
      const payload: UpdateOrderProgressDTO = {
        status,
        step,
        notes: `${userRole} performed ${action}`,
        userId,
      };

      const res = await updateOrderProgress(payload, order.id);
      if (!res.success) throw new Error(res.message);

      toast.success(`${action} performed successfully!`);
      await refreshOrder();

      // Redirect to payment page if buyer just accepted
      if (action === 'ACCEPT' && (userRole === 'REAL_BUYER' || userRole === 'GUEST_BUYER')) {
        if (userRole === 'REAL_BUYER') {
          router.push(`/finalize-payment?orderId=${order.id}`);
        } else if (userRole === 'GUEST_BUYER') {
          router.push(`/finalize-payment?orderId=${order.id}`);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Action failed');
    }
  };

  return { order, loading, error, userRole, userId, viewer, refreshOrder, performAction };
};
