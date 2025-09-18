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
import ReImageInput from '@/components/re-ui/re-image/ReImage';
import { UserRole } from './TransactionsSummaryForProduct';

interface RequestRefundProps {
  handleClosed: (e: boolean) => void;
  handleCurrentStepChange: (e: number) => void;
  handleIsRequestRefund: (isRequestRefund: boolean) => void;
  handleRequestRefundFlow: () => void;
  currentStepChange: number;
  userRole: UserRole;
}

const defaultVal = {
  reasonOfDispute: '',
  describeYourExperience: '',
};

export default function RequestRefund({
  handleClosed,
  handleCurrentStepChange,
  handleIsRequestRefund,
  handleRequestRefundFlow,
  currentStepChange,
  userRole,
}: RequestRefundProps) {
  const form = useForm<TRequestRefundSchema>({
    resolver: zodResolver(requestRefundSchema),
    defaultValues: defaultVal,
    mode: 'onChange',
  });

  const { formState, handleSubmit } = form;
  const { isSubmitting, isValid } = formState;

  async function onSubmit(data: TRequestRefundSchema) {
    console.log(data);
    // Process refund request
    handleIsRequestRefund(true);
    handleRequestRefundFlow();
  }

  return (
    <section>
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Request Refund</h1>
        <p className="font-inter text-sm text-gray-600">
          You have requested a refund and have 24 hours to return the product to the seller to
          complete the process.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Reason for refund" size={'base'} />
            <ReSelect
              name="reasonOfDispute"
              placeholder="Select"
              options={[
                { label: 'Product defective', value: 'Product defective' },
                { label: 'Not as described', value: 'Not as described' },
                { label: 'Wrong item received', value: 'Wrong item received' },
                { label: 'Changed my mind', value: 'Changed my mind' },
                { label: 'Other', value: 'Other' },
              ]}
            />
          </div>
          <div>
            <ReHeading heading="Describe your experience" size={'base'} />
            <ReTextarea name="describeYourExperience" />
          </div>
          <div>
            <ReImageInput name="uploadFile" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ReButton
              type="button"
              className="rounded-full border-2 border-black bg-transparent text-black hover:bg-transparent"
              onClick={() => {
                handleClosed(false);
              }}
            >
              Cancel
            </ReButton>
            <ReButton
              type="submit"
              disabled={isSubmitting || !isValid}
              className="rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]"
            >
              Submit
            </ReButton>
          </div>
        </form>
      </Form>
    </section>
  );
}
