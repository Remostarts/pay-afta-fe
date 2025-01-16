import React from 'react';

interface StepperProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
  steps: {
    label: string;
    number: number;
  }[];
}

export default function Stepper({ totalSteps, currentStep, steps }: StepperProps) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex min-w-max items-center justify-between px-4 py-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div className="flex items-center">
              {/* Step circle */}
              <div
                className={`flex size-6 items-center justify-center rounded-full border-2 text-xs font-medium sm:size-8 sm:text-sm md:size-10
                ${
                  step.number === currentStep && currentStep === 5
                    ? 'border-red-500 bg-red-500 text-white'
                    : step.number === currentStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : step.number < currentStep
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-200 bg-white text-gray-400'
                }`}
              >
                {step.number}
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-12 sm:w-16 md:w-24
                  ${step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
                />
              )}
            </div>

            {/* Step label */}
            <span
              className={`mt-2 whitespace-nowrap text-[10px] font-medium sm:text-xs md:text-sm
              ${step.number === currentStep ? 'text-gray-900' : 'text-gray-500'}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
