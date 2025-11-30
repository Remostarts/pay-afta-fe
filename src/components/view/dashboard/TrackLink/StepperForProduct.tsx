'use client';

import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'disputed' | 'refunded';
}

interface StepperForProductProps {
  currentStep: number;
  isReturn?: boolean;
  isDisputed?: boolean;
  isRefunded?: boolean;
}

export default function StepperForProduct({
  currentStep,
  isReturn = false,
  isDisputed = false,
  isRefunded = false,
}: StepperForProductProps) {
  const getSteps = (): Step[] => {
    if (isDisputed) {
      return [
        { number: 1, label: 'Agreement', status: 'completed' },
        { number: 2, label: 'Payment', status: 'completed' },
        { number: 3, label: 'Shipping', status: 'completed' },
        { number: 4, label: 'Delivery', status: 'completed' },
        { number: 5, label: 'Disputed', status: 'disputed' },
      ];
    }

     if (isReturn || isRefunded) {
      return [
        { number: 1, label: 'Agreement', status: 'completed' },
        { number: 2, label: 'Payment', status: 'completed' },
        { number: 3, label: 'Shipping', status: 'completed' },
        {
          number: 4,
          label: 'Return',
          status: currentStep === 4 && isReturn ? 'current' : 'completed',
        },
        {
          number: 5,
          label: 'Refunded',
          status: currentStep === 5 && isRefunded ? 'refunded' : 'upcoming',
        },
      ];
    }

    return [
      {
        number: 1,
        label: 'Agreement',
        status: currentStep === 1 ? 'current' : currentStep > 1 ? 'completed' : 'upcoming',
      },
      {
        number: 2,
        label: 'Payment',
        status: currentStep === 2 ? 'current' : currentStep > 2 ? 'completed' : 'upcoming',
      },
      {
        number: 3,
        label: 'Shipping',
        status: currentStep === 3 ? 'current' : currentStep > 3 ? 'completed' : 'upcoming',
      },
      {
        number: 4,
        label: 'Delivery',
        status: currentStep === 4 ? 'current' : currentStep > 4 ? 'completed' : 'upcoming',
      },
      {
        number: 5,
        label: 'Completed',
        status: currentStep === 5 ? 'current' : currentStep > 5 ? 'completed' : 'upcoming',
      },
    ];
  };

  const steps = getSteps();

  return (
    <div className="w-full py-8">
      <style>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .line-progress {
          animation: slideIn 0.6s ease-out forwards;
        }
        
        .step-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .checkmark-animate {
          animation: checkmark 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .ripple-effect::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 2s ease-out infinite;
        }

        // .ripple-effect.green::before {
        //   background: rgba(34, 197, 94, 0.3);
        // }

        // .ripple-effect.red::before {
        //   background: rgba(239, 68, 68, 0.3);
        // }
      `}</style>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex flex-col items-center flex-1">
            {/* Connector Line Container */}
            {index < steps.length - 1 && (
              <div className="absolute left-[50%] top-[18px] h-[3px] w-full bg-gray-200 rounded-full overflow-hidden">
                {/* Animated Progress Line */}
                {step.status === 'completed' && (
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 line-progress rounded-full shadow-sm"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                    }}
                  />
                )}
                {step.status === 'disputed' && (
                  <div className="h-full bg-gradient-to-r from-red-400 to-red-600 line-progress rounded-full shadow-sm" />
                )}
                {step.status === 'refunded' && (
                  <div className="h-full bg-gradient-to-r from-gray-500 to-gray-600 line-progress rounded-full shadow-sm" />
                )}
              </div>
            )}

            {/* Step Circle */}
            <div
              className={`relative z-10 flex size-10 items-center justify-center rounded-full border-[3px] transition-all duration-300 ease-in-out
                ${
                  step.status === 'completed'
                    ? 'border-green-500 bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-110'
                    : step.status === 'current'
                      ? 'border-green-500 bg-white text-green-600 shadow-lg shadow-green-200 step-pulse ripple-effect green'
                      : step.status === 'disputed'
                        ? 'border-red-500 bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:scale-110 ripple-effect red'
                        : step.status === 'refunded'
                          ? 'border-gray-600 bg-gradient-to-br from-gray-500 to-gray-700 text-white shadow-lg shadow-gray-300 hover:shadow-xl hover:shadow-gray-400 hover:scale-110'
                          : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:scale-105'
                }
                transform cursor-pointer`}
            >
              {step.status === 'completed' || step.status === 'refunded' ? (
                <Check className="size-5 checkmark-animate" strokeWidth={3} />
              ) : (
                <span className="text-sm font-bold transition-transform duration-200">
                  {step.number}
                </span>
              )}
            </div>

            {/* Step Label */}
            <span
              className={`mt-3 text-sm font-semibold transition-all duration-300 text-center px-2
                ${
                  step.status === 'completed'
                    ? 'text-green-600'
                    : step.status === 'current'
                      ? 'text-green-600 scale-105'
                      : step.status === 'disputed'
                        ? 'text-red-600'
                        : step.status === 'refunded'
                          ? 'text-gray-700'
                          : 'text-gray-400'
                }`}
            >
              {step.label}
            </span>

            {/* Status Indicator Dot for Current Step */}
            {/* {step.status === 'current' && (
              <div className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full step-pulse" />
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}
