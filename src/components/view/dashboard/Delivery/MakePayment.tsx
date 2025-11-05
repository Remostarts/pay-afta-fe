'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PaymentSuccessful from './PaymentSuccessful';
import BankTransferModal from './BankTransferModal';

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ReButton } from '@/components/re-ui/ReButton';
import { OrderDetails, TWalletData } from '@/types/order';
import { toast } from 'sonner';
import { createOneTimeUseWallet, makeWalletPayment } from '@/lib/actions/order/order.actions';
import { TOneTimeUseWallet, TPersonalWalletPaymentInput } from '@/lib/validations/order';
import { useGeneral } from '@/context/generalProvider';
import PaymentSummary from './PaymentSummary';
import {
  TDeliveryOneTimeUseWallet,
  TSellerPersonalWalletPaymentInput,
} from '@/lib/validations/delivery-order';
import {
  makeSellerWalletDeliveryPayment,
  sellerCreateOneTimeUseWallet,
} from '@/lib/actions/delivery/delivery.actions';

interface OrderAgreementProps {
  handleCurrentStepChange?: (step: number) => void;
  isProduct?: boolean;
  currentStepChange?: number;
  order?: OrderDetails | null;
  loadOrder?: () => Promise<void>;
  onPaymentSuccess?: () => void;
  onClose?: () => void;
}

export default function MakePayment({
  handleCurrentStepChange,
  isProduct = false,
  currentStepChange,
  order,
  loadOrder,
  onPaymentSuccess,
  onClose,
}: OrderAgreementProps) {
  const { loadUserData } = useGeneral();
  const [currentComponent, setCurrentComponent] = useState<
    'summary' | 'successful' | 'bankTransfer'
  >('summary');
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('wallet');
const amountWithSymbol = order?.amount;
const totalAmount = Number(String(amountWithSymbol).replace(/[^0-9.]/g, '') || 0);
  const router = useRouter();
  const [oneTimeUseWallet, setOneTimeUseWallet] = useState<TWalletData | null>(null);

  // console.log(order);
  // console.log(totalAmount);

  const handleWalletPayment = async () => {
    setLocalLoading(true);
    const data: TSellerPersonalWalletPaymentInput = {
      amount: totalAmount,
      deliveryId: order?.id ?? '',
    };
    // console.log(data);
    try {
      const response = await makeSellerWalletDeliveryPayment(data);
      console.log('🌼 🔥🔥 handleWalletPayment 🔥🔥 response🌼', response);

      if (response?.success) {
        loadUserData();
        setCurrentComponent('successful');
      } else {
        toast.error(response?.error || 'failed to make payment');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'failed to make payment');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleBankTransferSelect = async () => {
    setLocalLoading(true);
    const amount = order?.amount ? Number(String(order.amount).replace(/[^\d.]/g, '')) : 0;
    const deliveryId = order?.id ?? '';

    if (!amount || !deliveryId) {
      toast.error('Amount and delivery ID are required for payment.');
      setLocalLoading(false);
      return;
    }

    const data: TDeliveryOneTimeUseWallet = {
      amount: amount,
      deliveryId,
    };

    try {
      console.log('Sending data:', data);
      const response = await sellerCreateOneTimeUseWallet(data);

      console.log(response);

      if (response?.success) {
        setOneTimeUseWallet(response?.data);
        setCurrentComponent('bankTransfer');
      } else {
        toast.error(response?.error || 'failed to make payment');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'failed to make payment');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleBankTransferSuccess = () => {
    // Called when bank transfer process is complete
    setCurrentComponent('successful');
  };

  const handleBackToSummary = () => {
    setCurrentComponent('summary');
  };

  // const handleMilestoneNext = () => {
  //   setCurrentComponent('successful');
  //   setTimeout(() => {
  //     handleCurrentStepChange?.((currentStepChange ?? 0) + 1);
  //     onPaymentSuccess?.(); // Call the callback
  //   }, 2000);
  // };

  const handleSuccessComplete = () => {
    if (isProduct) {
      setTimeout(() => {
        handleCurrentStepChange?.((currentStepChange ?? 0) + 1);
        onPaymentSuccess?.(); // Call the callback to close dialog
      }, 2000);
      return;
    }
  };

  return (
    <section>
      <div className="flex w-full items-center justify-center">
        {/* Payment Summary Component */}
        {currentComponent === 'summary' && (
          <PaymentSummary
            onWalletPayment={handleWalletPayment}
            onBankTransferSelect={handleBankTransferSelect}
            onClose={() => onClose?.()}
            progressLoading={localLoading}
            amount={totalAmount}
          />
        )}

        {currentComponent === 'bankTransfer' && (
          <BankTransferModal
            isOpen={true}
            onClose={handleBackToSummary}
            amount={totalAmount}
            onSuccess={handleBankTransferSuccess}
            oneTimeUseWallet={oneTimeUseWallet ?? undefined}
          />
        )}

        {currentComponent === 'successful' && (
          <PaymentSuccessful
            label={'Payment Successful'}
            amount={totalAmount}
            onComplete={handleSuccessComplete}
          />
        )}
      </div>
    </section>
  );
}
