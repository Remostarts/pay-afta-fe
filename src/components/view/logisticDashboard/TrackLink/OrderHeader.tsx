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
  onStatusUpdate: (status: DeliveryStatus) => void;
  isPaymentDone: boolean;
}

export default function OrderHeader({
  orderId,
  amount,
  status,
  onStatusUpdate,
  isPaymentDone,
}: OrderHeaderProps) {
  const getNextStatusAction = () => {
    if (!isPaymentDone) {
      return {
        label: 'Waiting for Payment',
        action: () => {},
        variant: 'secondary' as const,
        disabled: true,
      };
    }

    switch (status) {
      case 'accepted':
        return {
          label: 'Mark as Picked Up',
          action: () => onStatusUpdate('picked-up'),
          variant: 'default' as const,
          disabled: false,
        };
      case 'picked-up':
        return {
          label: 'Mark as In Transit',
          action: () => onStatusUpdate('in-transit'),
          variant: 'default' as const,
          disabled: false,
        };
      case 'in-transit':
        return {
          label: 'Mark as Delivered',
          action: () => onStatusUpdate('delivered'),
          variant: 'default' as const,
          disabled: false,
        };
      default:
        return {
          label: 'Update',
          action: () => {},
          variant: 'secondary' as const,
          disabled: true,
        };
    }
  };

  const nextAction = getNextStatusAction();

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
        <Button
          onClick={nextAction.action}
          disabled={nextAction.disabled}
          className={cn(
            nextAction.variant === 'default'
              ? 'bg-[#03045B] rounded-full text-white'
              : 'bg-gray-300 rounded-full text-gray-600'
          )}
        >
          {nextAction.label}
        </Button>
      </div>
    </div>
  );
}
