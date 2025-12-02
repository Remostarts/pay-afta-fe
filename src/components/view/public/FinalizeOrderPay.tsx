'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import ReSubHeading from '@/components/re-ui/ReSubHeading';
import BankTransferModal from '@/components/view/public/BankTransferModal';
import { TWalletData } from '@/types/order';
import {
  createOneTimeUseWallet,
  createGuestOneTimeUseWallet,
} from '@/lib/actions/order/order.actions';
import { useOrder } from './useOrderHook';

interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FinalizeOrderPayProps {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

export default function FinalizeOrderPay({
  onPaymentSuccess,
  onPaymentError,
}: FinalizeOrderPayProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlOrderId = searchParams?.get('orderId') ;
  const { order, loading, error, userRole, userId, viewer } = useOrder(urlOrderId as string);

  const [agree, setAgree] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [walletData, setWalletData] = useState<TWalletData | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isAuthenticatedUser = userRole === 'REAL_BUYER' || userRole === 'REAL_SELLER';

  // Auto-fill contact details for real users
  useEffect(() => {
    if (viewer && order) {
      if (isAuthenticatedUser) {
        setContactDetails({
          firstName: viewer.firstName || '',
          lastName: viewer.lastName || '',
          email: viewer.email || '',
          phoneNumber: viewer.phoneNumber || '',
        });
      }
    }
  }, [viewer, order, isAuthenticatedUser]);

  // Format currency
  const formatCurrency = (amt: number | undefined) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amt || 0);

  // Load wallet data
  useEffect(() => {
    const loadWalletData = async () => {
      if (!order?.amount || !urlOrderId) return;
      setIsLoadingWallet(true);

      try {
        let walletResponse;
        if (isAuthenticatedUser) {
          walletResponse = await createOneTimeUseWallet({
            amount: order.amount,
            orderId: urlOrderId,
            userId,
          });
        } else {
          walletResponse = await createGuestOneTimeUseWallet({
            amount: order.amount,
            orderId: urlOrderId,
            firstName: contactDetails.firstName,
            lastName: contactDetails.lastName,
            email: contactDetails.email,
            phone: contactDetails.phoneNumber,
          });
        }

        if (walletResponse?.data) {
          setWalletData({
            id: walletResponse.data.id || '1',
            walletId: walletResponse.data.walletId || null,
            type: 'ONE_TIME',
            userId: walletResponse.data.userId || (isAuthenticatedUser ? userId : 'guest'),
            balance: walletResponse.data.balance?.toString() || order.amount.toString(),
            currency: walletResponse.data.currency || 'NGN',
            isActive: walletResponse.data.isActive ?? true,
            accountName: walletResponse.data.accountName || 'PayAfta Escrow',
            accountNumber: walletResponse.data.accountNumber || '1234567890',
            bankName: walletResponse.data.bankName || 'First Bank',
            referenceId: walletResponse.data.referenceId || `REF-${Date.now()}`,
            transactionId: walletResponse.data.transactionId || `TXN-${Date.now()}`,
            expiredAt:
              walletResponse.data.expiredAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            createdAt: walletResponse.data.createdAt || new Date().toISOString(),
            updatedAt: walletResponse.data.updatedAt || new Date().toISOString(),
            orderId: urlOrderId,
          });
        } else {
          throw new Error('Invalid wallet response');
        }
      } catch (err) {
        console.error(err);
        onPaymentError?.('Failed to load payment details. Please try again.');
      } finally {
        setIsLoadingWallet(false);
      }
    };

    if (
      order?.amount &&
      urlOrderId &&
      (isAuthenticatedUser ||
        (contactDetails.firstName &&
          contactDetails.lastName &&
          contactDetails.email &&
          contactDetails.phoneNumber))
    ) {
      loadWalletData();
    }
  }, [order?.amount, urlOrderId, isAuthenticatedUser, contactDetails, onPaymentError, userId]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!contactDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!contactDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!contactDetails.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email))
      newErrors.email = 'Invalid email';
    if (!contactDetails.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSecurePayment = async () => {
    if (!validateForm() || !agree) return;
    if (!walletData) return onPaymentError?.('Please wait for payment details to load.');
    setShowBankTransferModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowBankTransferModal(false);
    if (onPaymentSuccess) onPaymentSuccess();
    else router.push('/payment-success');
  };

  const handleModalClose = () => setShowBankTransferModal(false);

  const isFormValid = useMemo(
    () =>
      agree &&
      contactDetails.firstName.trim() &&
      contactDetails.lastName.trim() &&
      contactDetails.email.trim() &&
      contactDetails.phoneNumber.trim() &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.phoneNumber &&
      walletData !== null,
    [agree, contactDetails, errors, walletData]
  );

  const availableBalance = walletData?.balance ? parseFloat(walletData.balance) : 0;
  const needsPayment = order ? order.amount > availableBalance : false;

  if (loading || !order) return <div>Loading...</div>;
  if (error) return <div>Error loading order</div>;

  return (
    <div className="w-full bg-white shadow rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Finalize Order & Pay</h1>
        <p className="text-sm mt-1">
          Order ID:{' '}
          <span className="text-blue-600 underline font-medium cursor-pointer">{order.id}</span>
        </p>
        <div className="flex items-center gap-4 mt-3">
          <p className="text-2xl font-bold">{formatCurrency(order.amount)}</p>
          {walletData && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wallet size={16} />
              <span>Wallet: {formatCurrency(availableBalance)}</span>
            </div>
          )}
          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {isAuthenticatedUser ? 'Registered User' : 'Guest User'}
          </div>
        </div>
        {needsPayment && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Additional payment required: {formatCurrency(order.amount - availableBalance)}
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Contact Section */}
      <div>
        <h2 className="font-semibold text-lg">1. Contact Details</h2>
        <p className="text-sm text-gray-500">
          These details are required for order tracking and refunds
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {['firstName', 'lastName', 'email'].map((field) => (
            <div key={field}>
              <ReSubHeading
                subHeading={
                  field === 'firstName'
                    ? 'First Name'
                    : field === 'lastName'
                      ? 'Last Name'
                      : 'Email Address'
                }
                className="text-sm font-medium text-black"
              />
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={contactDetails[field as keyof ContactDetails]}
                onChange={(e) => handleContactChange(field as keyof ContactDetails, e.target.value)}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                readOnly={isAuthenticatedUser}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors[field as keyof ContactDetails] ? 'border-red-500' : 'border-gray-300'
                } ${isAuthenticatedUser ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors[field as keyof ContactDetails] && (
                <p className="text-sm text-red-600">{errors[field as keyof ContactDetails]}</p>
              )}
            </div>
          ))}

          {/* Phone Number */}
          <div>
            <ReSubHeading subHeading="Phone Number" className="text-sm font-medium text-black" />
            <input
              type="tel"
              value={contactDetails.phoneNumber}
              onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>
        </div>
      </div>

      {/* Escrow Agreement */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg">2. Escrow Agreement</h2>
        <div className="mt-3 bg-gray-100 p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-gray-700 leading-6">
          {/* Agreement text */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
        </div>
        <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="w-5 h-5 border rounded-md cursor-pointer mt-0.5"
          />
          <span className="text-sm text-gray-700">
            I confirm I have read and agree to the{' '}
            <span className="text-[#03045B] font-medium cursor-pointer">Escrow agreement</span> and{' '}
            <span className="text-[#03045B] font-medium cursor-pointer">Terms of service</span>.
          </span>
        </label>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleSecurePayment}
        disabled={!isFormValid || isLoadingWallet}
        className={`w-full mt-8 py-3 rounded-full text-white text-sm sm:text-base font-semibold transition ${
          isFormValid && !isLoadingWallet
            ? 'bg-[#03045B] hover:bg-blue-900 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoadingWallet ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {isAuthenticatedUser ? 'Creating secure wallet...' : 'Setting up guest payment...'}
          </span>
        ) : (
          `Secure Payment (${formatCurrency(order.amount)})`
        )}
      </button>

      {walletData && (
        <BankTransferModal
          isOpen={showBankTransferModal}
          onClose={handleModalClose}
          amount={order.amount}
          onSuccess={handlePaymentSuccess}
          oneTimeUseWallet={walletData}
        />
      )}
    </div>
  );
}
