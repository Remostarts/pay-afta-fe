'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { changePassword } from '@/lib/actions/auth/signup.actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { changePassword } from '@/lib/actions/auth/signup.actions';
import {
  changePasswordSchema,
  profileInformationSchema,
  TChangePassInputs,
  TProfileInformation,
  TProfileUpdate,
} from '@/lib/validations/setting.validation';
import { useGeneral } from '@/context/generalProvider';
import { userProfileUpdate } from '@/lib/actions/root/user.action';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/;

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function Profile() {
  const { user, loadUserData } = useGeneral();
  const changePasswordForm = useForm<TChangePassInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const defaultValuesOfprofileInformation = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dateOfBirth: user?.profile?.dateOfBirth || '',
    gender: user?.profile?.gender || '',
  };

  const profileInformationForm = useForm<TProfileInformation>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: defaultValuesOfprofileInformation,
    mode: 'onChange',
  });

  const { handleSubmit, register, formState } = changePasswordForm;

  const { isSubmitting } = formState;

  const {
    handleSubmit: handleProfileSubmit,
    formState: profileFormState,
    register: profileFormRegister,
  } = profileInformationForm;
  const { isSubmitting: profileIsSubmitting } = profileFormState;

  // profile info submitHandler
  const handleProfileSubmitForm = async (data: TProfileInformation) => {
    console.log(data);
    const modifiedData: TProfileUpdate = {
      dateOfBirth: data?.dateOfBirth,
      firstName: data?.firstName,
      lastName: data?.lastName,
      gender: data?.gender,
    };
    try {
      const response = await userProfileUpdate(modifiedData);
      console.log(
        '🌼 🔥🔥 constonSubmit:SubmitHandler<TChangePassInputs>= 🔥🔥 response🌼',
        response
      );

      if (response.success) {
        toast.success('profile updated successfully');
        // Reset form or redirect user as needed
        // profileInformationForm.reset();
        loadUserData();
      } else {
        // toast({
        //   title: 'Error',
        //   description: response.error || 'Failed to change password',
        //   variant: 'destructive',
        // });
        toast.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // toast({
      //   title: 'Error',
      //   description: 'An unexpected error occurred',
      //   variant: 'destructive',
      // });
      toast.error('An unexpected error occurred');
    }
  };

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
    <div className="rounded-lg bg-white p-3">
      {/* profile information  */}
      <div className="grid grid-cols-2 gap-4 border-b pb-10">
        <div>
          <ReHeading heading="Profile Information" className="mb-4 text-xl font-semibold" />
        </div>
        <div className="grid gap-4">
          <FormProvider {...profileInformationForm}>
            <form onSubmit={handleProfileSubmit(handleProfileSubmitForm)}>
              <div className="col-span-2">
                <ReInput
                  {...profileFormRegister('firstName')}
                  name="firstName"
                  label="First Name"
                  placeholder="Cameron" /* readonly={true} */
                />
              </div>
              <div className="col-span-2">
                <ReInput
                  {...profileFormRegister('lastName')}
                  name="lastName"
                  label="Last Name"
                  placeholder="Williamson" /* readonly={true} */
                />
              </div>
              {/* <div className="col-span-2">
                <ReInput
                  {...profileFormRegister('phone')}
                  type="number"
                  name="phone"
                  label="Phone Number"
                  placeholder="+234-9033-2314-423"
                  readonly={true}
                />
              </div> */}
              <div className="col-span-2">
                <ReInput
                  {...profileFormRegister('email')}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Kelly.Heller@gmail.com"
                  readonly={true}
                />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <ReInput
                    {...profileFormRegister('dateOfBirth')}
                    name="dateOfBirth"
                    type="date"
                    label="Date of Birth"
                    placeholder="12/04/2024" /* readonly={true} */
                  />
                </div>
                <div>
                  <ReInput
                    {...profileFormRegister('gender')}
                    name="gender"
                    label="Gender"
                    placeholder="Male" /* readonly={true} */
                  />
                </div>
              </div>
              <div className="col-span-2">
                <ReButton
                  className="mt-5 rounded-full lg:w-2/5"
                  type="submit"
                  disabled={profileIsSubmitting}
                  isSubmitting={profileIsSubmitting}
                >
                  Edit Information
                </ReButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border-b bg-white p-3 pb-10">
        <div>
          <ReHeading heading="Change Password" className="mb-4 text-xl font-semibold" />
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
    </div>
  );
}
