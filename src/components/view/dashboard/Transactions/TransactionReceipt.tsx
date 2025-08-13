import { Copy, ReceiptText } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TransactionReceiptProps {
  onClose: () => void;
  amount: string;
  date: string;
  status: string;
  transactionType: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  narration: string;
  transactionId: string;
}

export const TransactionReceipt = ({
  onClose,
  amount,
  date,
  status,
  transactionType,
  bankName,
  accountNumber,
  accountName,
  narration,
  transactionId,
}: TransactionReceiptProps) => {
  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Transaction Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className=" text-center">
            <p className="font-inter text-2xl font-bold text-gray-900">-₦{amount}</p>
            <p className="font-inter text-sm text-gray-500">{date}</p>
          </div>

          <div className="space-y-3 border-t border-dashed border-black">
            <div className="mt-2 flex justify-between">
              <p className="text-gray-500">Status</p>
              <p
                className={`rounded-full px-3 py-1 text-sm ${
                  status === 'Successful'
                    ? 'bg-[#E8FDEF] text-[#0F973C]'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {status}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Transaction Type</p>
              <p className="font-medium">{transactionType}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Bank Name</p>
              <p className="font-medium">{bankName}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Account Number</p>
              <p className="font-medium">{accountNumber}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Account Name</p>
              <p className="font-medium">{accountName}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Narration</p>
              <p className="font-medium">{narration}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-gray-500">Transaction ID</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{transactionId}</p>
                <button onClick={handleCopyTransactionId}>
                  <Copy size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#03045B] py-3 text-white">
            Download Receipt <ReceiptText size={20} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
