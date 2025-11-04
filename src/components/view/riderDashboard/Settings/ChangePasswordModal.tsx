'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';

import SecuritySuccessModal from './SecuritySuccessModal';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { changePassword } from '@/lib/actions/auth/signup.actions';
import { changePasswordSchema, TChangePassInputs } from '@/lib/validations/setting.validation';
import ReSubHeading from '@/components/re-ui/ReSubHeading';

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

interface ChangePasswordModalProps {
  dialogClose: Dispatch<SetStateAction<boolean>>;
}

export default function ChangePasswordModal({ dialogClose }: ChangePasswordModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const changePasswordForm = useForm<TChangePassInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = changePasswordForm;

  const { isSubmitting } = formState;

  // change password submithandler
  const onSubmit: SubmitHandler<TChangePassInputs> = async (data) => {
    try {
      const response = await changePassword(data);
      if (response.success) {
        changePasswordForm.reset();
        setShowSuccess(true);
      } else {
        toast.error(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An unexpected error occurred');
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
        <>
          <h1 className="mb-5 font-inter text-2xl font-semibold text-gray-800">Change Password</h1>
          <FormProvider {...changePasswordForm}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <RePassInput
                  {...register('currentPassword')}
                  name="currentPassword"
                  label="Old Password"
                  required
                />
              </div>
              <div>
                <RePassInput
                  {...register('newPassword')}
                  name="newPassword"
                  label="New Password"
                  required
                />
              </div>
              <div>
                <RePassInput
                  {...register('confirmNewPassword')}
                  name="confirmNewPassword"
                  label="Confirm Password"
                  required
                />
              </div>
              <div className="flex justify-end">
                <ReButton
                  disabled={isSubmitting}
                  isSubmitting={isSubmitting}
                  type="submit"
                  className="rounded-full text-white lg:w-2/5"
                >
                  Submit
                </ReButton>
              </div>
            </form>
          </FormProvider>
        </>
      )}
    </div>
  );
}
