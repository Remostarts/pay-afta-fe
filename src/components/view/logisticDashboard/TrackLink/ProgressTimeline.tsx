import type { DeliveryStatus } from '@/types/order';
import { cn } from '@/lib/utils';
import { deliverySteps } from '@/constants/logistic-dashboard/delivery';

interface ProgressTimelineProps {
  status: DeliveryStatus;
}

export default function ProgressTimeline({ status }: ProgressTimelineProps) {
  const getStatusStep = (status: DeliveryStatus) => {
    const statusMap = { accepted: 1, 'picked-up': 2, 'in-transit': 3, delivered: 4, failed: 4 };
    return statusMap[status] || 1;
  };

  const currentStep = getStatusStep(status);

  return (
    <div className="mb-8 flex items-center justify-between">
      {deliverySteps.map((step, index) => {
        const isCompleted = step.step <= currentStep && status !== 'failed';
        const isFailed = status === 'failed' && step.step === 4;

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold',
                  isCompleted ? 'bg-green-500' : isFailed ? 'bg-red-500' : 'bg-gray-300'
                )}
              >
                {isCompleted && step.step === 1 ? '✓' : step.step}
              </div>
              <span
                className={cn(
                  'text-sm text-center font-medium',
                  isCompleted ? 'text-gray-900' : 'text-gray-500'
                )}
              >
                {isFailed && step.step === 4 ? 'Failed' : step.label}
              </span>
            </div>
            {index < deliverySteps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4',
                  step.step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
