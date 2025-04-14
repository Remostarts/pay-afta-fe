import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ReButton } from '@/components/re-ui/ReButton';

interface MilestonePayment {
  payment: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending';
}

interface MilestoneDialogProps {
  isInTransactionSummary?: boolean;
  onNext?: () => void;
  onClose?: () => void;
}

export default function MilestoneDialog({
  isInTransactionSummary = false,
  onNext,
  onClose,
}: MilestoneDialogProps) {
  const milestonePayments: MilestonePayment[] = [
    {
      payment: '1ST PAYMENT',
      date: 'Jan 08, 2025',
      amount: '₦8000',
      status: 'Paid',
    },
    {
      payment: '1ST PAYMENT',
      date: 'Jan 23, 2025',
      amount: '₦11000',
      status: 'Paid',
    },
    {
      payment: '1ST PAYMENT',
      date: 'Feb 11, 2025',
      amount: '₦11000',
      status: 'Paid',
    },
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="mb-4">
          <div className="flex items-center gap-2">
            <span>MILESTONE</span>
            <Badge variant="secondary" className="rounded-md bg-gray-200 px-2">
              3
            </Badge>
          </div>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="flex flex-col gap-4">
          {milestonePayments.map((payment, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">{payment.payment}</span>
                <span className="text-sm text-gray-900">{payment.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{payment.amount}</span>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-green-100 px-3 py-0.5 text-green-600"
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </DialogDescription>
      <DialogFooter>
        <ReButton onClick={isInTransactionSummary ? onNext : onClose} className="rounded-full">
          {isInTransactionSummary ? 'Next' : 'Close'}
        </ReButton>
      </DialogFooter>
    </DialogContent>
  );
}
