'use client';
import debounce from 'lodash/debounce';
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
import { useEffect, useState } from 'react';
import { usernameValidityCheck } from '@/lib/actions/onboarding/onboarding.actions';
import { Loader } from 'lucide-react';
import { useChats } from '@/context/ChatListProvider';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/;

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

export default function Profile() {
  const { user, loadUserData } = useGeneral();

  const { session } = useChats();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameValidityLoading, setUsernameValidityLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const changePasswordForm = useForm<TChangePassInputs>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const defaultValuesOfprofileInformation = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    dateOfBirth: user?.profile?.dateOfBirth
      ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] // <-- format to YYYY-MM-DD
      : '',
    gender: user?.profile?.gender || '',
  };

  const profileInformationForm = useForm<TProfileInformation>({
    resolver: zodResolver(profileInformationSchema),
    values: defaultValuesOfprofileInformation,
    mode: 'onChange',
  });

  // checking username validity
  const checkUsernameValidity = debounce(async (username: string) => {
    setIsUsernameValid(false);
    if (!username || username.length < 3) return;
    setUsernameValidityLoading(true);
    try {
      const response = await usernameValidityCheck(username);
      if (response?.statusCode === 200) {
        if (!response?.data?.available) {
          profileInformationForm.setError('username', {
            type: 'server',
            message: 'Username is not available',
          });
        } else {
          setIsUsernameValid(true);
          profileInformationForm.clearErrors('username');
        }
      }
    } catch (error) {
      profileInformationForm.setError('username', {
        type: 'server',
        message: 'Failed to check username availability',
      });
    } finally {
      setUsernameValidityLoading(false);
    }
  }, 500);

  const { watch } = profileInformationForm;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'username') {
        checkUsernameValidity(value.username as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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
    if (usernameValidityLoading) {
      toast.info('Wait for username availability check to finish');
      return;
    }
    // if (!isUsernameValid) {
    //   toast.error('Please choose a valid username');
    //   return;
    // }
    const modifiedData: TProfileUpdate = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      username: data?.username,
      dateOfBirth: data?.dateOfBirth,
      gender: data?.gender,
    };
    try {
      const response = await userProfileUpdate(modifiedData);

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

  // user image updated
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageUploading(true);
    const file = e.target.files?.[0];

    if (!file) return;

    // ✅ check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      setIsImageUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('data', JSON.stringify({ imgType: 'profile' }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-user-profile-image`,
        {
          method: 'PATCH',
          headers: {
            Authorization: session?.accessToken,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      toast.success('Profile image updated successfully 🎉');
      loadUserData(); // refresh user info
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsImageUploading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6">
      {/* profile information  */}
      <div className="flex flex-col gap-8 pb-10">
        {/* Top: Avatar and heading */}
        <div className="flex flex-col items-start">
          <ReHeading
            heading="Profile Information"
            className="mb-6 text-xl font-semibold text-gray-900"
          />
          {/* <div className="relative mx-auto">
            <Avatar className="size-28 border-4 border-white shadow-lg">
              <Image alt="avatar" src="/Logo.svg" width={112} height={112} />
              <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                {user?.firstName?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="border-3 absolute -bottom-1 -right-1 rounded-full border-white bg-blue-600 p-2 text-white shadow-lg transition-colors hover:bg-blue-700"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5 19h14v2H5v-2zm14.71-13.29a1 1 0 0 0-1.42 0l-1.34 1.34 2.12 2.12 1.34-1.34a1 1 0 0 0 0-1.42l-.7-.7zm-2.05 2.76-2.12-2.12L6 14.59V17h2.41l9.25-9.53z"
                />
              </svg>
            </button>
          </div> */}
          <div className="relative mx-auto">
            <label htmlFor="profileImage" className="relative inline-block cursor-pointer">
              <Avatar className="size-28 border-4 border-white shadow-lg">
                {isImageUploading ? (
                  <div className="flex size-full items-center justify-center bg-gray-100">
                    <Loader className="size-5 animate-spin text-gray-600" />
                  </div>
                ) : (
                  <AvatarImage src={user?.profileImage || '/Logo.svg'} alt="Profile" />
                )}
                <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                  {user?.firstName?.[0] || ''}
                </AvatarFallback>
              </Avatar>

              <Image
                src="/assets/dashboard/edit.svg"
                alt="edit"
                width={34}
                height={34}
                priority
                className="absolute right-0 top-20 rounded-full border-4 border-white bg-white p-1 shadow-md"
              />

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isImageUploading}
              />
            </label>

            <p className="mt-2 text-xs text-gray-500">Max file size: 5MB</p>
          </div>
        </div>

        {/* Bottom: Form card */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <FormProvider {...profileInformationForm}>
                <form onSubmit={handleProfileSubmit(handleProfileSubmitForm)}>
                  <div className="space-y-6">
                    <div>
                      <ReInput
                        {...profileFormRegister('firstName')}
                        name="firstName"
                        label="First Name"
                        placeholder="Paul"
                      />
                    </div>

                    <div>
                      <ReInput
                        {...profileFormRegister('lastName')}
                        name="lastName"
                        label="Last Name"
                        placeholder="Falade"
                      />
                    </div>

                    <div>
                      <ReInput
                        {...profileFormRegister('username')}
                        name="username"
                        label="Username"
                        placeholder="@fullname.pfta"
                      />
                      {usernameValidityLoading && (
                        <p className="text-sm text-blue-500">Checking username availability...</p>
                      )}
                      {!usernameValidityLoading && isUsernameValid && (
                        <p className="text-sm text-green-500">Username is available ✅</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                    <div>
                      <ReInput
                        {...profileFormRegister('email')}
                        // isDisabled={true}
                        name="email"
                        label="Email Address"
                        type="email"
                        placeholder="fullname@example.com"
                        readonly={true}
                      />
                    </div>

                    <div>
                      <ReInput
                        {...profileFormRegister('phone')}
                        // isDisabled={true}
                        type="text"
                        name="phone"
                        label="Phone Number"
                        placeholder="+234908738733"
                        readonly={true}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <ReButton
                      className="min-w-[160px] rounded-full bg-gray-400 px-8 py-3 text-white transition-colors hover:bg-gray-500"
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
        </div>
      </div>
    </div>
  );
}
