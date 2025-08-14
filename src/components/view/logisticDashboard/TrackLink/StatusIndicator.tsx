import type { DeliveryStatus } from '@/types/order';
import { cn } from '@/lib/utils';
import { statusColors, statusDisplayNames } from '@/constants/logistic-dashboard/delivery';

interface StatusIndicatorProps {
  status: DeliveryStatus;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div className="mb-8 flex items-center gap-2">
      <span className="font-inter text-sm text-gray-600">Status:</span>
      <span
        className={cn(
          `text-sm font-semibold font-inter bg-[${statusColors[status]}] p-2 rounded-full`,
          statusColors[status]
        )}
      >
        {statusDisplayNames[status]}
      </span>
    </div>
  );
}
