'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Dispatch, SetStateAction, useState } from 'react';

import SecuritySuccessModal from './SecuritySuccessModal';

import { Form } from '@/components/ui/form';
import { kycPin } from '@/lib/actions/onboarding/onboarding.actions';
import { ReHeading } from '@/components/re-ui/ReHeading';
import RePin from '@/components/re-ui/RePin';
import { PinFormData, pinSchema } from '@/lib/validations/setting.validation';

interface TransactionPinProps {
  onComplete: (pin: string) => void;
  manageCurrentStep?: () => void;
}

interface ChangeTransactionPinModalProps {
  dialogClose: Dispatch<SetStateAction<boolean>>;
}

export default function ChangeTransactionPinModal({ dialogClose }: ChangeTransactionPinModalProps) {
  const form = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      oldPin: '',
      pin: '',
      confirmPin: '',
    },
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data: PinFormData) => {
    try {
      // Call your API endpoint here to change the PIN
      console.log(data);
      form.reset();
      setShowSuccess(true);
    } catch (error) {
      toast.error('An error occurred while changing the PIN');
    }
  };

  function CloseFunctionality() {
    setShowSuccess(false);
    dialogClose(false);
  }

  return (
    <div>
      {showSuccess ? (
        <SecuritySuccessModal onClose={CloseFunctionality} />
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="">
              <h1 className="font-inter text-2xl font-semibold text-gray-800">
                Change Transaction Pin
              </h1>

              <div className="mt-8">
                <ReHeading heading="Old Pin" size={'base'} />
                <RePin
                  count={4}
                  name="oldPin"
                  onChange={(value) => form.setValue('oldPin', value)}
                  error={!!form.formState.errors.pin}
                  className="my-2"
                />
                {form.formState.errors.pin && (
                  <p className="text-sm text-red-500">{form.formState.errors.pin.message}</p>
                )}
              </div>

              <div className="mt-8">
                <ReHeading heading="Enter New Pin" size={'base'} />
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
                <ReHeading heading="Confirm New Pin" size={'base'} />
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
              <p className="text-center text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
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
      )}
    </div>
  );
}
