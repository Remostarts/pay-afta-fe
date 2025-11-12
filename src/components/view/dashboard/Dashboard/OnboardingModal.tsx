'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import NINVerificationForm from './NINVerificationForm';
import UserNameForm from './UserNameForm';
import TransactionPin from '../../auth/onboarding/TransactionPin';
import SettlementKycForm from '../../auth/onboarding/SettlementKycForm';

import { useGeneral } from '@/context/generalProvider';
import { addKycNinVerification, setUsername } from '@/lib/actions/onboarding/onboarding.actions';
import {
  TNinVerificationSchema,
  TUsername,
  PinFormData,
  TSettlementKyc,
} from '@/lib/validations/onboarding.validation';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingData {
  ninVerification?: TNinVerificationSchema;
  username?: TUsername;
  pin?: PinFormData;
  settlementKyc?: TSettlementKyc;
}

interface Step {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  validationKey: keyof OnboardingData;
}

const steps: Step[] = [
  {
    id: 0,
    title: 'NIN Verification',
    description: 'Identity verification for higher limit',
    component: NINVerificationForm,
    validationKey: 'ninVerification',
  },
  {
    id: 1,
    title: 'Username',
    description: 'Edit your username',
    component: UserNameForm,
    validationKey: 'username',
  },
  {
    id: 2,
    title: 'Transaction PIN',
    description: 'Set transaction PIN',
    component: TransactionPin,
    validationKey: 'pin',
  },
  {
    id: 3,
    title: 'Add Settlement Account',
    description: 'Add bank account for payout',
    component: SettlementKycForm,
    validationKey: 'settlementKyc',
  },
];

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStepDialog, setActiveStepDialog] = useState<number | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user, loadUserData } = useGeneral();

  // Initialize completed steps based on user profile status
  useEffect(() => {
    if (user?.profile && isOpen) {
      const completed: number[] = [];

      if (user.profile.personalKycStatus) {
        completed.push(0);
      }
      if (user.username) {
        completed.push(1);
      }
      if (user.profile.pinSet) {
        completed.push(2);
      }
      if (user.profile.settlementKycStatus) {
        completed.push(3);
      }

      setCompletedSteps(completed);
    }
  }, [user, isOpen]);

  // Handle opening step dialog
  const handleOpenStep = (stepIndex: number) => {
    // Only allow opening if previous steps are completed or if it's the first incomplete step
    const allPreviousCompleted = stepIndex === 0 || completedSteps.includes(stepIndex - 1);

    if (allPreviousCompleted && !completedSteps.includes(stepIndex)) {
      setActiveStepDialog(stepIndex);
      setSubmitError(null);
    }
  };

  // Handle closing step dialog
  const handleCloseStepDialog = () => {
    if (!isSubmitting) {
      setActiveStepDialog(null);
      setSubmitError(null);
    }
  };

  // Process step completion with proper API calls
  const handleStepComplete = async (result?: any) => {
    if (activeStepDialog === null) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const step = steps[activeStepDialog];
      const stepData = result || onboardingData[step.validationKey];

      if (!stepData) {
        throw new Error('No data available for this step');
      }

      // Process step based on type
      let response;
      switch (activeStepDialog) {
        case 0: // NIN Verification
          response = await addKycNinVerification({
            nin: stepData.nin,
          });
          break;

        case 1: // Username
          response = await setUsername({ username: stepData.username });
          break;

        case 2: // Transaction PIN
          response = { success: true };
          break;
        
        case 3: // Settlement KYC
          response = { success: true };
          break;
        default:
          throw new Error('Invalid step');
      }

      if (response?.success || response?.statusCode === 200) {
        // Mark step as completed
        setCompletedSteps((prev) => [...new Set([...prev, activeStepDialog])]);

        // Store step data
        setOnboardingData((prev) => ({
          ...prev,
          [step.validationKey]: stepData,
        }));

        // Show success message
        toast.success(`${step.title} completed successfully!`);

        // Close the step dialog
        setActiveStepDialog(null);

        // If all steps completed, close main modal and reload user data
        if (activeStepDialog === steps.length - 1) {
          await loadUserData();
          toast.success('Onboarding completed successfully! Welcome aboard! 🎉');
          onClose();
        }
      } else {
        throw new Error(response?.error || 'Failed to process step');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const ActiveStepComponent = activeStepDialog !== null ? steps[activeStepDialog]?.component : null;

  return (
    <>
      {/* Main Onboarding List Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-inter text-2xl font-semibold text-gray-800">
                Onboarding
              </DialogTitle>
              <span className="font-inter text-sm text-gray-500">
                {completedCount}/{totalSteps} Complete
              </span>
            </div>
          </DialogHeader>

          {/* Steps List */}
          <div className="space-y-4 mt-6">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isDisabled = index > 0 && !completedSteps.includes(index - 1);
              const canOpen = !isCompleted && !isDisabled;

              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-inter font-semibold text-gray-800 text-base">
                      {step.title}
                    </h3>
                    <p className="font-inter text-sm text-gray-500 mt-1">{step.description}</p>
                  </div>

                  <Button
                    onClick={() => handleOpenStep(index)}
                    disabled={isDisabled || isCompleted}
                    className={`ml-4 px-6 py-2 rounded-full font-inter font-medium transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : canOpen
                          ? 'bg-[#00008B] text-white hover:bg-[#00006B]'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-inter">
                Progress: {completedCount} of {totalSteps} steps completed
              </span>
              <span className="text-blue-600 font-semibold font-inter">
                {Math.round((completedCount / totalSteps) * 100)}%
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Step Dialog */}
      {activeStepDialog !== null && (
        <Dialog open={activeStepDialog !== null} onOpenChange={handleCloseStepDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-inter text-2xl font-semibold text-gray-800">
                {steps[activeStepDialog].title}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-2">{steps[activeStepDialog].description}</p>
            </DialogHeader>

            {/* Current Step Form */}
            {ActiveStepComponent && (
              <div className="mt-4">
                <ActiveStepComponent onComplete={handleStepComplete} />
              </div>
            )}

            {/* Error Display */}
            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Loading Indicator */}
            {isSubmitting && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-sm text-gray-600">Processing...</span>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
