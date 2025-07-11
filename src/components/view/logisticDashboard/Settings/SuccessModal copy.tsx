import Image from 'next/image';
import React from 'react';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-white p-8">
      <div className="mb-4">
        <Image
          src="/assets/dashboard/Dashboard/payment-checked.svg"
          alt="payment-checked"
          width={120}
          height={120}
        />
      </div>
      <div className="mb-6 text-center">
        <div className="mb-2 text-lg font-semibold">
          You have successfully Add New Settlement Account.
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-full bg-black px-8 py-2 font-semibold text-white"
      >
        Done
      </button>
    </div>
  );
};

export default SuccessModal;
