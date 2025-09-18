'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import debounce from 'lodash/debounce';

import ReInput from '@/components/re-ui/re-input/ReInput';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';
import { personalKycSchema, TPersonalKyc } from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';
import { DialogClose } from '@/components/ui/dialog';
import { partialSignup } from '@/lib/actions/auth/signup.actions';
import {
  usernameValidityCheck,
  kycPersonalInfo,
} from '@/lib/actions/onboarding/onboarding.actions';
import { useGeneral } from '@/context/generalProvider';

type defaultVal = {
  nin: string;
  gender: string;
  dateOfBirth: Date;
  username: string;
  instaUsername: string;
  facebookUsername: string;
};

const defaultValues: defaultVal = {
  nin: '',
  gender: '',
  dateOfBirth: new Date(),
  username: '',
  instaUsername: '',
  facebookUsername: '',
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function PersonalKycForm() {
  const route = useRouter();
  const form = useForm<TPersonalKyc>({
    resolver: zodResolver(personalKycSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch } = form;
  const { isSubmitting, isValid } = formState;
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameValidityLoading, setUsernameValidityLoading] = useState(false);
  const { loadUserData } = useGeneral();

  const checkUsernameValidity = debounce(async (username: string) => {
    setIsUsernameValid(false);
    if (username.length < 3) return;
    setUsernameValidityLoading(true);
    try {
      const response = await usernameValidityCheck(username);
      console.log('🌼 🔥🔥 PersonalKycForm 🔥🔥 response🌼', response);

      if (response?.statusCode === 200) {
        if (!response?.data?.available)
          form.setError('username', {
            type: 'server',
            message: 'username is not available',
          });
        else if (response?.data?.available) setIsUsernameValid(true);
      }

      // else setIsUsernameValid(false);
      // form.setError('username', {
      //   type: 'server',
      //   message: response?.errorMessages[0]?.message,
      // });
    } catch (error) {
      console.log('🌼 🔥🔥 PersonalKycForm 🔥🔥 error🌼', error);
      form.setError('username', {
        type: 'server',
        message: 'Failed to check username availability',
      });
    } finally {
      setUsernameValidityLoading(false);
    }
  }, 500);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'username') {
        checkUsernameValidity(value.username as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: TPersonalKyc) => {
    console.log(data);
    if (usernameValidityLoading) {
      toast.info('Wait for username availability check to finish');
      return;
    }

    try {
      const response = await kycPersonalInfo(data);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        loadUserData();
      } else {
        toast.error(response?.error || 'Failed to update personal information');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update personal information');
    }
  };

  return (
    <section>
      <Form {...form}>
        <h1 className="font-inter text-2xl font-bold text-zinc-700">Personal Information</h1>
        <p className="mb-5 font-inter text-zinc-500">
          Provide your personal information as it appears on your bank verification documents for
          accurate account matching and processing.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Enter NIN" size={'base'} />
            <ReInput name="nin" />
          </div>
          <div className="grid grid-cols-2 items-center gap-3">
            <div>
              <ReHeading heading="Gender" size={'base'} />
              <ReSelect name="gender" placeholder="Select" options={genderOptions} />
            </div>
            <div>
              <ReHeading heading="Date" size={'base'} />
              <ReDatePicker name="dateOfBirth" placeholder="Select" />
            </div>
          </div>
          <div>
            <ReHeading heading="Username" size={'base'} />
            <div className="relative">
              <ReInput name="username" placeholder="" />
              {isUsernameValid && (
                <p className="mb-2 text-sm text-green-500">username is available</p>
              )}
              {/*  {isUsernameValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Image
                    src="/assets/auth/onboarding/check 2.svg"
                    alt="valid username"
                    width={20}
                    height={20}
                  />
                </div>
              )} */}
            </div>
          </div>
          <div>
            <ReHeading heading="Instagram Username (optional)" size={'base'} />
            <ReInput name="instaUsername" placeholder="@" />
          </div>
          <div>
            <ReHeading heading="Facebook Username (optional)" size={'base'} />
            <ReInput name="facebookUsername" placeholder="www.facebook.com/" />
          </div>
          <div className="mt-3 flex justify-end">
            {/* <DialogClose asChild> */}
            <ReButton
              className="w-2/5 rounded-full bg-[#03045B] py-6 font-inter text-white sm:py-4"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Submit
            </ReButton>
            {/* </DialogClose> */}
          </div>
        </form>
      </Form>
    </section>
  );
}
