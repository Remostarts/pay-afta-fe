import Image from 'next/image';
import { useEffect } from 'react';

interface PaymentSuccessfulProps {
  label?: string;
  amount?: number;
  bankName?: string;
  onComplete?: () => void;
}

export default function PaymentSuccessful({
  label,
  amount,
  bankName,
  onComplete,
}: PaymentSuccessfulProps) {
  // Auto-trigger completion after showing success for a moment
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // Show success for 2 seconds

      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <section>
      <div className="mx-auto max-w-md rounded-lg bg-white p-6">
        <div className="flex items-center justify-center">
          <Image
            src="/assets/dashboard/Dashboard/payment-checked.svg"
            alt="payment-checked"
            width={120}
            height={120}
          />
        </div>
        <h2 className="mb-2 text-center font-inter text-2xl font-bold">
          {label || 'Transfer Successful'}
        </h2>
        {label === 'Withdrawal Successful' || label === 'Transfer Successful' ? (
          <p className="mb-4 text-center font-inter text-gray-600">
            You sent ₦{amount?.toLocaleString()} to {bankName}.
          </p>
        ) : label === 'Transaction confirmed!' ? (
          <p className="mb-4 text-center font-inter text-gray-600">
            Proceeding to make the payment for the transaction.
          </p>
        ) : label === 'Payment Successful' ? (
          <p className="mb-4 text-center font-inter text-gray-600">
            Your payment of ₦{amount?.toLocaleString()} has been successfully secured in escrow,
            ensuring a safe and smooth transaction process.
          </p>
        ) : null}
      </div>
    </section>
  );
}
