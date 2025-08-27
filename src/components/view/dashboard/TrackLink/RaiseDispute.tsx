'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import {
  TRaiseDisputeSchema,
  raiseDisputeSchema,
} from '../../../../lib/validations/tracklinks.validation';

import { Form } from '@/components/ui/form';
import ReSelect from '@/components/re-ui/ReSelect';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import ReImageInput from '@/components/re-ui/re-image/ReImage';
import { ReButton } from '@/components/re-ui/ReButton';

interface RaiseDisputeProps {
  handleClosed: (e: boolean) => void;
  handleCurrentStepChange: (e: number) => void;
  handleShowRiseDispute: (showRiseDispute: boolean) => void;
  currentStepChange: number;
  handleIsDisputed?: (isDisputed: boolean) => void | undefined;
  userRole: 'buyer' | 'seller';
}

const defaultVal = {
  reasonOfDispute: '',
  describeYourExperience: '',
  uploadFile: '',
};

export default function RaiseDispute({
  handleClosed,
  handleCurrentStepChange,
  handleShowRiseDispute,
  currentStepChange,
  handleIsDisputed,
  userRole,
}: RaiseDisputeProps) {
  const [isShowRiseDispute, setIsShowRiseDispute] = useState<boolean>(false);

  const form = useForm<TRaiseDisputeSchema>({
    resolver: zodResolver(raiseDisputeSchema),
    defaultValues: defaultVal,
    mode: 'onChange',
  });

  const { formState, handleSubmit } = form;
  const { isSubmitting, isValid } = formState;

  function handleShowRiseDisputeAndStepChange() {
    setIsShowRiseDispute(true);
    handleCurrentStepChange(currentStepChange + 1);
    handleShowRiseDispute(true);
    handleIsDisputed?.(true);
  }

  async function onSubmit(data: TRaiseDisputeSchema) {
    console.log(data);
  }

  return (
    <section>
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Dispute Order</h1>
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
            <div>
              <ReImageInput name="uploadFile" />
            </div>
            <p className="font-inter text-sm text-gray-600">
              By clicking the dispute order button, we will investigate the matter and provide a
              resolution as quickly as possible. We are committed to ensuring your satisfaction and
              appreciate your cooperation.
            </p>
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
                className="rounded-full bg-[#D42620] text-white hover:bg-[#D42620]"
                onClick={handleShowRiseDisputeAndStepChange}
              >
                Dispute
              </ReButton>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
