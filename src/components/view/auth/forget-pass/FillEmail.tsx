'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { sendResetPassLink } from '@/lib/actions/auth/signup.actions';
import { Form } from '@/components/ui/form';
import { ReButton } from '@/components/re-ui/ReButton';
import ReInput from '@/components/re-ui/re-input/ReInput';
// import { sendForgetPasswordOtp } from '@/lib/actions/auth/signup.actions';

const userFillEmailSchema = z.object({
  email: z.string().min(1, 'Email is required'),
});

type TInputs = z.infer<typeof userFillEmailSchema>;

const defaultValues = {
  email: '',
};

interface IFillEmailProps {
  handleCurrentStep(): void;
}

export default function FillEmail({ handleCurrentStep }: IFillEmailProps) {
  const form = useForm<TInputs>({
    resolver: zodResolver(userFillEmailSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: TInputs) => {
    // console.log(data);
    if (data.email.trim() === '') {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const response = await sendResetPassLink(data?.email);

      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', data?.email);

      if (response?.success) {
        toast.success('A password reset link has been sent to your email address.');
      }
      handleCurrentStep();
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <section>
      <div className="mb-10 flex items-center justify-center">
        <Image src="/Logo.svg" alt="logo" width={175.96} height={36} />
      </div>
      <div className="mb-6">
        <h2 className="mb-1 text-center font-spaceGrotesk text-2xl font-bold lg:text-3xl">
          Forget password?
        </h2>
        <p className="text-center font-inter text-gray-600">
          Enter the Email Address used to register this account.
        </p>
      </div>

      <div className="px-8 py-12">
        <h2 className="mb-4 font-spaceGrotesk text-xl font-bold lg:text-2xl">Email</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="mb-8">
              <ReInput name="email" />
            </div>
            <ReButton
              className="w-full rounded-xl bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
              type="submit"
              isSubmitting={isSubmitting}
            >
              Send Recovery Link
            </ReButton>
            <div className="mt-10 text-center">
              <p>
                You do not have a account?{' '}
                <Link href="/sign-up" className="font-inter font-semibold">
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
