'use client';

import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';

interface AddSettlementFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

type SettlementFormValues = {
  bankName: string;
  accountNumber: string;
  accountName: string;
};

const AddSettlementForm: React.FC<AddSettlementFormProps> = ({ onClose, onSuccess }) => {
  const methods = useForm<SettlementFormValues>({
    defaultValues: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<SettlementFormValues> = (data) => {
    alert('confirm');
    console.log('💰 Submitted Settlement Data:', data);

    // API call example
    // await addSettlementAccount(data);

    onSuccess(); // success modal দেখানোর জন্য
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
          <div>
            <ReHeading heading="Bank Name" />
            <ReInput name="bankName" placeholder="Enter bank name" required />
          </div>

          <div>
            <ReHeading heading="Account Number" />
            <ReInput name="accountNumber" placeholder="Enter account number" required />
          </div>

          <div>
            <ReHeading heading="Account Holder Name" />
            <ReInput name="accountName" placeholder="Enter account holder name" required />
          </div>

          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-blue-900 py-2 font-semibold text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </FormProvider>
  );
};

export default AddSettlementForm;
