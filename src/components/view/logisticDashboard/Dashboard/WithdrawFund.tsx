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

// Define the AccountProps type
type AccountProps = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

const defaultValues = {
  bankName: '',
  accountNumber: '',
  amountWithdraw: '',
};

const defaultValuesForTransferFund = {
  amountWithdraw: '',
};

export default function WithdrawFund() {
  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState<boolean>(false);
  const [isShowSwitchAccount, setIsShowSwitchAccount] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountProps | null>(null);
  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | TTransferfundSchema | null>(
    null
  );
  const [transferType, setTransferType] = useState<'bank' | 'settlement' | null>(null);

  console.log(selectedAccount);

  // Sample accounts data - replace with actual data from your backend
  const accounts = [
    {
      bankName: 'Sterling Bank',
      accountNumber: '0011223344',
      accountName: 'John Doe',
    },
    {
      bankName: 'First Bank',
      accountNumber: '5566778899',
      accountName: 'John Doe',
    },
  ];

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

  const handleAccountSelect = (account: AccountProps) => {
    setSelectedAccount(account);
    setIsShowSwitchAccount(false);
    // Don't show payment confirmation here, just close the switch account dialog
  };

  const handleSwitchAccountOpen = () => {
    setIsShowSwitchAccount(true);
  };

  const handleSwitchAccountClose = () => {
    setIsShowSwitchAccount(false);
    // Don't show payment confirmation when closing switch account
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
              <span className="text-xl">
                <Image
                  alt="to bank"
                  src="/assets/dashboard/Dashboard/toBank.svg"
                  width={40}
                  height={40}
                />
              </span>
              <div className="flex flex-col items-start">
                <span className="font-semibold">To Bank</span>
                <span className="text-xs text-gray-500">Send money to external bank accounts</span>
              </div>
            </button>
            <button
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-[#F7F8FA] p-4 transition hover:bg-[#E6E7FE]"
              onClick={() => setTransferType('settlement')}
            >
              <span className="text-xl">
                {' '}
                <Image
                  alt="to bank"
                  src="/assets/dashboard/Dashboard/toSettlementBank.svg"
                  width={40}
                  height={40}
                />
              </span>
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
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600"
                    onClick={handleSwitchAccountOpen}
                  >
                    Switch Account
                  </button>
                </div>
                <div className="space-y-1 rounded-md border border-dashed border-black bg-[#F8F8F8] p-4">
                  <p className="font-inter text-sm text-gray-600">
                    Bank Name: {selectedAccount?.bankName || accounts[0].bankName}
                  </p>
                  <p className="font-inter text-sm text-gray-600">
                    Account Number: {selectedAccount?.accountNumber || accounts[0].accountNumber}
                  </p>
                  <p className="font-inter text-sm text-gray-600">
                    Account Name: {selectedAccount?.accountName || accounts[0].accountName}
                  </p>
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
                    type="number"
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
      <Dialog open={isShowSwitchAccount} onOpenChange={handleSwitchAccountClose}>
        <DialogContent>
          <SwitchAccount
            accounts={accounts}
            onClose={handleSwitchAccountClose}
            onAccountSelect={handleAccountSelect}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
