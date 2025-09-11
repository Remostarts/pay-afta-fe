'use client';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSubHeading from '@/components/re-ui/ReSubHeading';
import Image from 'next/image';
import { Form } from '@/components/ui/form';
import { contactusSchema, TContactusSchema } from '@/lib/validations/root.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ReButton } from '@/components/re-ui/ReButton';
import { ArrowUpRight } from 'lucide-react';

type defaultVal = {
  fullName: string;
  email: string;
  companyName: string;
};

const defaultValues: defaultVal = {
  fullName: '',
  companyName: '',
  email: '',
};

export default function ContactUs() {
  const form = useForm<TContactusSchema>({
    resolver: zodResolver(contactusSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TContactusSchema) => {
    console.log(data);
  };

  return (
    <section className="mx-auto max-w-8xl px-6 md:px-10 lg:px-12 py-12 relative">
      <div className="absolute top-0 right-0 mt-3">
        <button className="text-black px-6 py-2 rounded-full font-bold flex items-center gap-2">
          Build Now
          <ArrowUpRight className="bg-[#33CCCC] rounded-full text-white m-3" />
        </button>
      </div>
      <div className="flex flex-col lg:flex-row mt-10 items-center gap-8 lg:gap-16">
        <div className="w-full lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Download Insight Report</h1>
          <Form {...form}>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <ReSubHeading
                  subHeading="Full Name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <ReInput name="fullName" placeholder="Enter your full name" />
              </div>
              <div>
                <ReSubHeading
                  subHeading="Company Name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <ReInput name="companyName" placeholder="Enter your company name" />
              </div>
              <div>
                <ReSubHeading
                  subHeading="Email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                />
                <ReInput name="email" placeholder="Enter your email address" />
              </div>
              <ReButton
                isSubmitting={isSubmitting}
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get Insight Report
              </ReButton>
            </form>
          </Form>
        </div>
        <div className="w-full lg:w-1/2">
          <Image
            src="/assets/root/contact-us/insight-report.png"
            alt="Insight Report"
            width={652}
            height={671}
          />
        </div>
      </div>
    </section>
  );
}
