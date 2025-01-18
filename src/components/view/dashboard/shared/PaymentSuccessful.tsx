import Image from 'next/image';

interface PaymentSuccessfulProps {
  label?: string;
  amount?: number;
  bankName?: string;
}

export default function PaymentSuccessful({ label, amount, bankName }: PaymentSuccessfulProps) {
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
        <h2 className="mb-2 text-center font-inter text-2xl font-bold">{label}</h2>
        {label === 'Withdrawal Successful' ? (
          <p className="mb-4 text-center font-inter text-gray-600">
            You sent ₦{amount} to {bankName}.
          </p>
        ) : label === 'Transaction confirmed!' ? (
          <p className="mb-4 text-center font-inter text-gray-600">
            Proceeding to make the payment for the transaction.
          </p>
        ) : label === 'Payment Successful' ? (
          <p>
            Your payment of ₦300,000.00 has been successfully secured in escrow, ensuring a safe and
            smooth transaction process.
          </p>
        ) : null}
      </div>
    </section>
  );
}
