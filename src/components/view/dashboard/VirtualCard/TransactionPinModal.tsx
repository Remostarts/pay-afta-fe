import { ReButton } from '@/components/re-ui/ReButton';
import RePin from '@/components/re-ui/RePin';

interface ITransactionPinModalProps {
  handleCurrentDialogStep(data?: string): void;
}

export default function TransactionPinModal({
  handleCurrentDialogStep,
}: ITransactionPinModalProps) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-md bg-white">
      <h2 className="text-lg font-bold">Enter Transaction Pin</h2>
      <p className="mb-4 text-center font-inter text-gray-600">Protect your payment</p>
      <RePin count={4} />
      <ReButton className="mt-10 w-[70%] rounded-full" onClick={() => handleCurrentDialogStep()}>
        Authorize Payment
      </ReButton>
    </div>
  );
}
