'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';
import {
  ninVerificationSchema,
  TNinVerificationSchema,
} from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';

interface NINVerificationFormProps {
  onComplete?: (result?: any) => void;
  isSubmitting?: boolean;
  existingData?: TNinVerificationSchema;
}

const defaultValues: TNinVerificationSchema = {
  nin: '',
};

export default function NINVerificationForm({
  onComplete,
  isSubmitting = false,
  existingData,
}: NINVerificationFormProps = {}) {
  const [isValidating, setIsValidating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<TNinVerificationSchema>({
    resolver: zodResolver(ninVerificationSchema),
    defaultValues: existingData || defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch } = form;
  const { errors, isValid } = formState;
  const ninValue = watch('nin');

  // Simulate NIN verification (in real app, this would call an actual API)
  const validateNIN = async (nin: string) => {
    setIsValidating(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate validation logic
      if (nin.length === 11 && /^\d{11}$/.test(nin)) {
        setIsVerified(true);
        toast.success('NIN verified successfully!');
        return true;
      } else {
        setIsVerified(false);
        toast.error('Invalid NIN format. Please enter 11 digits.');
        return false;
      }
    } catch (error) {
      setIsVerified(false);
      toast.error('Failed to verify NIN. Please try again.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Auto-validate NIN when user stops typing
  useEffect(() => {
    if (ninValue?.length === 11 && isValid) {
      const timeoutId = setTimeout(() => {
        validateNIN(ninValue);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [ninValue, isValid]);

  const onSubmit = async (data: TNinVerificationSchema) => {
    if (!isVerified) {
      toast.error('Please verify your NIN first');
      return;
    }

    try {
      if (onComplete) {
        onComplete(data);
      }
    } catch (error) {
      console.error('NIN verification error:', error);
      toast.error('Failed to process NIN verification');
    }
  };

  const getNINStatusIcon = () => {
    if (isValidating) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (isVerified) return <Check className="w-4 h-4 text-green-500" />;
    if (errors.nin) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getNINStatusText = () => {
    if (isValidating) return 'Validating NIN...';
    if (isVerified) return 'NIN verified';
    if (errors.nin) return errors.nin.message;
    if (ninValue?.length === 11) return 'Click to verify NIN';
    return 'Enter your 11-digit NIN';
  };

  return (
    <section className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <ReHeading heading="NIN" size={'base'} className="text-gray-700" />
            <div className="relative">
              <ReInput
                name="nin"
                placeholder="12345678901"
                className={`pr-20 ${isVerified ? 'border-green-500' : errors.nin ? 'border-red-500' : ''}`}
              />
            </div>

            {/* Helpful Text */}
            {ninValue && ninValue.length < 11 && (
              <p className="text-xs text-gray-400">NIN must be exactly 11 digits</p>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Why we need your NIN:</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Verify your identity for security purposes</li>
              <li>• Comply with regulatory requirements</li>
              <li>• Enable secure transactions</li>
              <li>• Protect your account from unauthorized access</li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <ReButton
              className="w-full sm:w-2/5 rounded-full bg-[#03045B] py-6 font-inter text-white sm:py-4 disabled:opacity-50"
              type="submit"
              isSubmitting={isSubmitting}
              disabled={!isValid || !isVerified || isValidating}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
