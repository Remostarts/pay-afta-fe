'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { toast } from 'sonner';
import {
  addSettlementBankAccount,
  getPillaBanks,
} from '@/lib/actions/onboarding/onboarding.actions';
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
  accountHolder: '',
  isDefaultPayout: false,
};

const AddSettlementForm: React.FC<AddSettlementFormProps> = ({ onClose, onSuccess }) => {
  const methods = useForm<TAddSettlement>({
    resolver: zodResolver(addSettlementSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState } = methods;
  const { isSubmitting } = formState;

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

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

  return (
    <FormProvider {...methods}>
      <div className="relative w-full max-w-md rounded-xl bg-white p-8">
        <button className="absolute right-4 top-4 text-2xl" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <h2 className="mb-2 text-xl font-semibold">Add Settlement</h2>
        <p className="mb-6 text-sm text-gray-500">
          Ensure the provided account details match your BVN Information
        </p>

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
          <ReInput
            label="Account Holder Name"
            name="accountHolder"
            placeholder="Enter account holder name"
          />

          <div className="flex justify-end">
            <ReButton
              type="submit"
              disabled={isSubmitting || !methods.formState.isValid}
              isSubmitting={isSubmitting}
              className="rounded-full text-white lg:w-2/5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </ReButton>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default AddSettlementForm;
