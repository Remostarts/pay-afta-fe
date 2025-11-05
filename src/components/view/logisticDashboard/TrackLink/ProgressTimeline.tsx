import type { DeliveryStatus } from '@/types/order';
import { cn } from '@/lib/utils';
import { deliverySteps } from '@/constants/logistic-dashboard/delivery';

interface ProgressTimelineProps {
  status: DeliveryStatus;
}

export default function ProgressTimeline({ status }: ProgressTimelineProps) {
  // Map DeliveryStatus to step numbers
  const statusToStep: Record<DeliveryStatus, number> = {
    ACCEPTED: 1,
    PAID: 1,
    PICKED_UP: 2,
    IN_TRANSIT: 3,
    DELIVERED: 4,
    FAILED: 4,
  };

  const currentStep = statusToStep[status] || 1;

  return (
    <div className="mb-8 flex items-center justify-between">
      {deliverySteps.map((step, index) => {
        const isCompleted = step.step < currentStep && status !== 'FAILED';
        const isCurrent = step.step === currentStep && status !== 'FAILED';
        const isFailed = status === 'FAILED' && step.step === 4;

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold',
                  isFailed
                    ? 'bg-red-500'
                    : isCompleted || isCurrent
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                )}
              >
                {isCompleted || isFailed ? '✓' : step.step}
              </div>
              <span
                className={cn(
                  'text-sm text-center font-medium',
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                )}
              >
                {isFailed ? 'Failed' : step.label}
              </span>
            </div>

            {index < deliverySteps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4',
                  step.step < currentStep && status !== 'FAILED' ? 'bg-green-500' : 'bg-gray-300'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
