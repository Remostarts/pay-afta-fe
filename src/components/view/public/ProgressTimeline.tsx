import type { DeliveryStatus } from '@/types/order';
import { cn } from '@/lib/utils';
import { deliverySteps } from '@/constants/logistic-dashboard/delivery';
import { motion } from 'framer-motion';

interface TimelineStep {
  step: string;
  note?: string;
  timestamp: string;
  status: string;
}

interface ProgressTimelineProps {
  timeline: TimelineStep[];
}

/* ---------- Helper Functions ---------- */
const getStepState = (step: TimelineStep, index: number, timeline: TimelineStep[]) => {
  const isCompleted = index < timeline.length - 1;
  const isCurrent = index === timeline.length - 1;
  const isFailed = step.status === 'FAILED';
  return { isCompleted, isCurrent, isFailed };
};

const getStepColor = (isCompleted: boolean, isCurrent: boolean, isFailed: boolean) => {
  if (isFailed) return 'bg-red-500';
  if (isCurrent) return 'bg-blue-500';
  if (isCompleted) return 'bg-green-500';
  return 'bg-gray-300';
};

/* ---------- Sub Components ---------- */
const StepIcon = ({
  isCompleted,
  isFailed,
  stepNumber,
  className,
}: {
  isCompleted: boolean;
  isFailed: boolean;
  stepNumber: number;
  className: string;
}) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className={cn(
      'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-300',
      className
    )}
  >
    {isCompleted || isFailed ? '✓' : stepNumber}
  </motion.div>
);

const StepLabel = ({
  label,
  isActive,
  isFailed,
}: {
  label: string;
  isActive: boolean;
  isFailed: boolean;
}) => (
  <span
    className={cn(
      'mt-2 text-xs sm:text-sm text-center font-medium transition-colors duration-300 max-w-[90px] sm:max-w-none',
      isActive ? 'text-gray-900' : 'text-gray-500'
    )}
  >
    {isFailed ? 'Failed' : label}
  </span>
);

const Connector = ({ isCompleted }: { isCompleted: boolean }) => (
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: '100%' }}
    transition={{ duration: 0.4 }}
    className={cn(
      'flex-1 h-0.5 mx-2 sm:mx-4 rounded-full transition-colors duration-300',
      isCompleted ? 'bg-green-500' : 'bg-gray-300'
    )}
  />
);

/* ---------- Main Component ---------- */
export default function ProgressTimeline({ timeline }: ProgressTimelineProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        No timeline data available
      </div>
    );
  }

  return (
    <div className="mb-8 px-2 sm:px-4 md:px-8">
      {/* Desktop & Tablet Layout */}
      <div className="hidden sm:flex items-center justify-between overflow-x-auto scrollbar-hide">
        {timeline.map((step, index) => {
          const { isCompleted, isCurrent, isFailed } = getStepState(step, index, timeline);
          const isActive = isCompleted || isCurrent;

          return (
            <div key={index} className="flex flex-1 items-center min-w-[120px] sm:min-w-[160px]">
              <div className="flex flex-col items-center relative">
                <StepIcon
                  isCompleted={isCompleted}
                  isFailed={isFailed}
                  stepNumber={index + 1}
                  className={getStepColor(isCompleted, isCurrent, isFailed)}
                />
                <StepLabel label={step.step} isFailed={isFailed} isActive={isActive} />
                {step.timestamp && <p className="mt-1 text-xs text-gray-400">{step.timestamp}</p>}
                {step.note && (
                  <p className="mt-1 text-[11px] text-gray-600 max-w-[120px] text-center italic">
                    {step.note}
                  </p>
                )}
              </div>
              {index < timeline.length - 1 && <Connector isCompleted={isCompleted} />}
            </div>
          );
        })}
      </div>

      {/* Mobile Layout */}
      <div className="flex sm:hidden flex-col space-y-6">
        {timeline.map((step, index) => {
          const { isCompleted, isCurrent, isFailed } = getStepState(step, index, timeline);
          const isActive = isCompleted || isCurrent;

          return (
            <div key={index} className="flex items-start relative">
              <div className="flex flex-col items-center mr-4">
                <StepIcon
                  isCompleted={isCompleted}
                  isFailed={isFailed}
                  stepNumber={index + 1}
                  className={getStepColor(isCompleted, isCurrent, isFailed)}
                />
                {index < timeline.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 h-12 my-2 rounded-full transition-colors duration-300',
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    )}
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 pt-1"
              >
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {isFailed ? 'Failed' : step.step}
                </p>
                {step.timestamp && <p className="text-xs text-gray-400 mt-1">{step.timestamp}</p>}
                {step.note && <p className="text-xs text-gray-600 mt-1 italic">{step.note}</p>}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
