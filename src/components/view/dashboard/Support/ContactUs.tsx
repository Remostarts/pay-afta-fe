import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';
import { ReButton } from '@/components/re-ui/ReButton';

const contactUsSchema = z.object({
  email: z.string().min(1, 'Enter the email.'),
  phone: z.string().min(1, 'Enter the phone no.'),
});

export type TContactUs = z.infer<typeof contactUsSchema>;

const defaultValues = {
  email: '',
  phone: '',
};

export default function ContactUs() {
  const form = useForm<TContactUs>({
    resolver: zodResolver(contactUsSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { formState, handleSubmit } = form;
  const { errors, isSubmitting } = formState;

  function onSubmit(data: TContactUs) {
    console.log(data);
  }

  return (
    <section className="flex w-full items-center justify-center">
      {/* <div className="mt-6">
        <ReHeading heading="Having Trouble?" size={'2xl'} />
        <p className="text-gray-500">
          Explore common issues below or select &apos;Other&apos; for personalized assistance.
        </p>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <ReHeading heading="Email" size={'xl'} />
              <ReInput name="email" placeholder="Support@payafta.com" />
            </div>
            <div>
              <ReHeading heading="Phone" size={'xl'} />
              <ReInput name="phone" placeholder="0487985444" />
            </div>
            <div className="grid place-items-center pt-2">
              <ReButton
                className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
                type="submit"
                // isSubmitting={isSubmitting}
              >
                Contact Us
              </ReButton>
            </div>
          </form>
        </Form>
      </div> */}
      Contact us...
    </section>
  );
}
