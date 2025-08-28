'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

import { ReButton } from '@/components/re-ui/ReButton';

interface PaymentSummaryProps {
  onWalletPayment?: () => void;
  onBankTransferSelect?: () => void;
  onClose?: () => void;
}

export default function PaymentSummaryForService({
  onWalletPayment,
  onBankTransferSelect,
  onClose,
}: PaymentSummaryProps) {
  const [selectedPayment, setSelectedPayment] = useState('wallet');

  const walletBalance = 500000.0; // ₦200,000.00
  const totalAmount = 335050.0; // ₦335,050.00
  const hasInsufficientBalance = walletBalance < totalAmount;

  useEffect(() => {
    if (hasInsufficientBalance) {
      setSelectedPayment('bank');
    }
  }, [hasInsufficientBalance]);

  const handlePaymentClick = () => {
    if (selectedPayment === 'bank') {
      if (onBankTransferSelect) {
        onBankTransferSelect();
      }
    } else {
      console.log('Processing wallet payment...');
      if (onWalletPayment) {
        onWalletPayment();
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-900">Payment Summary</h2>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Transaction Amount</span>
          <span className="text-gray-900 font-medium">₦334,000.00</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Escrow fee @2.5%</span>
            <Info size={14} className="text-gray-400" />
          </div>
          <span className="text-gray-900 font-medium">₦1,050.00</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-semibold text-lg">Total</span>
            <span className="text-gray-900 font-bold text-xl">₦335,050.00</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-900 font-medium mb-4">Select Payment Method</h3>

        <div className="space-y-3">
          <button
            className={`rounded-lg p-4 border-2 w-full transition-colors ${
              hasInsufficientBalance
                ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75'
                : selectedPayment === 'wallet'
                  ? 'bg-green-50 border-green-200 cursor-pointer'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => !hasInsufficientBalance && setSelectedPayment('wallet')}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-medium ${hasInsufficientBalance ? 'text-gray-400' : 'text-gray-900'}`}
              >
                Wallet Balance: ₦{walletBalance.toLocaleString()}.00
              </span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  hasInsufficientBalance
                    ? 'border-gray-300'
                    : selectedPayment === 'wallet'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                }`}
              >
                {!hasInsufficientBalance && selectedPayment === 'wallet' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </button>

          {hasInsufficientBalance && (
            <p className="text-sm text-gray-600 -mt-1 mb-2">
              You do not have enough balance for this transaction.
            </p>
          )}

          <button
            className={`rounded-lg p-4 border-2 w-full transition-colors ${
              selectedPayment === 'bank'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedPayment('bank')}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium">Via Bank Transfer</span>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === 'bank' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}
              >
                {selectedPayment === 'bank' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      <ReButton className="rounded-full w-full" onClick={handlePaymentClick}>
        {selectedPayment === 'wallet' ? 'Pay with Wallet Balance' : 'Pay via Bank Transfer'}
      </ReButton>
    </div>
  );
}
