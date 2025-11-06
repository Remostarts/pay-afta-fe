import type { DeliveryStatus } from '@/types/order';
import { cn } from '@/lib/utils';
import { deliverySteps } from '@/constants/logistic-dashboard/delivery';

interface ProgressTimelineProps {
  status: DeliveryStatus;
}

// Constants
const STATUS_TO_STEP: Record<DeliveryStatus, number> = {
  ACCEPTED: 1,
  PAID: 1,
  PICKED_UP: 2,
  IN_TRANSIT: 3,
  DELIVERED: 4,
  FAILED: 4,
};

// Helper functions
const getCurrentStep = (status: DeliveryStatus): number => {
  return STATUS_TO_STEP[status] || 1;
};

const getStepState = (stepNumber: number, currentStep: number, status: DeliveryStatus) => {
  const isCompleted = stepNumber < currentStep && status !== 'FAILED';
  const isCurrent = stepNumber === currentStep && status !== 'FAILED';
  const isFailed = status === 'FAILED' && stepNumber === 4;

  return { isCompleted, isCurrent, isFailed };
};

const getStepStyles = (isCompleted: boolean, isCurrent: boolean, isFailed: boolean) => {
  if (isFailed) return 'bg-red-500';
  if (isCompleted || isCurrent) return 'bg-green-500';
  return 'bg-gray-300';
};

const getConnectorStyles = (stepNumber: number, currentStep: number, status: DeliveryStatus) => {
  return stepNumber < currentStep && status !== 'FAILED' ? 'bg-green-500' : 'bg-gray-300';
};

// Sub-components
interface StepIconProps {
  isCompleted: boolean;
  isFailed: boolean;
  stepNumber: number;
  className: string;
}

const StepIcon = ({ isCompleted, isFailed, stepNumber, className }: StepIconProps) => (
  <div
    className={cn(
      'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold transition-all duration-300',
      className
    )}
  >
    {isCompleted || isFailed ? '✓' : stepNumber}
  </div>
);

interface StepLabelProps {
  label: string;
  isFailed: boolean;
  isActive: boolean;
}

const StepLabel = ({ label, isFailed, isActive }: StepLabelProps) => (
  <span
    className={cn(
      'mt-2 text-xs sm:text-sm text-center font-medium transition-colors duration-300 max-w-[80px] sm:max-w-none',
      isActive ? 'text-gray-900' : 'text-gray-500'
    )}
  >
    {isFailed ? 'Failed' : label}
  </span>
);

interface ConnectorLineProps {
  className: string;
}

const ConnectorLine = ({ className }: ConnectorLineProps) => (
  <div className={cn('flex-1 h-0.5 mx-2 sm:mx-4 transition-colors duration-300', className)} />
);

// Main component
export default function ProgressTimeline({ status }: ProgressTimelineProps) {
  const currentStep = getCurrentStep(status);

  return (
    <div className="mb-6 sm:mb-8 px-2 sm:px-0">
      {/* Desktop and Tablet View */}
      <div className="hidden sm:flex items-center justify-between">
        {deliverySteps.map((step, index) => {
          const { isCompleted, isCurrent, isFailed } = getStepState(step.step, currentStep, status);
          const isActive = isCompleted || isCurrent;

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <StepIcon
                  isCompleted={isCompleted}
                  isFailed={isFailed}
                  stepNumber={step.step}
                  className={getStepStyles(isCompleted, isCurrent, isFailed)}
                />
                <StepLabel label={step.label} isFailed={isFailed} isActive={isActive} />
              </div>
              {index < deliverySteps.length - 1 && (
                <ConnectorLine className={getConnectorStyles(step.step, currentStep, status)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View - Vertical Layout */}
      <div className="flex sm:hidden flex-col space-y-4">
        {deliverySteps.map((step, index) => {
          const { isCompleted, isCurrent, isFailed } = getStepState(step.step, currentStep, status);
          const isActive = isCompleted || isCurrent;

          return (
            <div key={step.key} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <StepIcon
                  isCompleted={isCompleted}
                  isFailed={isFailed}
                  stepNumber={step.step}
                  className={getStepStyles(isCompleted, isCurrent, isFailed)}
                />
                {index < deliverySteps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 my-2 transition-colors duration-300',
                      getConnectorStyles(step.step, currentStep, status)
                    )}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <span
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {isFailed ? 'Failed' : step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
