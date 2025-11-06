'use client';

import { useState } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
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

// Types
type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'retry';

interface StatusAction {
  label: string;
  action: () => Promise<void> | void;
  variant: ButtonVariant;
  disabled: boolean;
}

// Constants
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  default: 'bg-[#03045B] hover:bg-[#020339] text-white',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  retry: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  secondary: 'bg-gray-300 text-gray-600 cursor-not-allowed',
};

// Helper Functions
const createAction = (
  label: string,
  status: DeliveryStatus | 'RETRY' | null,
  onStatusUpdate: (status: DeliveryStatus | 'RETRY') => void,
  variant: ButtonVariant = 'default',
  disabled: boolean = false
): StatusAction => ({
  label,
  action: status
    ? async () => {
        await onStatusUpdate(status);
      }
    : () => {},
  variant,
  disabled,
});

const getStatusActions = (
  status: DeliveryStatus,
  isPaymentDone: boolean,
  onStatusUpdate: (status: DeliveryStatus | 'RETRY') => void
): StatusAction[] => {
  if (!isPaymentDone) {
    return [createAction('Waiting for Payment', null, onStatusUpdate, 'secondary', true)];
  }

  const actionsMap: Record<DeliveryStatus, StatusAction[]> = {
    ACCEPTED: [createAction('Mark as Picked Up', 'PICKED_UP', onStatusUpdate)],
    PAID: [createAction('Mark as Picked Up', 'PICKED_UP', onStatusUpdate)],
    PICKED_UP: [createAction('Mark as In Transit', 'IN_TRANSIT', onStatusUpdate)],
    IN_TRANSIT: [
      createAction('Mark as Delivered', 'DELIVERED', onStatusUpdate),
      createAction('Mark as Failed', 'FAILED', onStatusUpdate, 'destructive'),
    ],
    FAILED: [
      createAction('Retry Delivery', 'RETRY', onStatusUpdate, 'retry'),
      createAction('Mark as Delivered', 'DELIVERED', onStatusUpdate),
    ],
    DELIVERED: [createAction('Delivery Completed', null, onStatusUpdate, 'secondary', true)],
  };

  return actionsMap[status] || [createAction('Update', null, onStatusUpdate, 'secondary', true)];
};

// Sub-components
interface BackButtonProps {
  href: string;
}

const BackButton = ({ href }: BackButtonProps) => (
  <Link
    href={href}
    className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
    aria-label="Go back to delivery list"
  >
    <ArrowLeft className="size-5" />
  </Link>
);

interface OrderTitleProps {
  orderId: string;
}

const OrderTitle = ({ orderId }: OrderTitleProps) => (
  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold truncate">
    <span className="hidden sm:inline">Order ID </span>
    <span className="sm:hidden">#</span>
    {orderId}
  </h1>
);

interface AmountDisplayProps {
  amount: string;
}

const AmountDisplay = ({ amount }: AmountDisplayProps) => (
  <span className="text-lg sm:text-xl font-semibold whitespace-nowrap">{amount}</span>
);

interface ActionButtonProps {
  action: StatusAction;
  isLoading: boolean;
  onClick: () => void;
}

const ActionButton = ({ action, isLoading, onClick }: ActionButtonProps) => (
  <Button
    onClick={onClick}
    disabled={action.disabled || isLoading}
    className={cn(
      'rounded-full transition-all duration-200 text-sm sm:text-base px-3 sm:px-4 py-2 whitespace-nowrap',
      VARIANT_STYLES[action.variant],
      isLoading && 'opacity-70'
    )}
    aria-busy={isLoading}
  >
    {isLoading ? (
      <>
        <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        <span className="hidden sm:inline">Loading...</span>
        <span className="sm:hidden">...</span>
      </>
    ) : (
      <span className="truncate max-w-[120px] sm:max-w-none">{action.label}</span>
    )}
  </Button>
);

interface ActionButtonsGroupProps {
  actions: StatusAction[];
  loadingIndex: number | null;
  onActionClick: (index: number, actionFn: () => Promise<void> | void) => void;
}

const ActionButtonsGroup = ({ actions, loadingIndex, onActionClick }: ActionButtonsGroupProps) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
    {actions.map((action, idx) => (
      <ActionButton
        key={idx}
        action={action}
        isLoading={loadingIndex === idx}
        onClick={() => onActionClick(idx, action.action)}
      />
    ))}
  </div>
);

// Main Component
export default function OrderHeader({
  orderId,
  amount,
  status,
  onStatusUpdate,
  isPaymentDone,
}: OrderHeaderProps) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const actions = getStatusActions(status, isPaymentDone, onStatusUpdate);

  const handleActionClick = async (index: number, actionFn: () => Promise<void> | void) => {
    setLoadingIndex(index);
    try {
      await actionFn();
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <>
      {/* Desktop & Tablet Layout */}
      <div className="hidden sm:flex mb-6 items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <BackButton href="/logistic-dashboard/delivery" />
          <OrderTitle orderId={orderId} />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <AmountDisplay amount={amount} />
          <ActionButtonsGroup
            actions={actions}
            loadingIndex={loadingIndex}
            onActionClick={handleActionClick}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex sm:hidden flex-col gap-4 mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <BackButton href="/logistic-dashboard/delivery" />
            <OrderTitle orderId={orderId} />
          </div>
          <AmountDisplay amount={amount} />
        </div>

        <ActionButtonsGroup
          actions={actions}
          loadingIndex={loadingIndex}
          onActionClick={handleActionClick}
        />
      </div>
    </>
  );
}
