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
import { useGeneral } from '@/context/generalProvider';

// Define the AccountProps type
type AccountProps = {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
};

const defaultValues = {
  bankName: '',
  accountNumber: '',
  amountWithdraw: 0,
};

const defaultValuesForTransferFund = {
  amountWithdraw: 0,
};

export default function WithdrawFund() {
  const { user } = useGeneral();
  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState(false);
  const [isShowSwitchAccount, setIsShowSwitchAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountProps | null>(null);
  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | TTransferfundSchema | null>(
    null
  );
  const [transferType, setTransferType] = useState<'bank' | 'settlement' | null>(null);

  // Map BankItem[] → AccountProps[]
  const accounts: AccountProps[] =
    user?.Bank?.map((bank) => ({
      bankName: bank.bankName,
      bankCode: bank.bankCode,
      accountNumber: bank.accountNumber,
      accountName: bank.accountHolder,
    })) || [];

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
    setWithdrawalData({
      ...data,
      amountWithdraw: Number(data.amountWithdraw),
    });
    setIsShowPaymentConfirmation(true);
  };

  const onSubmitForTransfer = async (data: TTransferfundSchema) => {
    setWithdrawalData({
      ...data,
      amountWithdraw: Number(data.amountWithdraw),
    });
    setIsShowPaymentConfirmation(true);
  };

  const handleAccountSelect = (account: AccountProps) => {
    setSelectedAccount(account);
    setIsShowSwitchAccount(false);
  };

  const handleSwitchAccountOpen = () => setIsShowSwitchAccount(true);
  const handleSwitchAccountClose = () => setIsShowSwitchAccount(false);

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
              className="flex items-center gap-4 rounded-md border border-gray-200 bg-[#F7F8FA] p-4 transition hover:bg-[#E6E7FE]"
              onClick={() => setTransferType('settlement')}
            >
              <Image
                alt="to settlement bank"
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
        <div className="w-full max-w-md rounded-md bg-white">
          <Form {...tranferForm}>
            <form onSubmit={handleSubmitForTransfer(onSubmitForTransfer)}>
              <div className="mb-4">
                <ReHeading heading="Amount to withdraw" size="base" />
                <ReInput type="number" name="amountWithdraw" placeholder="₦" inputMode="numeric" />
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
                  <p>Bank Name: {selectedAccount?.bankName || accounts[0]?.bankName}</p>
                  <p>
                    Account Number: {selectedAccount?.accountNumber || accounts[0]?.accountNumber}
                  </p>
                  <p>Account Name: {selectedAccount?.accountName || accounts[0]?.accountName}</p>
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <ReInput type="text" name="bankName" placeholder="Enter bank name" />
                <ReInput type="number" name="accountNumber" placeholder="Enter account number" />
                <ReInput type="number" name="amountWithdraw" placeholder="₦" />
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

      {isShowPaymentConfirmation && withdrawalData && (
        <PaymentConfirmation
          amount={withdrawalData.amountWithdraw as number}
          bankName={selectedAccount?.bankName || accounts[0]?.bankName}
          accountNumber={selectedAccount?.accountNumber || accounts[0]?.accountNumber}
          accountName={selectedAccount?.accountName || accounts[0]?.accountName}
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
