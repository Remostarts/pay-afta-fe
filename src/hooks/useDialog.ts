import { useState } from 'react';

export const useDialog = (initialStep = 1, finalStep = 3) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = () => {
    setTimeout(() => {
      setCurrentStep((prev) => (prev === finalStep ? initialStep : prev + 1));
    }, 300);
  };

  return { currentStep, nextStep };
};
