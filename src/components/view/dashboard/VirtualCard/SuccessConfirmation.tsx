import { ReButton } from '@/components/re-ui/ReButton';

interface ISuccessConfirmationProps {
  onClose: () => void;
}

export default function SuccessConfirmation({ onClose }: ISuccessConfirmationProps) {
  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center">
      <h2 className="mb-4 text-2xl font-bold text-green-600">Payment Successful</h2>
      <p className="mb-6 text-gray-600">
        Your virtual card has been created and funded successfully.
      </p>
      <ReButton className="w-full rounded-full font-inter" onClick={onClose}>
        Done
      </ReButton>
    </div>
  );
}
