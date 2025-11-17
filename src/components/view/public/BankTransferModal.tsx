'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Copy, Check, X, ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TWalletData } from '@/types/order';
import Image from 'next/image';

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  oneTimeUseWallet?: TWalletData;
}

type ModalState = 'initial' | 'confirmation' | 'success' | 'failure';
type TimerStatus = 'running' | 'completed' | 'expired';

interface ServerTime {
  epoch: number;
  offset: number;
}

interface TimerState {
  timeLeft: number;
  status: TimerStatus;
  serverTime: ServerTime | null;
}

export default function BankTransferModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
  onError,
  oneTimeUseWallet,
}: BankTransferModalProps) {
  // Modal state management
  const [modalState, setModalState] = useState<ModalState>('initial');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [hasFocusTrapped, setHasFocusTrapped] = useState(false);

  // Timer state
  const [initialTimer, setInitialTimer] = useState<TimerState>({
    timeLeft: 29 * 60 + 59, // 29:59 in seconds
    status: 'running',
    serverTime: null,
  });

  const [confirmationTimer, setConfirmationTimer] = useState<TimerState>({
    timeLeft: 5 * 60, // 5 minutes
    status: 'running',
    serverTime: null,
  });

  // Error state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for accessibility
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Server time synchronization
  const getServerTime = useCallback(async (): Promise<ServerTime> => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/time');
      const endTime = performance.now();

      if (!response.ok) {
        throw new Error('Failed to get server time');
      }

      const data = await response.json();
      const networkLatency = (endTime - startTime) / 2;

      return {
        epoch: data.epoch,
        offset: networkLatency,
      };
    } catch (error) {
      console.warn('Failed to sync server time, using local time:', error);
      return {
        epoch: Date.now(),
        offset: 0,
      };
    }
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Copy to clipboard functionality
  const copyToClipboard = useCallback(async (text: string, field: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  }, []);

  // Focus management
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!dialogRef.current) return [];

    const focusableElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    return Array.from(focusableElements) as HTMLElement[];
  }, []);

  const trapFocus = useCallback(
    (event: KeyboardEvent) => {
      if (!hasFocusTrapped || modalState !== 'initial') return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleModalClose();
      }
    },
    [getFocusableElements, hasFocusTrapped, modalState]
  );

  // Handle backdrop clicks
  const handleBackdropClick = useCallback(
    (event: React.MouseEvent) => {
      if (modalState === 'initial' && event.target === event.currentTarget) {
        handleModalClose();
      }
    },
    [modalState]
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    if (modalState === 'confirmation') {
      // Don't allow closing during confirmation state
      return;
    }

    setModalState('initial');
    setError(null);
    setCopiedField(null);
    setInitialTimer((prev) => ({ ...prev, timeLeft: 29 * 60 + 59, status: 'running' }));
    setConfirmationTimer((prev) => ({ ...prev, timeLeft: 5 * 60, status: 'running' }));
    onClose();
  }, [modalState, onClose]);

  // Initialize server time and timers
  useEffect(() => {
    if (!isOpen) return;

    // Store current active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the dialog
    setTimeout(() => {
      if (dialogRef.current) {
        dialogRef.current.focus();
        setHasFocusTrapped(true);
      }
    }, 0);

    // Add event listeners
    document.addEventListener('keydown', trapFocus);

    return () => {
      document.removeEventListener('keydown', trapFocus);
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, trapFocus]);

  // Timer effect
  useEffect(() => {
    if (!isOpen) return;

    let interval: NodeJS.Timeout;

    const updateTimer = async () => {
      if (modalState === 'initial' && initialTimer.status === 'running') {
        setInitialTimer((prev) => {
          if (prev.timeLeft <= 0) {
            return { ...prev, timeLeft: 0, status: 'expired' };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      } else if (modalState === 'confirmation' && confirmationTimer.status === 'running') {
        setConfirmationTimer((prev) => {
          if (prev.timeLeft <= 0) {
            // Simulate successful payment confirmation
            setModalState('success');
            return { ...prev, timeLeft: 0, status: 'completed' };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }
    };

    interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isOpen, modalState, initialTimer.status, confirmationTimer.status]);

  // Reset modal when it opens
  useEffect(() => {
    if (isOpen) {
      setModalState('initial');
      setError(null);
      setCopiedField(null);
      setInitialTimer((prev) => ({ ...prev, timeLeft: 29 * 60 + 59, status: 'running' }));
      setConfirmationTimer((prev) => ({ ...prev, timeLeft: 5 * 60, status: 'running' }));
    }
  }, [isOpen]);

  // Handle "I have sent money" action
  const handleMoneySent = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call to process transfer
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setModalState('confirmation');
      setError(null);
    } catch (error) {
      setError('Failed to process transfer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle retry after failure
  const handleRetry = useCallback(() => {
    setModalState('initial');
    setError(null);
    setInitialTimer((prev) => ({ ...prev, timeLeft: 29 * 60 + 59, status: 'running' }));
    setConfirmationTimer((prev) => ({ ...prev, timeLeft: 5 * 60, status: 'running' }));
  }, []);

  // Handle success
  const handleSuccess = useCallback(() => {
    setModalState('success');
    setTimeout(() => {
      onSuccess?.();
    }, 2000);
  }, [onSuccess]);

  // Announce state changes to screen readers
  useEffect(() => {
    const announcements: Record<ModalState, string> = {
      initial: 'Bank transfer dialog opened. Transfer details displayed.',
      confirmation: 'Transfer confirmation in progress. Waiting for bank confirmation.',
      success: 'Transfer confirmed successfully!',
      failure: 'Transfer failed. Please retry or contact support.',
    };

    if (isOpen && announcements[modalState]) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = announcements[modalState];

      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [isOpen, modalState]);

  // Memoized data
  const transferData = useMemo(
    () => ({
      bankName: oneTimeUseWallet?.bankName || 'PayAfta Bank',
      accountNumber: oneTimeUseWallet?.accountNumber || '1234567890',
      accountName: oneTimeUseWallet?.accountName || 'PayAfta Escrow',
      reference: oneTimeUseWallet?.referenceId || `REF-${Date.now()}`,
      amount: oneTimeUseWallet?.balance ? parseFloat(oneTimeUseWallet.balance) : amount,
    }),
    [oneTimeUseWallet, amount]
  );

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bank-transfer-title"
      aria-describedby="bank-transfer-description"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {modalState === 'initial' && (
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Close dialog"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h2 id="bank-transfer-title" className="text-xl font-semibold text-gray-900">
                Bank Transfer
              </h2>
            </div>

            {modalState === 'failure' && (
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Initial Transfer State */}
          {modalState === 'initial' && (
            <>
              <div className="mb-4">
                <p className="text-gray-800 text-2xl font-inter">
                  Transfer{' '}
                  <span className="font-semibold">{formatCurrency(transferData.amount)}</span> to
                  PayAfta
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 block mb-1">Bank Name</p>
                  <p className="text-gray-900 font-medium">{transferData.bankName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 block mb-1">Account Number</p>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-900 font-medium">{transferData.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(transferData.accountNumber, 'account')}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Copy account number"
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
                    <span className="text-gray-900 font-medium">
                      {formatCurrency(transferData.amount)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transferData.amount.toString(), 'amount')}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Copy amount"
                    >
                      {copiedField === 'amount' ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 block mb-1">Reference</p>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-900 font-medium">{transferData.reference}</span>
                    <button
                      onClick={() => copyToClipboard(transferData.reference, 'reference')}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Copy reference"
                    >
                      {copiedField === 'reference' ? (
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
                  <li>• This account will be used to verify your transaction</li>
                  <li>• Send the exact amount to complete checkout successfully</li>
                  <li>• Reference: {transferData.reference}</li>
                </ul>
              </div>

              <div className="mb-6 text-center">
                <p className="text-sm text-gray-600">
                  Expires in{' '}
                  <span className="text-green-600 font-medium">
                    {formatTime(initialTimer.timeLeft)}
                  </span>
                </p>
              </div>

              <Button
                onClick={handleMoneySent}
                disabled={isLoading || initialTimer.status === 'expired'}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  'I have sent the money'
                )}
              </Button>
            </>
          )}

          {/* Confirmation State */}
          {modalState === 'confirmation' && (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Your transfer is on the way. It can take up to 5 minutes to confirm.
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
                  Waiting for confirmation:{' '}
                  <span className="text-green-600 font-medium">
                    {formatTime(confirmationTimer.timeLeft)}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {modalState === 'success' && (
            <div className="text-center">
              {/* Animated Icon */}
              <div className="flex items-center justify-center mb-5">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75"></div>
                  <Image
                    src="/assets/dashboard/Dashboard/payment-checked.svg"
                    alt="Payment successful icon"
                    width={110}
                    height={110}
                    className="relative z-10 drop-shadow-md"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Transfer Confirmed!</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your payment has been processed successfully.
              </p>
              <Button
                onClick={handleSuccess}
                className="w-full bg-[#03045B] text-white rounded-full"
              >
                Done
              </Button>
            </div>
          )}

          {/* Failure State */}
          {modalState === 'failure' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Transfer Failed</h3>
              <p className="text-sm text-gray-600 mb-6">
                We couldn't confirm your transfer. Please check your bank and try again.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} />
                  Retry Transfer
                </Button>
                <Button onClick={handleModalClose} variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
