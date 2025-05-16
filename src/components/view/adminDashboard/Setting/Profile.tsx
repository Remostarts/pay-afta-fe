'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/;

export const resetPasswordSchema = z
  .object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, 'Password too short - should be 6 chars minimum')
      .max(100, 'Password too long - should be 100 chars maximum')
      .regex(
        passwordRegex,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
      ),
    confirmNewPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

export type TChangePassInputs = z.infer<typeof resetPasswordSchema>;

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function Profile() {
  const form = useForm<TChangePassInputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = form;

  const { isSubmitting } = formState;

  const onSubmit: SubmitHandler<TChangePassInputs> = async (data) => {
    console.log(data);
  };

  return (
    <div className="rounded-lg bg-white p-3">
      {/* profile information  */}
      <div className="grid grid-cols-2 gap-4 border-b pb-10">
        <div>
          <ReHeading heading="Profile Information" className="mb-4 text-xl font-semibold" />
        </div>
        <div className="grid gap-4">
          <div className="col-span-2">
            <ReInput name="firstName" label="First Name" placeholder="Cameron" readonly={true} />
          </div>
          <div className="col-span-2">
            <ReInput
              name="email"
              label="Email"
              placeholder="Kelly.Heller@gmail.com"
              readonly={true}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <ReInput name="DOB" label="Date of Birth" placeholder="12/04/2024" readonly={true} />
            </div>
            <div>
              <ReInput name="gender" label="Gender" placeholder="Male" readonly={true} />
            </div>
          </div>
          <div className="col-span-2">
            <ReButton className="mt-5 rounded-full lg:w-2/5" disabled={false}>
              {' '}
              Edit Information
            </ReButton>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border-b bg-white p-3 pb-10">
        <div>
          <ReHeading heading="Change Password" className="mb-4 text-xl font-semibold" />
        </div>
        <FormProvider {...form}>
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
    </div>
  );
}
