'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { Form } from '@/components/ui/form';
import { useOtp } from '@/context/OtpProvider';
import { partialSignup } from '@/lib/actions/auth/signup.actions';
import { initialSignUpSchema, TInitialSignUp } from '@/lib/validations/userAuth.validations';
import { PasswordStrengthIndicator } from './password-strength-indicator';
import Link from 'next/link';

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setEmail } = useOtp();

  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Extract query params from invite link
  const inviteEmail = searchParams.get('email') || '';
  const inviteRef = searchParams.get('ref') || '';

  const form = useForm<TInitialSignUp>({
    resolver: zodResolver(initialSignUpSchema),
    defaultValues: {
      email: inviteEmail,
      referral: inviteRef,
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState, setValue } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    // Pre-fill email and referral if coming from invite link
    if (inviteEmail) setValue('email', inviteEmail);
    if (inviteRef) setValue('referral', inviteRef);
  }, [inviteEmail, inviteRef, setValue]);

  const onSubmit = async (data: TInitialSignUp) => {
    try {
      setEmail(data.email);
      const response = await partialSignup(data);

      if (response?.success) {
        router.push('/sign-up/verification');
      } else {
        toast.error(response?.message || response?.error || 'Sign up failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign up Failed');
    }
  };

  return (
    <section className="mb-5">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <ReHeading heading="Email Address" size={'base'} />
            <ReInput name="email" readonly={!!inviteEmail} />
          </div>

          {/* Password */}
          <div>
            <ReHeading heading="Password" size={'base'} />
            <RePassInput name="password" />
            <PasswordStrengthIndicator />
          </div>

          {/* Confirm Password */}
          <div>
            <ReHeading heading="Confirm Password" size={'base'} />
            <RePassInput name="confirmPassword" />
          </div>

          {/* Referral Code */}
          <div>
            <ReHeading heading="Referral" size={'base'} />
            <ReInput name="referral" readonly={!!inviteRef} />
          </div>

          {/* Checkbox */}
          <div>
            <label className="flex items-start cursor-pointer select-none">
              <span className="relative flex items-center">
                <input
                  type="checkbox"
                  name="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm bg-white checked:bg-[#03045B] checked:border-[#03045B] focus:outline-none transition-colors duration-200"
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
            </label>
          </div>

          {/* Submit */}
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
