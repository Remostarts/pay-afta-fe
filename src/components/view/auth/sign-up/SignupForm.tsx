'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Link from 'next/link';

import Logo from '../../../../../public/Logo.svg';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { Form } from '@/components/ui/form';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { initialSignUpSchema, TInitialSignUp } from '@/lib/validations/userAuth.validations';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';

type defaultVal = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const defaultValues: defaultVal = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

export default function SignupForm() {
  const pathname = usePathname();
  const role = pathname?.split('/')[2];
  const date = new Date().toDateString();
  //   console.log('🌼 🔥🔥 SigninFormLawyer 🔥🔥 pathname🌼', role);

  const router = useRouter();

  const form = useForm<TInitialSignUp>({
    resolver: zodResolver(initialSignUpSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TInitialSignUp) => {
    console.log(data);

    if (isValid) {
      router.push('/sign-up/verification');
    }
  };

  return (
    <section>
      <div>
        <Image src={Logo} alt="Pay afta" width={176} height={64} />
      </div>
      <div>
        <h1 className="mt-3 font-inter text-2xl font-bold">Sign up</h1>
        <p className="font-inter">
          Already registered?{' '}
          <Link href="/sign-in" className="font-semibold">
            Sign in
          </Link>
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mt-3 space-y-4">
            <div>
              <ReHeading heading="First Name" size={'base'} />
              <ReInput name="firstName" />
            </div>
            <div>
              <ReHeading heading="Last Name" size={'base'} />
              <ReInput name="lastName" />
            </div>
            <div>
              <ReHeading heading="Email Address" size={'base'} />
              <ReInput name="email" />
            </div>
            <div>
              {/* <ReHeading heading="Phone Number" size="lg" /> */}
              <RePhoneNumberInput name="phoneNumber" />
            </div>
            <div>
              <ReHeading heading="Password" size={'base'} />
              <RePassInput name="password" />
            </div>
            <div>
              <ReHeading heading="Confirm Password" size={'base'} />
              <RePassInput name="confirmPassword" />
            </div>
          </div>
          <div className="grid pt-2">
            <ReButton
              className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Create Account
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
