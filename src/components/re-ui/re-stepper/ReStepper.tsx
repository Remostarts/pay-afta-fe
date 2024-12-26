import { completedStepsState } from '@/redux/features/shared/StepperSlices';
import { useAppSelector } from '@/redux/hooks';
import './stepper.css';

type TStepperProps = {
  currentStep: number;
  steps: string[];
  setFormStep: (value: number) => void;
};

const ReStepper = ({ currentStep, steps = [], setFormStep }: TStepperProps) => {
  const completedSteps = useAppSelector(completedStepsState);

  const handleStepClick = (index: number) => () => {
    if (currentStep === 2) return;
    if (completedSteps >= index) {
      setFormStep(index);
    }
  };
  return (
    <div className="flex justify-between">
      {steps.map((step, i) => (
        <button
          type="button"
          onClick={handleStepClick(i)}
          key={i}
          className={`step-item ${currentStep === i && 'active'} ${
            i < completedSteps && 'complete'
          } `}
        >
          <div className="step">{i < completedSteps ? i + 1 : i + 1}</div>
          <p className="text-gray-500">{step}</p>
        </button>
      ))}
    </div>
  );
};

export { ReStepper };
