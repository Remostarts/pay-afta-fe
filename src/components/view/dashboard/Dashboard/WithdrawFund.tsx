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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPillaBanks } from '@/lib/actions/onboarding/onboarding.actions';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { withdrawFundFromWallet, enquiryBankAccount } from '@/lib/actions/root/user.action';
import { SearchableSelect } from '@/components/re-ui/SearchableSelect';

type Bank = {
  name: string;
  code: string;
};

type AccountProps = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  narration: string;
  bankCode?: string;
  id?: string;
};

const defaultValues: TWithdrawfund = {
  bankName: '',
  accountNumber: '',
  bankCode: '',
  accountName: '',
  narration: '',
  amountWithdraw: 0,
};

const defaultValuesForTransferFund: TTransferfundSchema = {
  amountWithdraw: 0,
  narration: '',
};

export default function WithdrawFund() {
  const { user } = useGeneral();

  const [isShowPaymentConfirmation, setIsShowPaymentConfirmation] = useState(false);
  const [isShowSwitchAccount, setIsShowSwitchAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountProps | null>(null);
  console.log('🌼 🔥🔥 WithdrawFund 🔥🔥 selectedAccount🌼', selectedAccount);

  const [withdrawalData, setWithdrawalData] = useState<TWithdrawfund | TTransferfundSchema | null>(
    null
  );
  console.log('🌼 🔥🔥 WithdrawFund 🔥🔥 withdrawalData🌼', withdrawalData);

  const [transferType, setTransferType] = useState<'bank' | 'settlement' | null>(null);

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryResult, setEnquiryResult] = useState<{
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode: string;
  } | null>(null);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanks() {
      setLoadingBanks(true);
      try {
        const res: any = await getPillaBanks();
        setBanks(
          (res?.data || []).sort((a: Bank, b: Bank) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
          )
        );
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
      narration: (bank as any).narration || '',
      bankCode: bank.bankCode || '',
      id: bank.id,
    })) || [];

  const defaultAccount: AccountProps = accounts[0] || {
    bankName: '',
    accountNumber: '',
    accountName: '',
    bankCode: '',
    narration: '',
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

  const { handleSubmit, register, formState, control, watch, setValue } = form;
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
  const accountNumberValue = form.watch('accountNumber');
  const bankCodeValue = form.watch('bankCode');
  const accountNameValue = form.watch('accountName');

  // Get form validation states
  const { isValid: isFormValid, errors: formErrors } = form.formState;
  const { isValid: isTransferFormValid } = transferForm.formState;

  // Bank account enquiry function
  const handleBankAccountEnquiry = async (accountNumber: string, bankCode: string) => {
    if (!accountNumber || !bankCode || accountNumber.length < 10) {
      setEnquiryResult(null);
      setEnquiryError(null);
      return;
    }

    setEnquiryLoading(true);
    setEnquiryError(null);

    try {
      const result = await enquiryBankAccount({
        account_number: accountNumber,
        bank_code: parseInt(bankCode),
      });

      console.log(result);

      if (result.success && result.data) {
        setEnquiryResult({
          accountName: result.data.account_name || '',
          accountNumber: accountNumber,
          bankName: result.data.bank_name || '',
          bankCode: bankCode,
        });
        setEnquiryError(null);
        // Update form with account name
        setValue('accountName', result.data.account_name || '', { shouldValidate: true });
      } else {
        setEnquiryResult(null);
        setEnquiryError(result.message || 'Failed to verify account details');
        // Clear account name on failed enquiry
        setValue('accountName', '', { shouldValidate: true });
      }
    } catch (error: any) {
      setEnquiryResult(null);
      setEnquiryError(error.message || 'Account verification failed');
      // Clear account name on error
      setValue('accountName', '', { shouldValidate: true });
    } finally {
      setEnquiryLoading(false);
    }
  };

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

  // Watch for account number and bank code changes to trigger enquiry
  useEffect(() => {
    if (accountNumberValue && bankCodeValue && transferType === 'bank') {
      const timeoutId = setTimeout(() => {
        handleBankAccountEnquiry(accountNumberValue, bankCodeValue);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [accountNumberValue, bankCodeValue, transferType]);

  // Clear enquiry results when transfer type changes
  useEffect(() => {
    if (transferType !== 'bank') {
      setEnquiryResult(null);
      setEnquiryError(null);
    }
  }, [transferType]);

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
          accountName:
            enquiryResult?.accountName || (withdrawalData as TWithdrawfund)?.accountName || '',
          bankCode: (withdrawalData as TWithdrawfund)?.bankCode || '',
          narration: (withdrawalData as TWithdrawfund)?.narration || '',
        };
      } else if (transferType === 'settlement') {
        body.savedAccountId = selectedAccount?.id || defaultAccount.id;
      }

      const res = await withdrawFundFromWallet(body);

      if (!res.success) throw new Error(res.message || 'Withdrawal failed');

      toast.success('Withdrawal successful 🎉');
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Withdrawal failed');
      return false;
    }
  };

  const getSafeString = (value?: string | null, fallback = '') => value || fallback;

  // Helper function to check if bank transfer form is properly validated
  const isBankFormValid = () => {
    return (
      isFormValid &&
      !!selectedBankName &&
      !!bankCodeValue &&
      !!accountNumberValue &&
      !!accountNameValue &&
      !!bankAmount &&
      bankAmount > 0 &&
      (user?.Wallet?.[0]?.balance || 0) >= bankAmount &&
      !enquiryError &&
      (!!enquiryResult || !enquiryLoading) &&
      accountNumberValue.length >= 10
    );
  };

  // Helper function to check if settlement form is properly validated
  const isSettlementFormValid = () => {
    return (
      isTransferFormValid &&
      !!settlementAmount &&
      settlementAmount > 0 &&
      (user?.Wallet?.[0]?.balance || 0) >= settlementAmount
    );
  };

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
              {/* <ReInput name="amountWithdraw" type="number" /> */}
              <input
                type="number"
                placeholder="₦"
                inputMode="numeric"
                {...registerTransfer('amountWithdraw', { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-0 focus:border-gray-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {transferErrors.amountWithdraw && (
                <p className="text-base font-normal text-primary-800">
                  {transferErrors.amountWithdraw.message}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Available Balance: ₦{user?.Wallet[0]?.balance || '0.00'}
              </p>
            </div>

            <div>
              <ReInput
                name="narration"
                label="Narration"
                placeholder="Enter narration"
                type="text"
              />
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
                !isSettlementFormValid()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white'
              }`}
              type="submit"
              isSubmitting={isSubmittingForTransfer}
              disabled={isSubmittingForTransfer || !isSettlementFormValid()}
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
                <ReHeading heading="Select Bank Name" size="base" className="mb-3" />
                <FormField
                  control={control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <SearchableSelect
                        type="bank"
                        options={banks}
                        onChange={field.onChange}
                        loading={loadingBanks}
                        placeholder="Select bank"
                        limit={25}
                      />
                      {errors.bankName && (
                        <p className="text-base font-normal text-primary-800">
                          {errors.bankName.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <ReHeading heading="Account Number" size="base" />
              <ReInput name="accountNumber" inputMode="numeric" type="number" />
              {/* <input
                type="text"
                placeholder="Enter account number"
                {...register('accountNumber')}
                className="w-full rounded-md border p-3"
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-500">{errors.accountNumber.message}</p>
              )} */}

              {/* Bank Account Enquiry Results */}
              {(enquiryLoading || enquiryResult || enquiryError) && (
                <div className="mt-2 p-3 rounded-md border">
                  {enquiryLoading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      Verifying account details...
                    </div>
                  )}

                  {enquiryResult && !enquiryLoading && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Account verified successfully
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Account Name: {enquiryResult.accountName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {enquiryResult.accountNumber} • {enquiryResult.bankName}
                      </p>
                    </div>
                  )}

                  {enquiryError && !enquiryLoading && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {enquiryError}
                    </div>
                  )}
                </div>
              )}

              {/* Manual Enquiry Button */}
              {!enquiryLoading &&
                accountNumberValue &&
                bankCodeValue &&
                accountNumberValue.length >= 10 &&
                !enquiryResult && (
                  <button
                    type="button"
                    onClick={() => handleBankAccountEnquiry(accountNumberValue, bankCodeValue)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Verify Account Details
                  </button>
                )}

              <input type="hidden" {...register('bankCode')} />
              <div className="text-sm text-gray-500">
                Bank Code: {watch('bankCode') || 'Auto-filled upon bank selection'}
              </div>

              <ReHeading heading="Amount to Transfer" size="base" />
              {/* <ReInput name="amountWithdraw" inputMode="numeric" type="number" /> */}
              <input
                type="number"
                placeholder="₦"
                inputMode="numeric"
                {...register('amountWithdraw', { valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-0 focus:border-gray-300 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {errors.amountWithdraw && (
                <p className="text-base font-normal text-primary-800">
                  {errors.amountWithdraw.message}
                </p>
              )}

              <p className="text-sm text-gray-600">
                Available Balance: ₦{user?.Wallet[0]?.balance || '0.00'}
              </p>
            </div>

            <div>
              <ReHeading heading="Narration" size="base" />
              <ReInput name="narration" />
            </div>

            <ReButton
              className={`mt-6 w-full rounded-full p-5 ${
                !isBankFormValid()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#03045B] text-white'
              }`}
              type="submit"
              isSubmitting={isSubmitting}
              disabled={isSubmitting || !isBankFormValid()}
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
            onAccountSelect={(account) => handleAccountSelect({ ...account, narration: '' })}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
