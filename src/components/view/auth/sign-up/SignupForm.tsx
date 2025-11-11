'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Logo from '../../../../../public/Logo.svg';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { RePhoneNumberInput } from '@/components/re-ui/re-input/RePhoneNumberInput';
import { Form } from '@/components/ui/form';
import { useOtp } from '@/context/OtpProvider';
import { partialSignup } from '@/lib/actions/auth/signup.actions';
import { initialSignUpSchema, TInitialSignUp } from '@/lib/validations/userAuth.validations';
import { PasswordStrengthIndicator } from './password-strength-indicator';

type defaultVal = {
  email: string;
  password: string;
  confirmPassword: string;
};

const defaultValues: defaultVal = {
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignupForm() {
  const pathname = usePathname();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const router = useRouter();
  const { setEmail, email } = useOtp();

  const form = useForm<TInitialSignUp>({
    resolver: zodResolver(initialSignUpSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TInitialSignUp) => {
    try {
      setEmail(data.email);
      const response = await partialSignup(data);
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        router.push('/sign-up/verification');
      } else {
        toast.error(response?.error || response?.message || 'Sign up failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign up Failed');
    }

    // if (isValid) {
    //   router.push('/sign-up/verification');
    // }
  };

  return (
    <section className="mb-5">
      {/* <div>
        <Link href="/">
          <Image src={Logo} alt="Pay afta" width={176} height={64} />
        </Link>
      </div>
      <div>
        <h1 className="mt-3 font-inter text-2xl font-bold">Sign up</h1>
        <p className="font-inter">
          Already registered?{' '}
          <Link href="/sign-in" className="font-semibold">
            Sign in
          </Link>
        </p>
      </div> */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mt-3 space-y-4">
            {/* <div>
              <ReHeading heading="First Name" size={'base'} />
              <ReInput name="firstName" />
            </div>
            <div>
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
              <ReHeading heading="Referral" size={'base'} />
              <ReInput name="referral" />
            </div>

            <div>
              <label className="flex items-start cursor-pointer select-none">
                <span className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm bg-white checked:bg-[#03045B] checked:border-[#03045B] focus:outline-none
                                transition-colors duration-200"
                  />
                  <span className="pointer-events-none absolute left-0 top-0 flex justify-center items-center w-5 h-5">
                    {isChecked && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        viewBox="0 0 20 20"
                      >
                        <polyline
                          points="4 11 8 15 16 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </span>
                <span className="ml-2 text-sm">
                  You agree to the{' '}
                  <Link
                    href="terms-and-condition"
                    className="text-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    terms and conditions
                  </Link>{' '}
                  and acknowledge the{' '}
                  <Link
                    href="privacy-policy"
                    className="text-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    privacy policy
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="refund-policy"
                    className="text-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    refund policy
                  </Link>
                </span>
              </label>
            </div>
          </div>
          <div className="grid pt-2 mb-5">
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
  );
}
