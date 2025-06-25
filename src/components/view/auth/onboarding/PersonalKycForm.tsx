'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import ReInput from '@/components/re-ui/re-input/ReInput';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';
import { personalKycSchema, TPersonalKyc } from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';
import { DialogClose } from '@/components/ui/dialog';
import { partialSignup } from '@/lib/actions/auth/signup.actions';
import { kycPersonalInfo } from '@/lib/actions/onboarding/onboarding.actions';

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

export default function PersonalKycForm({ manageCurrentStep = () => {} }) {
  const route = useRouter();
  const form = useForm<TPersonalKyc>({
    resolver: zodResolver(personalKycSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TPersonalKyc) => {
    console.log(data);

    try {
      const response = await kycPersonalInfo(data);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        manageCurrentStep();
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
          <div>
            <ReHeading heading="Gender" size={'base'} />
            <ReSelect name="gender" placeholder="Select" options={genderOptions} />
          </div>
          <div>
            <ReHeading heading="Date" size={'base'} />
            <ReDatePicker name="dateOfBirth" placeholder="Select" />
          </div>
          <div>
            <ReHeading heading="Username" size={'base'} />
            <ReInput name="username" placeholder="" />
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
