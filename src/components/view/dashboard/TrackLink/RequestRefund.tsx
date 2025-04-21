'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  TRequestRefundSchema,
  requestRefundSchema,
} from '../../../../lib/validations/tracklinks.validation';

import { Form } from '@/components/ui/form';
import ReSelect from '@/components/re-ui/ReSelect';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import { ReButton } from '@/components/re-ui/ReButton';

interface RequestRefundProps {
  handleClosed: (e: boolean) => void;
  handleCurrentStepChange: (e: number) => void;
  handleIsRequestRefund: (isRequestRefund: boolean) => void;
}

const defaultVal = {
  reasonOfDispute: '',
  describeYourExperience: '',
};

export default function RequestRefund({
  handleClosed,
  handleCurrentStepChange,
  handleIsRequestRefund,
}: RequestRefundProps) {
  const form = useForm<TRequestRefundSchema>({
    resolver: zodResolver(requestRefundSchema),
    defaultValues: defaultVal,
    mode: 'onChange',
  });

  const { formState, handleSubmit } = form;
  const { isSubmitting, isValid } = formState;

  function handleIsRequestRefundAndStepChange() {
    handleIsRequestRefund(true);
    handleCurrentStepChange(5);
  }

  async function onSubmit(data: TRequestRefundSchema) {
    console.log(data);
  }

  return (
    <section>
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Request Refund</h1>
        <p className="font-inter text-sm text-gray-600">
          You&apos;ve requested a refund and have 24 hours to return the product to the seller to
          complete the process.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Reason for dispute" size={'base'} />
            <ReSelect
              name="reasonOfDispute"
              placeholder="Select"
              options={[
                { label: 'Not for me', value: 'Not for me' },
                { label: 'bad product!!', value: 'bad product!!' },
              ]}
            />
          </div>
          <div>
            <ReHeading heading="Describe your experience" size={'base'} />
            <ReTextarea name="describeYourExperience" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ReButton
              className="rounded-full border-2 border-black bg-transparent text-black hover:bg-transparent"
              onClick={() => {
                handleClosed(false);
              }}
            >
              Cancel
            </ReButton>
            <ReButton
              disabled={isSubmitting || !isValid}
              className="rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]"
              onClick={handleIsRequestRefundAndStepChange}
            >
              Agree
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
