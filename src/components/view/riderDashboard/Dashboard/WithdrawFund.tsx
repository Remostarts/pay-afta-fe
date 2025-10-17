'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Image from 'next/image';

import PaymentConfirmation from './PaymentConfirmation';
import SwitchAccount from './SwitchAccount';

import { Dialog, DialogContent } from '@/components/ui/dialog';
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

type AccountProps = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

// ✅ Use number for amountWithdraw
const defaultValues: TWithdrawfund = {
  bankName: '',
  accountNumber: '',
  bankCode: '',
  amountWithdraw: 0,
};

const defaultValuesForTransferFund: TTransferfundSchema = {
  amountWithdraw: 0,
};

export default function WithdrawFund() {
  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState(false);
  const [isShowSwitchAccount, setIsShowSwitchAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountProps | null>(null);
  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | TTransferfundSchema | null>(
    null
  );
  const [transferType, setTransferType] = useState<'bank' | 'settlement' | null>(null);

  const accounts = [
    { bankName: 'Sterling Bank', accountNumber: '0011223344', accountName: 'John Doe' },
    { bankName: 'First Bank', accountNumber: '5566778899', accountName: 'John Doe' },
  ];

  const form = useForm<TWithdrawfund>({
    resolver: zodResolver(withdrawfundSchema),
    defaultValues,
    mode: 'onChange',
  });

  const transferForm = useForm<TTransferfundSchema>({
    resolver: zodResolver(transferfundSchema),
    defaultValues: defaultValuesForTransferFund,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = form;
  const { isSubmitting } = formState;

  const { handleSubmit: handleSubmitForTransfer, formState: formStateForTransfer } = transferForm;
  const { isSubmitting: isSubmittingForTransfer } = formStateForTransfer;

  const onSubmit = (data: TWithdrawfund) => {
    // Ensure number type
    setWithdrawalData({ ...data, amountWithdraw: Number(data.amountWithdraw) });
    setIsShowPaymentConfirmation(true);
  };

  const onSubmitForTransfer = (data: TTransferfundSchema) => {
    setWithdrawalData({ ...data, amountWithdraw: Number(data.amountWithdraw) });
    setIsShowPaymentConfirmation(true);
  };

  const handleAccountSelect = (account: AccountProps) => {
    setSelectedAccount(account);
    setIsShowSwitchAccount(false);
  };

  return (
    <section>
      {!transferType && (
        <div className="w-full max-w-md rounded-md bg-white p-4">
          <h2 className="mb-4 text-lg font-bold">Transfer To</h2>
          <div className="flex flex-col gap-4">
            <button
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-[#F7F8FA] p-4"
              onClick={() => setTransferType('bank')}
            >
              <Image
                alt="to bank"
                src="/assets/dashboard/Dashboard/toBank.svg"
                width={40}
                height={40}
              />
              <div className="flex flex-col items-start">
                <span className="font-semibold">To Bank</span>
                <span className="text-xs text-gray-500">Send money to external bank accounts</span>
              </div>
            </button>

            <button
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-[#F7F8FA] p-4"
              onClick={() => setTransferType('settlement')}
            >
              <Image
                alt="to settlement"
                src="/assets/dashboard/Dashboard/toSettlementBank.svg"
                width={40}
                height={40}
              />
              <div className="flex flex-col items-start">
                <span className="font-semibold">To Settlement Bank</span>
                <span className="text-xs text-gray-500">Send money to saved bank account</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {transferType === 'settlement' && !isShowPaymentConfirmation && (
        <Form {...transferForm}>
          <form onSubmit={handleSubmitForTransfer(onSubmitForTransfer)}>
            <ReInput type="number" name="amountWithdraw" placeholder="₦" />
            <ReButton type="submit" isSubmitting={isSubmittingForTransfer}>
              Proceed
            </ReButton>
          </form>
        </Form>
      )}

      {transferType === 'bank' && !isShowPaymentConfirmation && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ReInput type="text" name="bankName" placeholder="Enter bank name" />
            <ReInput type="number" name="accountNumber" placeholder="Enter account number" />
            <ReInput type="number" name="amountWithdraw" placeholder="₦" />
            <ReButton type="submit" isSubmitting={isSubmitting}>
              Proceed
            </ReButton>
          </form>
        </Form>
      )}

      {isShowPaymentConfirmation && withdrawalData && (
        <PaymentConfirmation
          amount={withdrawalData.amountWithdraw}
          bankName={selectedAccount?.bankName || accounts[0].bankName}
          accountNumber={selectedAccount?.accountNumber || accounts[0].accountNumber}
          accountName={selectedAccount?.accountName || accounts[0].accountName}
        />
      )}

      <Dialog open={isShowSwitchAccount} onOpenChange={() => setIsShowSwitchAccount(false)}>
        <DialogContent>
          <SwitchAccount
            accounts={accounts}
            onClose={() => setIsShowSwitchAccount(false)}
            onAccountSelect={handleAccountSelect}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
