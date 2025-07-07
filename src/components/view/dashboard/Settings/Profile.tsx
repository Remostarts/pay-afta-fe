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

  return (
    <div className="rounded-lg bg-white p-3">
      {/* profile information  */}
      <div className="grid grid-cols-12 gap-8 pb-10 md:gap-8">
        {/* Left: Avatar and heading */}
        <div className="col-span-12 flex flex-col items-center pt-4 md:col-span-3 md:items-center md:pt-8">
          <ReHeading
            heading="Profile Information"
            className="mb-4 self-start text-xl font-semibold md:self-start"
          />
          <div className="relative mb-6 md:mb-0">
            <Avatar className="mx-auto size-24">
              <Image alt="avatar" src="/Logo.svg" width={80} height={80} />
              <AvatarFallback>{user?.firstName?.[0] || ''}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute bottom-2 right-2 rounded-full border-2 border-white bg-blue-600 p-1 text-white shadow hover:bg-blue-700"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5 19h14v2H5v-2zm14.71-13.29a1 1 0 0 0-1.42 0l-1.34 1.34 2.12 2.12 1.34-1.34a1 1 0 0 0 0-1.42l-.7-.7zm-2.05 2.76-2.12-2.12L6 14.59V17h2.41l9.25-9.53z"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Right: Form card */}
        <div className="col-span-12 flex justify-center md:col-span-9">
          <div className="w-full max-w-2xl rounded-xl border bg-white p-4 md:p-8">
            <FormProvider {...profileInformationForm}>
              <form onSubmit={handleProfileSubmit(handleProfileSubmitForm)}>
                <div className="mb-4">
                  <ReInput
                    {...profileFormRegister('firstName')}
                    name="firstName"
                    label="First Name"
                    placeholder="Cameron"
                  />
                </div>
                <div className="mb-4">
                  <ReInput
                    {...profileFormRegister('lastName')}
                    name="lastName"
                    label="Last Name"
                    placeholder="Williamson"
                  />
                </div>
                <div className="mb-4">
                  <ReInput
                    name="username"
                    label="Username"
                    placeholder="@fullname.pfta"
                    readonly={true}
                  />
                </div>
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <ReInput
                      {...profileFormRegister('dateOfBirth')}
                      name="dateOfBirth"
                      type="date"
                      label="Date of Birth"
                      placeholder="12/04/1992"
                    />
                  </div>
                  <div>
                    <ReInput
                      {...profileFormRegister('gender')}
                      name="gender"
                      label="Gender"
                      placeholder="Male"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <ReInput
                    {...profileFormRegister('email')}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="fullname@example.com"
                    readonly={true}
                  />
                </div>
                <div className="mb-8">
                  <ReInput
                    {...profileFormRegister('phone')}
                    type="text"
                    name="phone"
                    label="Phone Number"
                    placeholder="+234908738733"
                    readonly={true}
                  />
                </div>
                <ReButton
                  className="mx-auto block w-full max-w-xs rounded-full bg-gray-400 text-lg text-white"
                  type="submit"
                  disabled={profileIsSubmitting}
                  isSubmitting={profileIsSubmitting}
                >
                  Edit Information
                </ReButton>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
