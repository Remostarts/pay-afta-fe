import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { Form } from '@/components/ui/form';

export const withdrawalAmountSchema = z.object({
  withdrawalAmount: z.string().min(1, 'minimum amount should be ₦2,000'),
});

export type TFundAmount = z.infer<typeof withdrawalAmountSchema>;

const defaultValues = {
  withdrawalAmount: '',
};

interface IWithdrawalModalProps {
  handleCurrentDialogStep(data?: string): void;
}

export default function WithdrawalModal({ handleCurrentDialogStep }: IWithdrawalModalProps) {
  const form = useForm<TFundAmount>({
    resolver: zodResolver(withdrawalAmountSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onSubmit = async (data: TFundAmount) => {
    // console.log(data);
    handleCurrentDialogStep();
  };

  return (
    <div className="w-full max-w-md rounded-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Withdrawal</h2>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ReHeading heading="Amount to withdraw (Minimum of ₦2000)" size={'base'} />
            <ReInput type="number" name="withdrawalAmount" placeholder="₦" inputMode="numeric" />
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
