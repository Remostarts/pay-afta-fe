'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { toast } from 'sonner';
import {
  addSettlementBankAccount,
  getPillaBanks,
} from '@/lib/actions/onboarding/onboarding.actions';
import { enquiryBankAccount } from '@/lib/actions/root/user.action';
import { ReButton } from '@/components/re-ui/ReButton';
import { SearchableSelect } from '@/components/re-ui/SearchableSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { TAddSettlement, addSettlementSchema } from '@/lib/validations/setting.validation';

interface AddSettlementFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Bank = {
  name: string;
  code: string;
};

const defaultValues: TAddSettlement = {
  bankName: '',
  bankCode: undefined,
  accountNumber: '',
  // accountHolder: '',
  isDefaultPayout: false,
};

const AddSettlementForm: React.FC<AddSettlementFormProps> = ({ onClose, onSuccess }) => {
  const methods = useForm<TAddSettlement>({
    resolver: zodResolver(addSettlementSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch } = methods;
  const { isSubmitting } = formState;

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
        setBanks(res?.data || []);
      } catch (error) {
        toast.error('Failed to load bank list');
      } finally {
        setLoadingBanks(false);
      }
    }
    fetchBanks();
  }, []);

  const onSubmit: SubmitHandler<TAddSettlement> = async (data) => {
    // console.log('💰 Submitted Settlement Data:', data);
    // onSuccess();
    try {
      const result = await addSettlementBankAccount(data);

      if (result?.success) {
        toast.success('Settlement account added successfully!');
        onSuccess();
      } else {
        toast.error(result?.message || 'Failed to add settlement account');
      }
    } catch (error) {
      toast.error((error as Error).message || 'Something went wrong!');
    }
  };

  // Get current form values for watching
  const bankNameValue = methods.watch('bankName');
  const accountNumberValue = methods.watch('accountNumber');
  const bankCodeValue = methods.watch('bankCode');

  // Compute if account verification is needed
  const needsAccountVerification = bankNameValue && accountNumberValue && bankCodeValue;

  // Compute if the form is ready to submit
  // Form is ready when: all fields valid AND not loading AND (verification not needed OR account verified)
  const isFormReadyToSubmit =
    methods.formState.isValid &&
    !isSubmitting &&
    !enquiryLoading &&
    (!needsAccountVerification || enquiryResult !== null);

  // Set bank code when bank name changes
  useEffect(() => {
    if (bankNameValue && banks.length > 0) {
      const selected = banks.find((b) => b.name === bankNameValue);
      if (selected) {
        methods.setValue('bankCode', selected.code, { shouldValidate: true });
      }
    } else {
      methods.setValue('bankCode', undefined);
    }
  }, [bankNameValue, banks, methods]);

  // Bank account enquiry function
  const handleBankAccountEnquiry = async (accountNumber: string, bankCode: string | number) => {
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
        bank_code: bankCode.toString(),
      });

      console.log(result);

      if (result.success && result.data) {
        setEnquiryResult({
          accountName: result.data.account_name || '',
          accountNumber: accountNumber,
          bankName: result.data.bank_name || '',
          bankCode: bankCode.toString(),
        });
        setEnquiryError(null);
        // Update form with account name if needed in the future
        // methods.setValue('accountHolder', result.data.account_name || '', { shouldValidate: true });
      } else {
        setEnquiryResult(null);
        setEnquiryError(result.message || 'Failed to verify account details');
      }
    } catch (error: any) {
      setEnquiryResult(null);
      setEnquiryError(error.message || 'Account verification failed');
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Watch for account number and bank code changes to trigger enquiry
  useEffect(() => {
    if (accountNumberValue && bankCodeValue) {
      const timeoutId = setTimeout(() => {
        handleBankAccountEnquiry(accountNumberValue, bankCodeValue);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    } else {
      // Clear results when values are cleared
      setEnquiryResult(null);
      setEnquiryError(null);
    }
  }, [accountNumberValue, bankCodeValue]);

  return (
    <div className="relative w-full rounded-xl bg-white">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* <ReInput label="Bank Name" name="bankName" placeholder="Enter bank name" required /> */}
          <SearchableSelect
            type="bank"
            options={banks}
            onChange={(value) => methods.setValue('bankName', value)}
            placeholder="Select bank"
            limit={25}
            loading={loadingBanks}
          />
          {/* <ReInput
            label="Bank Code"
            name="bankCode"
            placeholder="Enter bank Code"
            type="number"
            inputMode="numeric"
            required
          /> */}
          <ReInput
            label="Account Number"
            name="accountNumber"
            type="number"
            inputMode="numeric"
            placeholder="Enter account number"
            required
          />

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

          <div className="text-sm text-gray-500" style={{ display: 'none' }}>
            Bank Code: {watch('bankCode') || 'Auto-filled upon bank selection'}
          </div>
          {/* <ReInput
            label="Account Holder Name"
            name="accountHolder"
            placeholder="Enter account holder name"
          /> */}

          <div className="flex justify-end">
            <ReButton
              type="submit"
              disabled={!isFormReadyToSubmit}
              isSubmitting={isSubmitting}
              className="rounded-full text-white lg:w-2/5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </ReButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddSettlementForm;
