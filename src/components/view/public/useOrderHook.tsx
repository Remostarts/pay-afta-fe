'use client';

import { useState, useEffect } from 'react';
import { getSingleOrder } from '@/lib/actions/order/order.actions';
import { useGeneral } from '@/context/generalProvider';
import { toast } from 'sonner';

export interface ViewerInfo {
  viewer: 'BUYER' | 'SELLER' | 'GUEST';
  guestRole: 'BUYER' | 'SELLER' | null;
  isBuyerReal: boolean;
  isSellerReal: boolean;
  userId: string;
  latestStatus: string;
}

export const useOrder = (
  orderId: string
): {
  orderData: any;
  loading: boolean;
  error: string | null;
  viewerInfo: ViewerInfo | null;
} => {
  const { user } = useGeneral();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerInfo, setViewerInfo] = useState<ViewerInfo | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await getSingleOrder(orderId);
        const data = res?.data;
        setOrderData(data);

        const isBuyerReal = !!data.buyerId;
        const isSellerReal = !!data.sellerId;

        let viewer: 'BUYER' | 'SELLER' | 'GUEST' = 'GUEST';
        let guestRole: 'BUYER' | 'SELLER' | null = null;
        let userId = '';

        const currentUserId = user?.id || data.guestId;

        if (currentUserId === data.buyerId) viewer = 'BUYER';
        else if (currentUserId === data.sellerId) viewer = 'SELLER';
        else viewer = 'GUEST';

        // Determine guest role
        if (viewer === 'GUEST') {
          if (isBuyerReal && !isSellerReal) guestRole = 'SELLER';
          else if (!isBuyerReal && isSellerReal) guestRole = 'BUYER';
        }

        userId =
          viewer === 'BUYER' ? data.buyerId : viewer === 'SELLER' ? data.sellerId : data.guestId;

        const latestStatus =
          data.progressHistory?.length > 0
            ? data.progressHistory[data.progressHistory.length - 1].status
            : data.status;

        setViewerInfo({ viewer, guestRole, isBuyerReal, isSellerReal, userId, latestStatus });
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Failed to load order');
        toast.error(err?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user]);

  return { orderData, loading, error, viewerInfo };
};
