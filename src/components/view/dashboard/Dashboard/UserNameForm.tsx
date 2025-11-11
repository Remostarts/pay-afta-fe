'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Check, AlertCircle, Loader2, User } from 'lucide-react';
import debounce from 'lodash/debounce';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';
import { TUsername, usernameSchema } from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';
import { usernameValidityCheck } from '@/lib/actions/onboarding/onboarding.actions';

interface UserNameFormProps {
  onComplete?: (result?: any) => void;
  isSubmitting?: boolean;
  existingData?: TUsername;
}

const defaultValues: TUsername = {
  username: '',
};

export default function UserNameForm({
  onComplete,
  isSubmitting = false,
  existingData,
}: UserNameFormProps = {}) {
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameValidityLoading, setUsernameValidityLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const form = useForm<TUsername>({
    resolver: zodResolver(usernameSchema),
    defaultValues: existingData || defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch } = form;
  const { errors, isValid } = formState;
  const usernameValue = watch('username');

  // Debounced username validation
  const checkUsernameValidity = debounce(async (username: string) => {
    setIsUsernameValid(false);
    setValidationMessage('');

    if (username.length < 3) {
      setValidationMessage('Username must be at least 3 characters');
      return;
    }

    setUsernameValidityLoading(true);
    try {
      const response = await usernameValidityCheck(username);
      console.log('Username validation response:', response);

      if (response?.statusCode === 200) {
        if (!response?.data?.available) {
          setIsUsernameValid(false);
          setValidationMessage('This username is not available');
        } else if (response?.data?.available) {
          setIsUsernameValid(true);
          setValidationMessage('Username is available');
        }
      } else {
        setValidationMessage('Failed to check username availability');
      }
    } catch (error) {
      console.error('Username validation error:', error);
      setValidationMessage('Failed to check username availability');
    } finally {
      setUsernameValidityLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (usernameValue) {
      checkUsernameValidity(usernameValue);
    }
    return () => {
      checkUsernameValidity.cancel();
    };
  }, [usernameValue]);

  const onSubmit = async (data: TUsername) => {
    if (usernameValidityLoading) {
      toast.info('Wait for username availability check to finish');
      return;
    }

    if (!isUsernameValid) {
      if (validationMessage.includes('not available')) {
        toast.error('This username is not available. Please choose another.');
      } else if (validationMessage.includes('Failed to check')) {
        toast.error('Unable to verify username. Please try again.');
      } else {
        toast.error('Please enter a valid username');
      }
      return;
    }

    try {
      if (onComplete) {
        onComplete(data);
      }
    } catch (error) {
      console.error('Username update error:', error);
      toast.error('Failed to update username');
    }
  };

  const getUsernameStatusIcon = () => {
    if (usernameValidityLoading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (isUsernameValid && usernameValue) return <Check className="w-4 h-4 text-green-500" />;
    if (errors.username || validationMessage.includes('not available'))
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (usernameValue && !usernameValidityLoading)
      return <User className="w-4 h-4 text-gray-400" />;
    return null;
  };

  const getUsernameStatusText = () => {
    if (usernameValidityLoading) return 'Checking availability...';
    if (isUsernameValid && usernameValue) return 'Username is available';
    if (errors.username) return errors.username.message;
    if (validationMessage) return validationMessage;
    if (usernameValue?.length < 3) return 'Username must be at least 3 characters';
    return 'Choose a unique username';
  };

  const getUsernameStatusColor = () => {
    if (usernameValidityLoading) return 'text-blue-600';
    if (isUsernameValid && usernameValue) return 'text-green-600';
    if (errors.username || validationMessage.includes('not available')) return 'text-red-600';
    if (validationMessage.includes('Failed to check')) return 'text-red-600';
    if (usernameValue && !usernameValidityLoading) return 'text-gray-600';
    return 'text-gray-500';
  };

  return (
    <section className="space-y-6">
      {/* <div className="text-center space-y-2">
        <h1 className="font-inter text-2xl font-bold text-zinc-700">Choose Your Username</h1>
        <p className="font-inter text-zinc-500 text-sm">
          Select a unique username that represents you on the platform
        </p>
      </div> */}

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <ReHeading heading="Username" size={'base'} className="text-gray-700" />
            <div className="relative">
              <ReInput
                name="username"
                placeholder="john_doe"
                className={`pr-20 ${
                  isUsernameValid && usernameValue
                    ? 'border-green-500'
                    : errors.username || validationMessage.includes('not available')
                      ? 'border-red-500'
                      : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {getUsernameStatusIcon()}
              </div>
            </div>

            {/* Status Message */}
            <div className={`flex items-center gap-2 text-sm ${getUsernameStatusColor()}`}>
              {getUsernameStatusText()}
            </div>

            {/* Username Guidelines */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Username Guidelines:</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Must be 3-30 characters long</li>
                <li>• Can contain letters, numbers, and underscores only</li>
                <li>• Must be unique across the platform</li>
                <li>• Cannot contain spaces or special characters</li>
              </ul>
            </div>

            {/* Preview */}
            {usernameValue && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Your profile URL will be: <span className="font-mono">pay-afta.com/@</span>
                  <span className="font-semibold">{usernameValue}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <ReButton
              className="w-full sm:w-2/5 rounded-full bg-[#03045B] py-6 font-inter text-white sm:py-4 disabled:opacity-50"
              type="submit"
              isSubmitting={isSubmitting}
              disabled={!isValid || !isUsernameValid || usernameValidityLoading}
            >
              {isSubmitting ? 'Setting Username...' : 'Continue'}
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
