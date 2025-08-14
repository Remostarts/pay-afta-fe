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
}

export default function OrderHeader({ orderId, amount, status, onStatusUpdate }: OrderHeaderProps) {
  const getNextStatusAction = () => {
    switch (status) {
      case 'accepted':
        return {
          label: 'Mark as Picked Up',
          action: () => onStatusUpdate('picked-up'),
          variant: 'default' as const,
        };
      case 'picked-up':
        return {
          label: 'Mark as In Transit',
          action: () => onStatusUpdate('in-transit'),
          variant: 'default' as const,
        };
      case 'in-transit':
        return {
          label: 'Mark as Delivered',
          action: () => onStatusUpdate('delivered'),
          variant: 'default' as const,
          showFailButton: true,
          failAction: () => onStatusUpdate('failed'),
        };
      case 'delivered':
        return {
          label: 'Delivered',
          action: () => {},
          variant: 'secondary' as const,
          disabled: true,
        };
      case 'failed':
        return {
          label: 'Retry Delivery',
          action: () => onStatusUpdate('picked-up'),
          variant: 'default' as const,
        };
      default:
        return null;
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
        {nextAction && (
          <>
            {nextAction.showFailButton && (
              <Button
                onClick={nextAction.failAction}
                variant="destructive"
                className="rounded-full border-2 border-[#03045B] text-[#03045B]"
              >
                Mark as Failed
              </Button>
            )}
            <Button
              onClick={nextAction.action}
              variant={nextAction.variant}
              disabled={nextAction.disabled}
              className={cn(
                nextAction.variant === 'default'
                  ? 'bg-[#03045B] rounded-full text-white'
                  : 'bg-[#B3B3B3] text-[#FFFFFF] rounded-full'
              )}
            >
              {nextAction.label}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
