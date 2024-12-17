'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import PaymentConfirmation from './PaymentConfirmation';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { withdrawfundSchema, TWithdrawfund } from '@/lib/validations/withdrawfund.validation';
import { Form } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';

const defaultValues = {
  amountWithdraw: '',
};

export default function WithdrawFund() {
  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState<boolean>(false);
  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | null>(null);

  const form = useForm<TWithdrawfund>({
    resolver: zodResolver(withdrawfundSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const onSubmit = async (data: TWithdrawfund) => {
    console.log(data);
    setWithdrawalData(data);
    setIsShowPaymentConfirmation(true);
  };

  return (
    <section>
      {!isShowPaymentConfirmation && (
        <div className="w-full max-w-md rounded-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Withdrawal</h2>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <ReHeading heading="Amount to withdraw" size={'base'} />
                <ReInput type="number" name="amountWithdraw" placeholder="₦" inputMode="numeric" />
              </div>
              <div>
                <p className="font-inter text-sm text-gray-600">Available Balance: ₦10,000</p>
              </div>
              <div>
                <h3 className="mb-2 font-inter text-base font-bold">Settlement Account</h3>
                <div className="space-y-1 rounded-md border-dashed border-black bg-gray-100 p-4">
                  <p className="font-inter text-sm text-gray-600">Bank Name: 0011223344</p>
                  <p className="font-inter text-sm text-gray-600">Account Name: Account Name</p>
                </div>
              </div>
              <ReButton
                className="mt-3 rounded-full p-5 font-inter "
                type="submit"
                isSubmitting={isSubmitting}
              >
                Proceed
              </ReButton>
            </form>
          </Form>
        </div>
      )}
      {isShowPaymentConfirmation && (
        <PaymentConfirmation
          amount={parseFloat(withdrawalData?.amountWithdraw ?? '0')}
          bankName="Sterling Bank Plc."
          accountNumber="21xxxxx37"
          accountName="CHUKWUKA BASSEY MICHELLE"
        />
      )}
    </section>
  );
}
