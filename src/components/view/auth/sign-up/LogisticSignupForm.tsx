'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Logo from '../../../../../public/Logo.svg';

import RegistrationCompleted from './RegistrationComplete';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';
import { Form } from '@/components/ui/form';
import { useOtp } from '@/context/OtpProvider';
import { partialSignup } from '@/lib/actions/auth/signup.actions';
import {
  initialSignUpForLogisticSchema,
  initialSignUpSchema,
  TInitialSignUp,
  TInitialSignUpForLogistic,
} from '@/lib/validations/userAuth.validations';
import { PasswordStrengthIndicator } from './password-strength-indicator';

type defaultVal = {
  companyName: string;
  // firstName: string;
  // lastName: string;
  email: string;
  // phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const defaultValues: defaultVal = {
  companyName: '',
  // firstName: '',
  // lastName: '',
  email: '',
  // phoneNumber: '',
  password: '',
  confirmPassword: '',
};

export default function LogisticSignupForm() {
  const pathname = usePathname();
  const role = pathname?.split('/')[2];
  const date = new Date().toDateString();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  //   console.log('🌼 🔥🔥 SigninFormLawyer 🔥🔥 pathname🌼', role);
  const [isRegistrationCompleted, setIsRegistrationCompleted] = useState<boolean>(false);

  console.log(isRegistrationCompleted);

  const router = useRouter();
  const { setEmail, email } = useOtp();

  const form = useForm<TInitialSignUpForLogistic>({
    resolver: zodResolver(initialSignUpForLogisticSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TInitialSignUpForLogistic) => {
    console.log(data);
    // setIsRegistrationCompleted(true);

    try {
      setEmail(data.email);
      const response = await partialSignup(data);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        router.push('/sign-up/verification');
      } else {
        toast.error(response?.error || 'Sign up Failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign up Failed');
    }

    console.log(data);
  };

  return (
    <>
      <section>
        <div>
          <Link href="/">
            <Image src={Logo} alt="Pay afta" width={176} height={64} />
          </Link>
        </div>
        <div>
          <h1 className="mt-3 font-inter text-2xl font-bold">Register as a Logistics Partner</h1>
          <p className="font-inter">
            Submit your details to register your logistics company. Our team will reach out shortly
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mt-3 space-y-4">
              <div>
                <ReHeading heading="Company Name" size={'base'} />
                <ReInput name="companyName" />
              </div>
              {/* <div>
                <ReHeading heading="First Name" size={'base'} />
                <ReInput name="firstName" />
              </div> */}
              {/* <div>
                <ReHeading heading="Last Name" size={'base'} />
                <ReInput name="lastName" />
              </div> */}
              <div>
                <ReHeading heading="Email Address" size={'base'} />
                <ReInput name="email" />
              </div>
              {/* <div>
                <ReHeading heading="Phone Number" size="lg" />
                <RePhoneNumberInput name="phoneNumber" />
              </div> */}
              <div>
                <ReHeading heading="Password" size={'base'} />
                <RePassInput name="password" />
                <PasswordStrengthIndicator />
              </div>
              <div>
                <ReHeading heading="Confirm Password" size={'base'} />
                <RePassInput name="confirmPassword" />
              </div>
              <div>
                <input type="checkbox" name="" onChange={() => setIsChecked(!isChecked)} />
                <span className="ml-2">
                  You agree to the{' '}
                  <Link href="terms-and-condition" className="text-blue-700">
                    terms and conditions
                  </Link>{' '}
                  and acknowledge the{' '}
                  <Link href="privacy-policy" className="text-blue-700">
                    privacy policy
                  </Link>{' '}
                  and{' '}
                  <Link href="refund-policy" className="text-blue-700">
                    refund policy
                  </Link>
                </span>
              </div>
            </div>
            <div className="grid pt-2">
              <ReButton
                className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
                type="submit"
                isSubmitting={isSubmitting}
                disabled={!isChecked}
              >
                Create Account
              </ReButton>
            </div>
          </form>
        </Form>
      </section>
    </>
  );
}
