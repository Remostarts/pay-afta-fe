import { useRouter } from 'next/navigation';

import {
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ReButton } from '@/components/re-ui/ReButton';
import { Button } from '@/components/ui/button';

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
  const router = useRouter();
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

  const handlePayment = async () => {
    // if (lawyerId === session?.id) return;
    // const paymentData = {
    //   clientId: session?.id,
    //   lawyerId: invoice.lawyer?.id,
    //   chatId: invoice?.chatId,
    //   email: session?.user?.email,
    //   amount,
    //   installmentId,
    // };
    // console.log('🌼 🔥🔥 handlePayment 🔥🔥 paymentData🌼', paymentData);

    // setPayingInstallmentId(installmentId);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/payment-initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: session?.accessToken, // Replace with your actual token logic
          },
          // body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create invoice. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Invoice created successfully:', data);
      router.push(data?.data?.paymentUrl);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };
  // console.log(isInTransactionSummary);

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
                {/* <Badge
                  variant="secondary"
                  className="rounded-full bg-green-100 px-3 py-0.5 text-green-600"
                >
                  {payment.status}
                </Badge> */}
                <Button
                  onClick={handlePayment}
                  variant="secondary"
                  className="cursor-pointer bg-red-100 text-red-600 hover:bg-red-100 disabled:bg-gray-100 disabled:text-gray-400"
                  // disabled={invoice?.seen !== 'accept' || !!payingInstallmentId}
                >
                  {/* {payingInstallmentId === installment.id ? ( // [Fix] Check specific installment ID
                    <>
                      <Loader className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Pay'
                  )} */}
                  Pay
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogDescription>
      {isInTransactionSummary && (
        <DialogFooter>
          <ReButton onClick={onNext} className="rounded-full">
            Next
          </ReButton>
        </DialogFooter>
      )}
    </DialogContent>
  );
}
