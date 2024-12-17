import { ReButton } from '@/components/re-ui/ReButton';

interface IConfirmPaymentModalProps {
  amount: string;
  onConfirm: () => void;
}

export default function ConfirmPaymentModal({ amount, onConfirm }: IConfirmPaymentModalProps) {
  return (
    <div className="mx-auto max-w-md">
      <h2 className="mb-2 text-center font-inter text-2xl font-bold">Payment</h2>
      <p className="mb-4 text-center font-inter text-gray-600">
        Verify the details below before completing the payment.
      </p>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-gray-700">Amount</p>
        <p className="text-xl text-gray-900">₦{amount}</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-gray-700">Bank Name</p>
        <p className="font-inter text-gray-900">Bank Name</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-gray-700">Account Number</p>
        <p className="font-inter text-gray-900">123456789</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-gray-700">Account Name</p>
        <p className="font-inter text-gray-900">Jon Doe</p>
      </div>
      <div className="flex space-x-2">
        <ReButton className="w-full rounded-full p-3 font-inter" onClick={onConfirm}>
          Proceed to Payment
        </ReButton>
      </div>
    </div>
  );
}