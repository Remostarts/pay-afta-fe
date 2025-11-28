'use client';
import React, { useState } from 'react';
import { OrderDetails } from '@/types/order';
import { UserRole } from './TransactionsSummaryBase';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { toast } from 'sonner';
import { ReButton } from '@/components/re-ui/ReButton';

interface OrderDeliveredProps {
  userRole: UserRole;
  order: OrderDetails | null;
}

export default function OrderDelivered({ userRole, order }: OrderDeliveredProps) {
  const [loading, setLoading] = useState(false);

  const handleMarkDelivered = async () => {
    if (!order) return;
    try {
      setLoading(true);
      const res = await updateOrderProgress(
        {
          status: 'DELIVERED',
          step: 4,
          notes: 'Seller marked order as delivered.',
        } as UpdateOrderProgressDTO,
        order.id
      );
      if (res.success) {
        toast.success('Order marked as delivered!');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark delivered');
    } finally {
      setLoading(false);
    }
  };

  if (userRole !== 'seller' || order?.status !== 'SHIPPED') return null;

  return (
    <section className="mt-5 p-5 rounded-xl border-2 border-gray-200 bg-gray-100">
      <h2 className="font-inter text-xl font-bold text-gray-800">Delivery Confirmation</h2>
      <p className="font-inter text-gray-600">
        The order has been shipped. Once delivered to the buyer, you can mark it as delivered.
      </p>
      <ReButton
        className="mt-4 w-2/5 rounded-full"
        onClick={handleMarkDelivered}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Mark as Delivered'}
      </ReButton>
    </section>
  );
}
