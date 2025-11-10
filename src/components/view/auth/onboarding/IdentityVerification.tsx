'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';
import {
  identityVerificationSchema,
  TidentityVerification,
} from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';
import { useGeneral } from '@/context/generalProvider';

type defaultVal = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  bvn: string;
};

const defaultValues: defaultVal = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: new Date(),
  bvn: '',
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export default function IdentityVerification() {
  const route = useRouter();
  const form = useForm<TidentityVerification>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch } = form;
  const { isSubmitting, isValid } = formState;
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [usernameValidityLoading, setUsernameValidityLoading] = useState(false);
  const { loadUserData } = useGeneral();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const onSubmit = async (data: TidentityVerification) => {
    console.log(data);
  };

  return (
    <section className="bg-white p-5 rounded-lg">
      <Form {...form}>
        <h1 className="font-inter text-2xl font-bold text-zinc-700">Identity verification</h1>
        <p className="mb-5 font-inter text-zinc-500">
          Provide your personal information as it appears on your bank verification documents for
          accurate account matching and processing.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 items-center gap-3">
            <div>
              <ReHeading heading="First Name" size={'base'} />
              <ReInput name="firstName" />
            </div>
            <div>
              <ReHeading heading="Last Name" size={'base'} />
              <ReInput name="lastName" />
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-3">
            <div>
              <ReHeading heading="Gender" size={'base'} />
              <ReSelect name="gender" placeholder="Select" options={genderOptions} />
            </div>
            <div>
              <ReHeading heading="Date of Birth" size={'base'} />
              <ReInput type="date" name="dateOfBirth" />
            </div>
          </div>
          <div>
            <ReHeading heading="Enter BVN" size={'base'} />
            <ReInput name="bvn" />
          </div>
          <div className="mt-5 flex justify-end">
            {/* <DialogClose asChild> */}
            <ReButton
              className=" rounded-full bg-[#03045B] py-10 font-inter text-white sm:py-4"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Complete Onboarding
            </ReButton>
            {/* </DialogClose> */}
          </div>
        </form>
      </Form>
    </section>
  );
}
