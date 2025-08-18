import React, { useState } from 'react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';

interface AddSettlementFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddSettlementForm: React.FC<AddSettlementFormProps> = ({ onClose, onSuccess }) => {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulate success
    onSuccess();
  }

  return (
    <div className="relative w-full max-w-md rounded-xl bg-white p-8">
      <button className="absolute right-4 top-4 text-2xl" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <h2 className="mb-2 text-xl font-semibold">Add Settlement</h2>
      <p className="mb-6 text-sm text-gray-500">
        Ensure the provided account details match your BVN Information
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <ReHeading heading="Bank Name" />
          <ReInput name="bankName" />
        </div>
        <div>
          <ReHeading heading="Account Number" />
          <ReInput name="accountNumber" />
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-full bg-blue-900 py-2 font-semibold text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSettlementForm;
