'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReTextarea } from '@/components/re-ui/ReTextarea';

const getInTouchSchema = z.object({
  firstName: z.string().min(1, 'Enter your first name.'),
  lastName: z.string().min(1, 'Enter your last name.'),
  email: z.string().min(1, 'Enter your email.'),
  message: z.string().min(1, 'Type your message.'),
});

export type TGetInTouch = z.infer<typeof getInTouchSchema>;

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

interface GetInTouchProps {
  handleConfirmTransaction: () => void;
}

export default function GetInTouch({ handleConfirmTransaction }: GetInTouchProps) {
  const form = useForm<TGetInTouch>({
    resolver: zodResolver(getInTouchSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = (data: TGetInTouch) => {
    console.log(data);
    handleConfirmTransaction();
  };

  return (
    <section>
      <div>
        <ReHeading heading="Get in Touch" size={'2xl'} />
        <p className="text-gray-500">24/7 Support: Our team is ready to assist you anytime.</p>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <ReHeading heading="First Name" size={'base'} />
                <ReInput name="firstName" />
              </div>
              <div>
                <ReHeading heading="Last Name" size={'base'} />
                <ReInput name="lastName" />
              </div>
            </div>
            <div>
              <ReHeading heading="Email" size={'base'} />
              <ReInput name="email" />
            </div>
            <div>
              <ReHeading heading="Message" size={'base'} />
              <ReTextarea name="message" />
            </div>
            <div className="grid place-items-center pt-2">
              <ReButton
                type="submit"
                className="m:text-lg w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-5"
              >
                Submit
              </ReButton>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
