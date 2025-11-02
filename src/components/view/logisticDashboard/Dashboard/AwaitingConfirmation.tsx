'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getRequestedDeliveries,
  updateDeliveryProgressStatus,
} from '@/lib/actions/delivery/delivery.actions';
import { toast } from 'sonner';

const AwaitingConfirmation = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingAction, setLoadingAction] = useState<{
    [key: string]: 'APPROVED' | 'REJECTED' | null;
  }>({});

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getRequestedDeliveries();
        setOrders(response?.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load deliveries.');
      }
    }
    fetchOrders();
  }, []);

  const handleAction = async (deliveryId: string, action: 'APPROVED' | 'REJECTED') => {
    const confirmMessage =
      action === 'APPROVED'
        ? 'Are you sure you want to APPROVE this delivery?'
        : 'Are you sure you want to REJECT this delivery?';
    if (!window.confirm(confirmMessage)) return;

    setLoadingAction((prev) => ({ ...prev, [deliveryId]: action }));

    try {
      await updateDeliveryProgressStatus({ action }, deliveryId);

      // Remove order after success
      setOrders((prev) => prev.filter((o) => o.id !== deliveryId));
      toast.success(`Delivery ${action === 'APPROVED' ? 'approved' : 'rejected'} successfully.`);
    } catch (error: any) {
      console.error('Action failed:', error);
      toast.error(error?.message || 'Something went wrong. Try again.');
    } finally {
      setLoadingAction((prev) => ({ ...prev, [deliveryId]: null }));
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-lg font-semibold">Awaiting Confirmation</div>
        <Link href="" className="text-sm font-medium text-[#0a0a3c]">
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
              <div className="mb-2 text-lg font-bold text-[#0a0a3c]">{order.totalCost}</div>
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
                disabled={loadingAction[order.id] === 'APPROVED'}
                onClick={() => handleAction(order.id, 'APPROVED')}
                className="flex-1 rounded-full bg-[#03045B] py-3 font-semibold text-white"
              >
                {loadingAction[order.id] === 'APPROVED' ? 'Approving...' : 'Accept'}
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && <div>No deliveries awaiting confirmation.</div>}
      </div>
    </div>
  );
};

export default AwaitingConfirmation;
