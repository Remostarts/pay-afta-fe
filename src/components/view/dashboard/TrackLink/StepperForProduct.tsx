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
  isRefunded?: boolean; // Added to track refunded state
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
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex flex-col items-center">
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[50%] top-[15px] h-[2px] w-[100px] 
                  ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'disputed'
                        ? 'bg-red-500'
                        : step.status === 'refunded'
                          ? 'bg-[#666666]'
                          : 'bg-gray-200'
                  }`}
              />
            )}

            {/* Step Circle */}
            <div
              className={`z-10 flex size-8 items-center justify-center rounded-full border-2 
                ${
                  step.status === 'completed'
                    ? 'border-green-500 bg-green-500 text-white'
                    : step.status === 'current'
                      ? 'border-green-500 bg-white text-green-500'
                      : step.status === 'disputed'
                        ? 'border-red-500 bg-red-500 text-white'
                        : step.status === 'refunded'
                          ? 'border-[#666666] bg-[#666666] text-white'
                          : 'border-gray-200 bg-white text-gray-400'
                }`}
            >
              {step.status === 'completed' || step.status === 'refunded' ? (
                <Check className="size-5" />
              ) : (
                <span className="text-sm">{step.number}</span>
              )}
            </div>

            {/* Step Label */}
            <span
              className={`mt-2 text-sm font-medium
                ${
                  step.status === 'completed'
                    ? 'text-green-500'
                    : step.status === 'current'
                      ? 'text-green-500'
                      : step.status === 'disputed'
                        ? 'text-red-500'
                        : step.status === 'refunded'
                          ? 'text-[#666666]'
                          : 'text-gray-400'
                }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
