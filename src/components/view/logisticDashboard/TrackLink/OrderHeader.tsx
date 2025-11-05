'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DeliveryStatus } from '@/types/order';

interface OrderHeaderProps {
  orderId: string;
  amount: string;
  status: DeliveryStatus;
  onStatusUpdate: (status: DeliveryStatus | 'RETRY') => void;
  isPaymentDone: boolean;
}

export default function OrderHeader({
  orderId,
  amount,
  status,
  onStatusUpdate,
  isPaymentDone,
}: OrderHeaderProps) {
  const getNextStatusActions = () => {
    if (!isPaymentDone) {
      return [
        {
          label: 'Waiting for Payment',
          action: () => {},
          variant: 'secondary' as const,
          disabled: true,
        },
      ];
    }

    switch (status) {
      case 'PAID':
        return [
          {
            label: 'Mark as Picked Up',
            action: () => onStatusUpdate('PICKED_UP'),
            variant: 'default' as const,
            disabled: false,
          },
        ];

      case 'PICKED_UP':
        return [
          {
            label: 'Mark as In Transit',
            action: () => onStatusUpdate('IN_TRANSIT'),
            variant: 'default' as const,
            disabled: false,
          },
        ];

      case 'IN_TRANSIT':
        return [
          {
            label: 'Mark as Delivered',
            action: () => onStatusUpdate('DELIVERED'),
            variant: 'default' as const,
            disabled: false,
          },
          {
            label: 'Mark as Failed',
            action: () => onStatusUpdate('FAILED'),
            variant: 'destructive' as const,
            disabled: false,
          },
        ];

      case 'FAILED':
        return [
          {
            label: 'Retry Delivery',
            action: () => onStatusUpdate('RETRY'),
            variant: 'retry' as const,
            disabled: false,
          },
          {
            label: 'Mark as Delivered',
            action: () => onStatusUpdate('DELIVERED'),
            variant: 'default' as const,
            disabled: false,
          },
        ];

      case 'DELIVERED':
        return [
          {
            label: 'Delivery Completed',
            action: () => {},
            variant: 'secondary' as const,
            disabled: true,
          },
        ];

      default:
        return [
          {
            label: 'Update',
            action: () => {},
            variant: 'secondary' as const,
            disabled: true,
          },
        ];
    }
  };

  const nextActions = getNextStatusActions();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/logistic-dashboard/delivery" className="p-1">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-semibold">Order ID {orderId}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold">{amount}</span>
        {nextActions.map((action, idx) => (
          <Button
            key={idx}
            onClick={action.action}
            disabled={action.disabled}
            className={cn(
              action.variant === 'default'
                ? 'bg-[#03045B] rounded-full text-white'
                : action.variant === 'destructive'
                  ? 'bg-red-600 rounded-full text-white'
                  : action.variant === 'retry'
                    ? 'bg-yellow-500 rounded-full text-white'
                    : 'bg-gray-300 rounded-full text-gray-600'
            )}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
