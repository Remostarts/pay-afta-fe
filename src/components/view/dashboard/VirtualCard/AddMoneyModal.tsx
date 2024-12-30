import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dispatch, SetStateAction } from 'react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';

export const fundAmountSchema = z.object({
  fundAmountInCard: z.string().min(1, 'minimum amount should be ₦2,000'),
});

export type TFundAmount = z.infer<typeof fundAmountSchema>;

const defaultValues = {
  fundAmountInCard: '',
};

interface IAddMoneyModalProps {
  handleCurrentDialogStep(data?: string): void;
}

export default function AddMoneyModal({ handleCurrentDialogStep }: IAddMoneyModalProps) {
  const form = useForm<TFundAmount>({
    resolver: zodResolver(fundAmountSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TFundAmount) => {
    // console.log(data);
    handleCurrentDialogStep(data.fundAmountInCard);
  };

  return (
    <div className="w-full max-w-md rounded-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Create Virtual Card</h2>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Amount to fund card (Minimum of ₦2,000)" size={'base'} />
            <ReInput type="number" name="fundAmountInCard" placeholder="₦" inputMode="numeric" />
          </div>
          <ReButton
            className="mt-3 rounded-full p-5 font-inter"
            type="submit"
            isSubmitting={isSubmitting}
            // disabled={!isValid}
          >
            Proceed
          </ReButton>
        </form>
      </Form>
    </div>
  );
}
