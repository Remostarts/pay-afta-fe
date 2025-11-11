'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2, Shield } from 'lucide-react';

import RePin from '../../../re-ui/RePin';

import { Form } from '@/components/ui/form';
import { kycPin } from '@/lib/actions/onboarding/onboarding.actions';
import { PinFormData, pinSchema } from '@/lib/validations/onboarding.validation';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { useGeneral } from '@/context/generalProvider';

interface TransactionPinProps {
  onComplete: (pin: string) => void;
  isSubmitting?: boolean;
  existingData?: PinFormData;
}

export default function TransactionPin({
  onComplete,
  isSubmitting = false,
  existingData,
}: TransactionPinProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isPinValid, setIsPinValid] = useState(false);
  const { loadUserData } = useGeneral();

  const form = useForm<PinFormData>({
    resolver: zodResolver(pinSchema),
    defaultValues: existingData || {
      pin: '',
      confirmPin: '',
    },
  });

  const { handleSubmit, formState, setValue, watch } = form;
  const { errors } = formState;
  const pinValue = watch('pin');
  const confirmPinValue = watch('confirmPin');

  // Update validation when values change
  useEffect(() => {
    if (pinValue && confirmPinValue) {
      if (pinValue.length === 4 && confirmPinValue.length === 4) {
        if (pinValue === confirmPinValue) {
          setIsPinValid(true);
        } else {
          setIsPinValid(false);
        }
      } else {
        setIsPinValid(false);
      }
    }
  }, [pinValue, confirmPinValue]);

  const onSubmit = async (data: PinFormData) => {
    if (!isPinValid) {
      toast.error('Please ensure both PINs match and are 4 digits');
      return;
    }

    setIsValidating(true);
    try {
      const response = await kycPin(data);
      console.log('Transaction PIN response:', response);

      if (response?.success) {
        loadUserData();
        onComplete(data.pin);
        toast.success('Transaction PIN created successfully! 🔒');
      } else {
        toast.error(response?.error || 'Failed to create transaction PIN');
      }
    } catch (error) {
      console.error('Error submitting PIN:', error);
      form.setError('root', {
        message: 'An error occurred while setting your PIN. Please try again.',
      });
      toast.error(error instanceof Error ? error.message : 'Failed to create transaction PIN');
    } finally {
      setIsValidating(false);
    }
  };

  const getPinStatusIcon = (field: 'pin' | 'confirmPin') => {
    const value = field === 'pin' ? pinValue : confirmPinValue;
    const otherValue = field === 'pin' ? confirmPinValue : pinValue;

    if (value?.length === 4) {
      if (otherValue?.length === 4) {
        return value === otherValue ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-500" />
        );
      }
      return <Shield className="w-4 h-4 text-gray-400" />;
    }
    return null;
  };

  const getPinStatusText = (field: 'pin' | 'confirmPin') => {
    const value = field === 'pin' ? pinValue : confirmPinValue;
    const otherValue = field === 'pin' ? confirmPinValue : pinValue;
    const error = errors[field];

    if (error) return error.message;
    if (value?.length === 4) {
      if (otherValue?.length === 4) {
        return value === otherValue ? 'PINs match' : 'PINs do not match';
      }
      return 'PIN entered';
    }
    return field === 'pin' ? 'Enter 4-digit PIN' : 'Confirm your PIN';
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="font-inter text-2xl font-bold text-zinc-700">Create Transaction PIN</h1>
          <p className="font-inter text-zinc-500 text-sm">
            Set up a 4-digit PIN for secure transactions
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <ReHeading heading="Transaction PIN" size={'base'} className="text-gray-700" />
            <div className="relative">
              <RePin
                count={4}
                name="pin"
                onChange={(value) => setValue('pin', value, { shouldValidate: true })}
                error={!!errors.pin}
                className="my-2"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getPinStatusIcon('pin')}
              </div>
            </div>
            <div
              className={`text-sm ${
                errors.pin
                  ? 'text-red-600'
                  : pinValue?.length === 4
                    ? 'text-green-600'
                    : 'text-gray-500'
              }`}
            >
              {getPinStatusText('pin')}
            </div>
          </div>

          <div className="space-y-2">
            <ReHeading heading="Confirm PIN" size={'base'} className="text-gray-700" />
            <div className="relative">
              <RePin
                count={4}
                name="confirmPin"
                onChange={(value) => setValue('confirmPin', value, { shouldValidate: true })}
                error={!!errors.confirmPin}
                className="my-2"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getPinStatusIcon('confirmPin')}
              </div>
            </div>
            <div
              className={`text-sm ${
                errors.confirmPin
                  ? 'text-red-600'
                  : confirmPinValue?.length === 4
                    ? 'text-green-600'
                    : 'text-gray-500'
              }`}
            >
              {getPinStatusText('confirmPin')}
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security Information:
          </h3>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Your PIN will be used to authorize all transactions</li>
            <li>• Never share your PIN with anyone</li>
            <li>• Use a PIN that's easy for you to remember but hard for others to guess</li>
            <li>• You can change your PIN in account settings</li>
          </ul>
        </div>

        {form.formState.errors.root && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-700">{form.formState.errors.root.message}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isValidating || !isPinValid}
            className="w-full sm:w-2/5 rounded-full bg-[#03045B] py-3 font-inter text-white transition-all duration-200 
              hover:bg-[#02034d] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting || isValidating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting PIN...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Set PIN
              </>
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
