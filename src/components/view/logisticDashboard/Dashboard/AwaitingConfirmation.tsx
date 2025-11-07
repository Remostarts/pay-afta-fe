'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { updateDeliveryProgressStatus } from '@/lib/actions/delivery/delivery.actions';
import { toast } from 'sonner';

interface Order {
  id: string;
  totalCost: number;
  pickupAddress: string;
  dropoffAddress: string;
  createdAt?: string;
}

interface AwaitingConfirmationProps {
  initialOrders: Order[];
}

export default function AwaitingConfirmation({ initialOrders }: AwaitingConfirmationProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loadingAction, setLoadingAction] = useState<{
    [key: string]: 'ACCEPTED' | 'REJECTED' | null;
  }>({});

  const handleAction = async (deliveryId: string, action: 'ACCEPTED' | 'REJECTED') => {
    if (!window.confirm(`Are you sure you want to ${action} this delivery?`)) return;

    setLoadingAction((prev) => ({ ...prev, [deliveryId]: action }));

    try {
      await updateDeliveryProgressStatus({ action }, deliveryId);

      setOrders((prev) => prev.filter((o) => o.id !== deliveryId));
      toast.success(`Delivery ${action === 'ACCEPTED' ? 'accepted' : 'rejected'} successfully.`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong.');
    } finally {
      setLoadingAction((prev) => ({ ...prev, [deliveryId]: null }));
    }
  };

  if (orders.length === 0) return <div>No deliveries awaiting confirmation.</div>;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-lg font-semibold">Awaiting Confirmation</div>
        <Link href="#" className="text-sm font-medium text-[#0a0a3c]">
          VIEW ALL
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="mb-3 flex min-w-[260px] flex-1 flex-col justify-between rounded-lg bg-[#F9F9F9] p-4"
          >
            <div className="flex items-center justify-between">
              <div className="mb-1 text-sm font-semibold text-[#7d7dfb]">Order ID {order.id}</div>
              <div className="mb-2 text-lg font-bold text-[#0a0a3c]"> ₦{order.totalCost}</div>
            </div>
            <div className="mb-1 text-sm">
              <b>Pickup:</b> {order.pickupAddress}
            </div>
            <div className="mb-1 text-xs text-gray-500">
              {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '—'}
            </div>
            <div className="mb-3 text-sm">
              <b>Destination:</b> {order.dropoffAddress}
            </div>

            <div className="flex gap-2">
              <button
                disabled={loadingAction[order.id] === 'REJECTED'}
                onClick={() => handleAction(order.id, 'REJECTED')}
                className="flex-1 rounded-full border border-[#03045B] bg-white py-3 font-semibold text-[#03045B]"
              >
                {loadingAction[order.id] === 'REJECTED' ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                disabled={loadingAction[order.id] === 'ACCEPTED'}
                onClick={() => handleAction(order.id, 'ACCEPTED')}
                className="flex-1 rounded-full bg-[#03045B] py-3 font-semibold text-white"
              >
                {loadingAction[order.id] === 'ACCEPTED' ? 'Accepting...' : 'Accept'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
