'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, X, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
}

export default function BankTransferModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
}: BankTransferModalProps) {
  const [timeLeft, setTimeLeft] = useState(29 * 60 + 59); // 29:59 in seconds
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationTimeLeft, setConfirmationTimeLeft] = useState(1 * 5);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      if (showConfirmation) {
        setConfirmationTimeLeft((prev) => {
          if (prev <= 1) {
            // Confirmation timer completed - trigger success
            if (onSuccess) {
              onSuccess();
            }
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, showConfirmation, onSuccess]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(false);
      setTimeLeft(29 * 60 + 59);
      setConfirmationTimeLeft(1 * 5);
      setCopiedField(null);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleMoneySent = () => {
    setShowConfirmation(true);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white">
      {!showConfirmation ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Bank Transfer</h2>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-800 text-2xl font-inter">
              Transfer <span className="font-semibold">₦{amount.toLocaleString()}.00</span> to
              PayAfta
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 block mb-1">Bank Name</p>
              <p className="text-gray-900 font-medium">Wema Bank</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 block mb-1">Account Number</p>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-900 font-medium">001223344</span>
                <button
                  onClick={() => copyToClipboard('001223344', 'account')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copiedField === 'account' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 block mb-1">Amount</p>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-900 font-medium">₦{amount.toLocaleString()}.00</span>
                <button
                  onClick={() => copyToClipboard(amount.toString(), 'amount')}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {copiedField === 'amount' ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <ul className="text-sm text-red-600 space-y-1">
              <li>
                • This account details provided to you, will be used to verify this transaction.
              </li>
              <li>• Send exact amount to checkout successfully</li>
            </ul>
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">
              Expires in <span className="text-green-600 font-medium">{formatTime(timeLeft)}</span>{' '}
              minutes
            </p>
          </div>

          <Button
            onClick={handleMoneySent}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            I have sent the money
          </Button>
        </>
      ) : (
        <>
          {/* <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Transfer Confirmation</h2>
          </div> */}

          <div className="text-center mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Your transfer is on the way, it can take up to a minute to confirm
            </h3>

            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
                <div className="w-24 h-0.5 bg-green-300 mx-2 relative">
                  <div className="absolute inset-0 bg-green-300 animate-pulse"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-evenly text-sm text-gray-600 mb-8">
              <span>Sent</span>
              <span>Confirmed</span>
            </div>

            <p className="text-sm text-gray-600">
              Please wait for{' '}
              <span className="text-green-600 font-medium">{formatTime(confirmationTimeLeft)}</span>{' '}
              minutes
            </p>

            {confirmationTimeLeft <= 0 && (
              <div className="mt-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check size={16} className="text-white" />
                </div>
                <p className="text-green-600 font-medium">Transfer Confirmed!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
