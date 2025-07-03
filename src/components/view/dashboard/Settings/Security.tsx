'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { changePassword } from '@/lib/actions/auth/signup.actions';
import { changePasswordSchema, TChangePassInputs } from '@/lib/validations/setting.validation';

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function Security() {
  const changePasswordForm = useForm<TChangePassInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = changePasswordForm;

  const { isSubmitting } = formState;

  // change password submithandler
  const onSubmit: SubmitHandler<TChangePassInputs> = async (data) => {
    console.log(data);
    try {
      const response = await changePassword(data);
      console.log(
        '🌼 🔥🔥 constonSubmit:SubmitHandler<TChangePassInputs>= 🔥🔥 response🌼',
        response
      );

      if (response.success) {
        toast.success('Password changed successfully');
        // Reset form or redirect user as needed
        changePasswordForm.reset();
      } else {
        // toast({
        //   title: 'Error',
        //   description: response.error || 'Failed to change password',
        //   variant: 'destructive',
        // });
        toast.error(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // toast({
      //   title: 'Error',
      //   description: 'An unexpected error occurred',
      //   variant: 'destructive',
      // });
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border-b bg-white p-3 pb-10">
      <div>
        <ReHeading heading="Security & Privacy" className="mb-4 text-xl font-semibold" />
      </div>
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
          <ReButton
            disabled={isSubmitting}
            isSubmitting={isSubmitting}
            type="submit"
            className="rounded-full text-white lg:w-2/5"
          >
            Submit
          </ReButton>
        </form>
      </FormProvider>
    </div>
  );
}
