'use client';

import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { toast } from 'sonner';
import { addSettlementBankAccount } from '@/lib/actions/onboarding/onboarding.actions';
import { ReButton } from '@/components/re-ui/ReButton';

interface AddSettlementFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

type SettlementFormValues = {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder?: string;
  isDefaultPayout?: boolean;
};

const AddSettlementForm: React.FC<AddSettlementFormProps> = ({ onClose, onSuccess }) => {
  const methods = useForm<SettlementFormValues>({
    defaultValues: {
      bankName: '',
      bankCode: '',
      accountNumber: '',
      accountHolder: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, formState } = methods;
  const { isSubmitting } = formState;

  const onSubmit: SubmitHandler<SettlementFormValues> = async (data) => {
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
          <ReInput label="Bank Name" name="bankName" placeholder="Enter bank name" required />
          <ReInput label="Bank Code" name="bankCode" placeholder="Enter bank Code" required />
          <ReInput
            label="Account Number"
            name="accountNumber"
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
              disabled={isSubmitting}
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
