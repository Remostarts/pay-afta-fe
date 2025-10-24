'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';

import PaymentConfirmation from './PaymentConfirmation';
import SwitchAccount from './SwitchAccount';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';
import {
  withdrawfundSchema,
  TWithdrawfund,
  TTransferfundSchema,
  transferfundSchema,
} from '@/lib/validations/withdrawfund.validation';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { useGeneral } from '@/context/generalProvider';
import { withdrawFund } from '@/lib/actions/root/withdrawFund';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPillaBanks } from '@/lib/actions/onboarding/onboarding.actions';
import ReInput from '@/components/re-ui/re-input/ReInput';

type Bank = {
  name: string;
  code: string;
};

type AccountProps = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  id?: string;
};

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
  const { user } = useGeneral();

  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState(false);
  const [isShowSwitchAccount, setIsShowSwitchAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountProps | null>(null);
  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | TTransferfundSchema | null>(
    null
  );
  const [transferType, setTransferType] = useState<'bank' | 'settlement' | null>(null);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  useEffect(() => {
    async function fetchBanks() {
      setLoadingBanks(true);
      try {
        const res: any = await getPillaBanks();
        setBanks(res?.data || []);
      } catch (error) {
        toast.error('Failed to load bank list');
      } finally {
        setLoadingBanks(false);
      }
    }
    if (transferType === 'bank' && banks.length === 0) {
      fetchBanks();
    }
  }, [transferType, banks.length]);
  // -----------------------------------------------------------

  const accounts: AccountProps[] =
    user?.Bank?.map((bank) => ({
      bankName: bank.bankName || '',
      accountNumber: bank.accountNumber || '',
      accountName: bank.accountHolder || '',
      bankCode: bank.bankCode || '',
      id: bank.id,
    })) || [];

  const defaultAccount: AccountProps = accounts[0] || {
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: '',
    id: '',
  };

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

  const { handleSubmit, register, formState, control, watch, setValue } = form; // Added control, watch, setValue
  const { isSubmitting, errors } = formState;

  const {
    handleSubmit: handleSubmitForTransfer,
    register: registerTransfer,
    formState: formStateForTransfer,
  } = transferForm;
  const { isSubmitting: isSubmittingForTransfer, errors: transferErrors } = formStateForTransfer;

  const bankAmount = form.watch('amountWithdraw');
  const selectedBankName = watch('bankName');
  const settlementAmount = transferForm.watch('amountWithdraw');

  useEffect(() => {
    if (selectedBankName && banks.length > 0) {
      const selected = banks.find((b) => b.name === selectedBankName);
      if (selected) {
        setValue('bankCode', selected.code, { shouldValidate: true });
      }
    } else {
      setValue('bankCode', '');
    }
  }, [selectedBankName, banks, setValue]);

  const onSubmit = (data: TWithdrawfund) => {
    setWithdrawalData(data);
    setIsShowPaymentConfirmation(true);
  };

  const onSubmitForTransfer = (data: TTransferfundSchema) => {
    setWithdrawalData(data);
    setIsShowPaymentConfirmation(true);
  };

  const handleAccountSelect = (account: AccountProps) => {
    setSelectedAccount(account);
    setIsShowSwitchAccount(false);
  };

  const handleWithdraw = async (pin: string) => {
    try {
      if (transferType === 'bank') {
        const parsed = withdrawfundSchema.safeParse(withdrawalData);
        if (!parsed.success) {
          const errors = parsed.error.errors.map((e) => e.message).join(', ');
          toast.error(errors);
          throw new Error(errors);
        }
      } else if (transferType === 'settlement') {
        const parsed = transferfundSchema.safeParse(withdrawalData);
        if (!parsed.success) {
          const errors = parsed.error.errors.map((e) => e.message).join(', ');
          toast.error(errors);
          throw new Error(errors);
        }
      }

      const body: any = {
        amount: withdrawalData?.amountWithdraw,
        withdrawPassword: pin,
      };

      if (transferType === 'bank') {
        body.newAccount = {
          bankName: (withdrawalData as TWithdrawfund)?.bankName || '',
          accountNumber: (withdrawalData as TWithdrawfund)?.accountNumber || '',
          bankCode: (withdrawalData as TWithdrawfund)?.bankCode || '',
        };
      } else if (transferType === 'settlement') {
        body.savedAccountId = selectedAccount?.id || defaultAccount.id;
      }

      const res = await withdrawFund(body);

      if (!res.success) throw new Error(res.message || 'Withdrawal failed');

      toast.success('Withdrawal successful 🎉');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Withdrawal failed');
      return false;
    }
  };

  const getSafeString = (value?: string | null, fallback = '') => value || fallback;

  return (
    <section>
      {/* Step 1: Select transfer type */}
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

      {/* Step 2A: Settlement Form (Remains the same) */}
      {transferType === 'settlement' && !isShowPaymentConfirmation && (
        <Form {...transferForm}>
          <form onSubmit={handleSubmitForTransfer(onSubmitForTransfer)}>
            <div className="mb-4">
              <ReHeading heading="Amount to withdraw" size="base" />
              <ReInput name="amountWithdraw" type="number" />
              {/* <input
                type="number"
                placeholder="₦"
                {...registerTransfer('amountWithdraw', { valueAsNumber: true })}
                className="w-full rounded-md border p-3"
              />
              {transferErrors.amountWithdraw && (
                <p className="text-sm text-red-500">{transferErrors.amountWithdraw.message}</p>
              )} */}
              <p className="mt-2 text-sm text-gray-600">
                Available Balance: ₦{user?.Wallet[0]?.balance || '0.00'}
              </p>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">Settlement Account</span>
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600"
                  onClick={() => setIsShowSwitchAccount(true)}
                >
                  Switch Account
                </button>
              </div>
              <div className="space-y-1 rounded-md border border-dashed p-4 bg-[#F8F8F8]">
                <p>
                  Bank Name: {getSafeString(selectedAccount?.bankName, defaultAccount.bankName)}
                </p>
                <p>
                  Account Number:{' '}
                  {getSafeString(selectedAccount?.accountNumber, defaultAccount.accountNumber)}
                </p>
                <p>
                  Account Name:{' '}
                  {getSafeString(selectedAccount?.accountName, defaultAccount.accountName)}
                </p>
                <p>
                  Bank Code: {getSafeString(selectedAccount?.bankCode, defaultAccount.bankCode)}
                </p>
              </div>
            </div>

            <ReButton
              className={`mt-3 w-full rounded-full p-5 ${
                !settlementAmount ||
                settlementAmount <= 0 ||
                (user?.Wallet?.[0]?.balance || 0) < settlementAmount
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white'
              }`}
              type="submit"
              isSubmitting={isSubmittingForTransfer}
              disabled={
                isSubmittingForTransfer ||
                !settlementAmount ||
                settlementAmount <= 0 ||
                (user?.Wallet?.[0]?.balance || 0) < settlementAmount
              }
            >
              Proceed
            </ReButton>
          </form>
        </Form>
      )}

      {/* Step 2B: New Bank Form (Updated for Select) */}
      {transferType === 'bank' && !isShowPaymentConfirmation && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <ReHeading heading="Select Bank Name" size="base" />
                <FormField
                  control={control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loadingBanks}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={loadingBanks ? 'Loading banks...' : 'Select bank'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] bg-white p-0">
                          <div className="overflow-y-auto max-h-[280px]">
                            {banks?.length === 0 && !loadingBanks ? (
                              <div className="p-2 text-center text-sm text-gray-500">
                                No banks found.
                              </div>
                            ) : (
                              banks?.map((bank, i) => (
                                <SelectItem
                                  key={bank.code || `${bank.name}-${i}`}
                                  value={bank.name}
                                  className="cursor-pointer"
                                >
                                  {bank.name}
                                </SelectItem>
                              ))
                            )}
                          </div>
                        </SelectContent>
                      </Select>
                      {errors.bankName && (
                        <p className="text-sm text-red-500">{errors.bankName.message}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <ReHeading heading="Account Number" size="base" />
              <ReInput name="accountNumber" type="number" />
              {/* <input
                type="text"
                placeholder="Enter account number"
                {...register('accountNumber')}
                className="w-full rounded-md border p-3"
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-500">{errors.accountNumber.message}</p>
              )} */}

              <input type="hidden" {...register('bankCode')} />
              <div className="text-sm text-gray-500">
                Bank Code: {watch('bankCode') || 'Auto-filled upon bank selection'}
              </div>

              <ReHeading heading="Amount to Transfer" size="base" />
              <ReInput name="amountWithdraw" type="number" />
              {/* <input
                type="number"
                placeholder="₦"
                {...register('amountWithdraw', { valueAsNumber: true })}
                className="w-full rounded-md border p-3"
              />
              {errors.amountWithdraw && (
                <p className="text-sm text-red-500">{errors.amountWithdraw.message}</p>
              )} */}

              <p className="text-sm text-gray-600">
                Available Balance: ₦{user?.Wallet[0]?.balance || '0.00'}
              </p>
            </div>

            <ReButton
              className={`mt-6 w-full rounded-full p-5 ${
                !bankAmount || bankAmount <= 0 || (user?.Wallet?.[0]?.balance || 0) < bankAmount
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white'
              }`}
              type="submit"
              isSubmitting={isSubmitting}
              disabled={
                isSubmitting ||
                !bankAmount ||
                bankAmount <= 0 ||
                (user?.Wallet?.[0]?.balance || 0) < bankAmount
              }
            >
              Proceed
            </ReButton>
          </form>
        </Form>
      )}

      {/* Step 3: Payment Confirmation + PIN (Remains the same) */}
      {isShowPaymentConfirmation && withdrawalData && (
        <PaymentConfirmation
          amount={withdrawalData.amountWithdraw || 0}
          bankName={getSafeString(
            selectedAccount?.bankName,
            (withdrawalData as TWithdrawfund)?.bankName || defaultAccount.bankName
          )}
          accountNumber={getSafeString(
            selectedAccount?.accountNumber,
            (withdrawalData as TWithdrawfund)?.accountNumber || defaultAccount.accountNumber
          )}
          bankCode={getSafeString(
            selectedAccount?.bankCode,
            (withdrawalData as TWithdrawfund)?.bankCode || defaultAccount.bankCode
          )}
          onAuthorize={handleWithdraw}
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
