'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import PaymentConfirmation from './PaymentConfirmation';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import {
  withdrawfundSchema,
  TWithdrawfund,
  TTransferfundSchema,
  transferfundSchema,
} from '@/lib/validations/withdrawfund.validation';
import { Form } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';

const defaultValues = {
  bankName: '',
  accountNumber: '',
  accountName: '',
};

const defaultValuesForTransferFund = {
  amountWithdraw: '',
};

export default function WithdrawFund() {
  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState<boolean>(false);
  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | TTransferfundSchema | null>(
    null
  );
  const [transferType, setTransferType] = useState<'bank' | 'settlement' | null>(null);

  const form = useForm<TWithdrawfund>({
    resolver: zodResolver(withdrawfundSchema),
    defaultValues,
    mode: 'onChange',
  });

  const tranferForm = useForm<TTransferfundSchema>({
    resolver: zodResolver(transferfundSchema),
    defaultValues: defaultValuesForTransferFund,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const { handleSubmit: handleSubmitForTransfer, formState: formStateForTransfer } = tranferForm;
  const { isSubmitting: isSubmittingForTransfer } = formStateForTransfer;

  const onSubmit = async (data: TWithdrawfund) => {
    console.log(data);
    setWithdrawalData(data);
    setIsShowPaymentConfirmation(true);
  };

  const onSubmitForTransfer = async (data: TTransferfundSchema) => {
    console.log(data);
    setWithdrawalData(data);
    setIsShowPaymentConfirmation(true);
  };

  return (
    <section>
      {!transferType && (
        <div className="w-full max-w-md rounded-md bg-white">
          <h2 className="mb-4 text-lg font-bold">Transfer To</h2>
          <div className="flex flex-col gap-4">
            <button
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-[#F7F8FA] p-4 transition hover:bg-[#E6E7FE]"
              onClick={() => setTransferType('bank')}
            >
              <span className="text-xl">🏦</span>
              <div className="flex flex-col items-start">
                <span className="font-semibold">To Bank</span>
                <span className="text-xs text-gray-500">Send money to external bank accounts</span>
              </div>
            </button>
            <button
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-[#F7F8FA] p-4 transition hover:bg-[#E6E7FE]"
              onClick={() => setTransferType('settlement')}
            >
              <span className="text-xl">🏦</span>
              <div className="flex flex-col items-start">
                <span className="font-semibold">To Settlement Bank</span>
                <span className="text-xs text-gray-500">Send money to saved bank account</span>
              </div>
            </button>
          </div>
        </div>
      )}
      {transferType === 'settlement' && !isShowPaymentConfirmation && (
        <div className="w-full max-w-md rounded-md bg-white">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Withdrawal</h2>
          </div>
          <Form {...tranferForm}>
            <form onSubmit={handleSubmitForTransfer(onSubmitForTransfer)}>
              <div className="mb-4">
                <ReHeading heading="Amount to withdraw" size={'base'} />
                <ReInput type="number" name="amountWithdraw" placeholder="₦" inputMode="numeric" />
                <p className="mt-2 font-inter text-sm text-gray-600">Available Balance: ₦10,000</p>
              </div>
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold">Settlement Account</span>
                  <button type="button" className="text-sm font-medium text-blue-600">
                    Switch Account
                  </button>
                </div>
                <div className="space-y-1 rounded-md border border-dashed border-black bg-gray-100 p-4">
                  <p className="font-inter text-sm text-gray-600">Bank Name: 0011223344</p>
                  <p className="font-inter text-sm text-gray-600">Account Name: Account Name</p>
                </div>
              </div>
              <ReButton
                className="mt-3 w-full rounded-full p-5 font-inter"
                type="submit"
                isSubmitting={isSubmittingForTransfer}
              >
                Proceed
              </ReButton>
            </form>
          </Form>
        </div>
      )}
      {transferType === 'bank' && !isShowPaymentConfirmation && (
        <div className="w-full max-w-md rounded-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Transfer to Bank</h2>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <ReHeading heading="Bank Name" size={'base'} />
                  <ReInput type="text" name="bankName" placeholder="Enter bank name" />
                </div>
                <div>
                  <ReHeading heading="Account Number" size={'base'} />
                  <ReInput
                    type="text"
                    name="accountNumber"
                    placeholder="Enter account number"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <ReHeading heading="Amount to withdraw" size={'base'} />
                  <ReInput
                    type="number"
                    name="amountWithdraw"
                    placeholder="₦"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <p className="font-inter text-sm text-gray-600">Available Balance: ₦10,000</p>
                </div>
              </div>
              <ReButton
                className="mt-6 w-full rounded-full p-5 font-inter"
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
