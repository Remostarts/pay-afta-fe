'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import RePin from '../../../re-ui/RePin';

import { Form } from '@/components/ui/form';
import { kycPin } from '@/lib/actions/onboarding/onboarding.actions';
import { PinFormData, pinSchema } from '@/lib/validations/onboarding.validation';
import { ReHeading } from '@/components/re-ui/ReHeading';

interface TransactionPinProps {
  onComplete: (pin: string) => void;
  manageCurrentStep?: () => void;
}

export default function TransactionPin({ onComplete, manageCurrentStep }: TransactionPinProps) {
  const form = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: PinFormData) => {
    try {
      // setIsSubmitting(true);
      // onComplete(data.pin);
      console.log(data);
      if (manageCurrentStep) {
        const response = await kycPin(data);
        console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

        if (response?.success) {
          manageCurrentStep();
        } else {
          toast.error(response?.error || 'Failed to update kyc pin');
        }
      }
    } catch (error) {
      console.error('Error submitting PIN:', error);
      form.setError('root', {
        message: 'An error occurred while setting your PIN. Please try again.',
      });

      toast.error(error instanceof Error ? error.message : 'Failed to update kyc pin');
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <h1 className="font-inter text-2xl font-semibold text-gray-800">Transaction PIN</h1>

          <div className="mt-8">
            <ReHeading heading="Enter Verification Code" size={'base'} />
            <RePin
              count={4}
              name="pin"
              onChange={(value) => form.setValue('pin', value)}
              error={!!form.formState.errors.pin}
              className="my-2"
            />
            {form.formState.errors.pin && (
              <p className="text-sm text-red-500">{form.formState.errors.pin.message}</p>
            )}
          </div>

          <div className="mt-6">
            <ReHeading heading="Confirm Verification Code" size={'base'} />
            <RePin
              count={4}
              name="confirmPin"
              onChange={(value) => form.setValue('confirmPin', value)}
              error={!!form.formState.errors.confirmPin}
              className="my-2"
            />
            {form.formState.errors.confirmPin && (
              <p className="text-sm text-red-500">{form.formState.errors.confirmPin.message}</p>
            )}
          </div>
        </div>

        {form.formState.errors.root && (
          <p className="text-center text-sm text-red-500">{form.formState.errors.root.message}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-2/5 rounded-full bg-[#03045B] py-3 font-inter text-white transition-all duration-200 
              hover:bg-[#02034d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Setting PIN...' : 'Submit'}
          </button>
        </div>
      </form>
    </Form>
  );
}
