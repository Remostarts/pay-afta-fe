'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PaymentSuccessful from '../shared/PaymentSuccessful';

import MilestoneDialog from './MilestoneDialog';
import PaymentSummary from './PaymentSummary';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';

interface OrderAgreementProps {
  handleCurrentStepChange: (step: number) => void;
  isProduct?: boolean;
}

export default function MakePayment({
  handleCurrentStepChange,
  isProduct = false,
}: OrderAgreementProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentComponent, setCurrentComponent] = useState<'summary' | 'milestone' | 'successful'>(
    'summary'
  );
  const router = useRouter();

  const handleAcceptOrder = () => {
    setIsOpen(true);
  };

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

  const handleConfirmTransaction = () => {
    if (isProduct) {
      handlePayment();
      return;
    }
    if (currentComponent === 'summary') {
      setCurrentComponent('milestone');
    } else if (currentComponent === 'milestone') {
      setCurrentComponent('successful');
    } else {
      handleCurrentStepChange(3);
      setIsOpen(false);
    }
  };

  return (
    <section className="mt-5 rounded-xl border-2 border-gray-200 bg-gray-100 p-5">
      <div className="mb-5">
        <h1 className="font-inter text-xl font-bold text-gray-800">Make Payment</h1>
        <p className="font-inter text-gray-600">
          Kindly process your payment to kickstart your secure escrow transaction, ensuring a smooth
          and trustworthy exchange of product or services.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <ReButton className="w-2/5 rounded-full" onClick={handleAcceptOrder}>
              Make Payment
            </ReButton>
          </DialogTrigger>
          <DialogContent>
            {currentComponent === 'summary' ? (
              <PaymentSummary />
            ) : currentComponent === 'milestone' ? (
              <MilestoneDialog
                isInTransactionSummary={true}
                onNext={handleConfirmTransaction}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              <PaymentSuccessful label={'Transaction confirmed!'} />
            )}
            {currentComponent === 'summary' && (
              <DialogFooter>
                <ReButton onClick={handleConfirmTransaction} className="rounded-full">
                  Pay with Wallet Balance
                </ReButton>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
