'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

import Logo from '../../../../../public/Logo.svg';

import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReInput from '@/components/re-ui/re-input/ReInput';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { Form } from '@/components/ui/form';
import { userLoginSchema } from '@/lib/validations/userAuth.validations';

export type TInputs = z.infer<typeof userLoginSchema>;

const defaultValues = {
  email: '',
  password: '',
  isValid: false,
};

export const SigninForm = () => {
  const pathname = usePathname();
  // const role = pathname?.split('/')[2];
  const date = new Date().toDateString();
  // console.log('🌼 🔥🔥 SigninFormLawyer 🔥🔥 pathname🌼', role);

  const router = useRouter();

  const form = useForm<TInputs>({
    resolver: zodResolver(userLoginSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: TInputs) => {
    event?.preventDefault();
    console.log('🌼 🔥🔥 onSubmit 🔥🔥 data🌼', data);

    const result = await signIn('pay-afta-backend', { ...data, role: 'user', redirect: false });
    console.log('🌼 🔥🔥 onSubmit 🔥🔥 result🌼', result);

    if (result?.ok && !result.error) {
      router.refresh();
      // router.push('/');
    }
    // console.log('🌼 🔥🔥 constonSubmit:SubmitHandler<TInputs>= 🔥🔥 result🌼', result, data);
  };

  return (
    <section>
      <div
        className={`${pathname === '/sign-in/admin' && 'mt-10 flex items-center justify-center'}`}
      >
        <Image src={Logo} alt="Pay afta" width={176} height={64} />
      </div>
      <div className="mt-5">
        {pathname === '/sign-in' ? (
          <div>
            <h1 className="font-inter text-2xl font-bold">Sign in</h1>
            <p className="font-inter font-semibold text-gray-500">Enter your account details</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-inter text-2xl font-bold">Administrator Sign in</h1>
            <p className="font-inter font-semibold text-gray-500">Enter your account details</p>
          </div>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mt-3 space-y-4">
            <div>
              <ReHeading heading="Email" />
              <ReInput name="email" />
            </div>
            <div>
              <ReHeading heading="Password" size="lg" />
              <RePassInput name="password" />
            </div>
          </div>
          <div>
            <Link
              href={pathname === '/sign-in/admin' ? '/forget-pass/admin' : '/forget-pass'}
              className="mb-10 flex justify-end font-inter text-sm text-[#03045B]"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="grid place-items-center pt-2">
            <ReButton
              className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Sign In
            </ReButton>
          </div>
        </form>
        {pathname === '/sign-in' && (
          <div className="mt-10 text-center">
            <p>
              You do not have a account?{' '}
              <Link href="/sign-up" className="font-inter font-semibold">
                Create an account
              </Link>
            </p>
          </div>
        )}
      </Form>
    </section>
  );
};
