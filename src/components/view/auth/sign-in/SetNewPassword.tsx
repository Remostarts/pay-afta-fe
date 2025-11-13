'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';
import { resetPassword } from '@/lib/actions/auth/signup.actions';
import { TResetPassword, resetPasswordSchema } from '@/lib/validations/userAuth.validations';
import Link from 'next/link';

const defaultValues = {
  newPassword: '',
  confirmPassword: '',
};

export default function SetNewPassword() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') as string;
  console.log('🌼 🔥🔥 SetNewPassword 🔥🔥 code🌼', code);

  const email = decodeURIComponent(searchParams.get('email') as string);
  console.log('🌼 🔥🔥 SetNewPassword 🔥🔥 email🌼', email);

  const router = useRouter();
  const form = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: TResetPassword) => {
    const input = {
      email,
      newPassword: data.newPassword,
      emailVerificationCode: code,
      confirmNewPassword: data.confirmPassword,
    };
    try {
      const response = await resetPassword(input);

      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);

      if (response?.success) {
        toast.success('Password reset successfully');
      }

      router.push('/sign-in');
      // handleCurrentStep();
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong, please try again.'
      );
    }
  };

  return (
    <section className=" container mx-auto">
      <div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} />
        </Link>
      </div>
      <div className="mt-5">
        <h1 className="font-inter text-2xl font-semibold md:text-4xl">Create Password</h1>
        <p className="font-inter font-semibold text-[#666666] sm:text-sm">
          Password must be at least 6 characters long.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-10">
            <ReHeading heading="New Password" size={'base'} />
            <RePassInput name="newPassword" />
            <ul>
              <li className="md:text-md lg:text-md text-[#666666] sm:text-sm">
                minimum 8 character
              </li>
              <li className="md:text-md lg:text-md text-[#666666] sm:text-sm">
                one special character
              </li>
              <li className="md:text-md lg:text-md text-[#666666] sm:text-sm">one number</li>
              <li className="md:text-md lg:text-md text-[#666666] sm:text-sm">
                one Uppercase character
              </li>
              <li className="md:text-md lg:text-md text-[#666666] sm:text-sm">
                one lowercase character
              </li>
            </ul>
          </div>
          <div className="mt-5">
            <ReHeading heading="Confirm Password" size={'base'} />
            <RePassInput name="confirmPassword" />
          </div>
          <div>
            <ReButton
              className="mt-5 w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Reset Password
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
