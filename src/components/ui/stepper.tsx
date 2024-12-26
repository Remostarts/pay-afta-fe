interface StepperProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export default function Stepper({ totalSteps, currentStep }: StepperProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="flex items-center space-x-2">
      <span className="mr-2 text-gray-600">Rules</span>
      <div className="relative size-12">
        <svg className="size-full" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-gray-200"
            strokeWidth="2"
          ></circle>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-green-500"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
            transform="rotate(-90 18 18)"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          {currentStep}/{totalSteps}
        </div>
      </div>
    </div>
  );
}

// interface StepperProps {
//   totalSteps: number;
//   currentStep: number;
//   className?: string;
// }

// export default function Stepper({ totalSteps, currentStep, className = '' }: StepperProps) {
//   return (
//     <div className="mb-4 flex w-[70%] items-center space-x-4">
//       {[...Array(totalSteps)].map((_, index) => (
//         <div
//           key={index}
//           className={`h-2 flex-1 rounded-full ${className} ${
//             index < currentStep ? 'bg-orange-500' : 'bg-[#ffe1cc]'
//           }`}
//         ></div>
//       ))}
//     </div>
//   );
// }
