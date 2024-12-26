import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Form } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';
import RePassInput from '@/components/re-ui/re-input/RePassInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { TResetPassword, resetPasswordSchema } from '@/lib/validations/userAuth.validations';

interface ISetNewPasswordProps {
  handleCurrentStep(): void;
}

const defaultValues = {
  newPassword: '',
  confirmPassword: '',
};

export default function SetNewPassword({ handleCurrentStep }: ISetNewPasswordProps) {
  const router = useRouter();
  const form = useForm<TResetPassword>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  function onSubmit(data: TResetPassword) {
    console.log('new Password', data);
    handleCurrentStep();
  }

  return (
    <section className=" container mx-auto">
      <div>
        <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} />
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
              Change Password
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
