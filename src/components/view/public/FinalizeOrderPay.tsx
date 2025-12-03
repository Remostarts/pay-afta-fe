'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import ReSubHeading from '@/components/re-ui/ReSubHeading';
import BankTransferModal from '@/components/view/public/BankTransferModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TWalletData } from '@/types/order';
import {
  createOneTimeUseWallet,
  createGuestOneTimeUseWallet,
} from '@/lib/actions/order/order.actions';
import { toast } from 'sonner';
import { useOrder } from '@/hooks/useOrder';
import Link from 'next/link';

interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function FinalizeOrderPay() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlOrderId = searchParams?.get('orderId');
  const { order, loading, error, userRole, userId, viewer } = useOrder(urlOrderId as string);

  const [agree, setAgree] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [walletData, setWalletData] = useState<TWalletData | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isAuthenticatedUser = userRole === 'REAL_BUYER';

  // Auto-fill contact details for real users
  useEffect(() => {
    if (viewer && order) {
      if (isAuthenticatedUser) {
        setContactDetails({
          firstName: viewer.firstName || '',
          lastName: viewer.lastName || '',
          email: viewer.email || '',
          phone: viewer.phone || '',
        });
      } else {
        setContactDetails({
          firstName: viewer.firstName || '',
          lastName: viewer.lastName || '',
          email: viewer.email || '',
          phone: viewer.phone || '',
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

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Calculate Payable Amount for Viewer
  const payableAmount = useMemo(() => {
    if (!order) return 0;

    const base = Number(order.amount) || 0;
    const escrow = Number(order.escrowFee) || 0;

    const payer = order.transactionFee; // "Buyer" | "Seller" | "Both"

    const isBuyer = userRole === 'REAL_BUYER' || userRole === 'GUEST_BUYER';

    let extraFee = 0;

    if (payer === 'Buyer') {
      if (isBuyer) extraFee = escrow;
    } else if (payer === 'Seller') {
      // buyer pays nothing extra
      extraFee = 0;
    } else if (payer === 'Both') {
      if (isBuyer) extraFee = escrow / 2;
    }

    return base + extraFee;
  }, [order, userRole]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactDetails.firstName.trim()) newErrors.firstName = 'First name is required';

    if (!contactDetails.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!contactDetails.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email))
      newErrors.email = 'Invalid email format';

    if (!contactDetails.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMakePayment = async () => {
    const valid = validateForm();
    if (!valid || !agree) {
      toast.error('Please fill all required fields and accept the agreement.');
      return;
    }
    if (!order?.amount || !urlOrderId) {
      toast.error('Order information is missing');
      return;
    }

    setIsLoadingWallet(true);

    try {
      let walletResponse;
      if (isAuthenticatedUser) {
        walletResponse = await createOneTimeUseWallet({
          amount: payableAmount,
          orderId: urlOrderId,
          userId,
        });
      } else {
        walletResponse = await createGuestOneTimeUseWallet({
          amount: payableAmount,
          orderId: urlOrderId,
          firstName: contactDetails.firstName,
          lastName: contactDetails.lastName,
          email: contactDetails.email,
          phone: contactDetails.phone,
        });
      }

      if (walletResponse?.data) {
        const wallet: TWalletData = {
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
        };

        setWalletData(wallet);
        setShowBankTransferModal(true);
      } else {
        throw new Error('Invalid wallet response');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = 'Failed to load payment details. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowBankTransferModal(false);
    toast.success('Payment completed successfully!');
    router.push('/payment-success');
  };

  const handleModalClose = () => setShowBankTransferModal(false);

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Error loading order details</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white rounded-xl p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Complete Payment</h1>
          <p className="text-sm mt-1 text-gray-600">
            Order ID:{' '}
            <span className="text-blue-600 underline font-medium cursor-pointer">{order.id}</span>
          </p>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-2xl font-bold">{formatCurrency(payableAmount)}</p>
            <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {isAuthenticatedUser ? 'Registered User' : 'Guest User'}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Contact Section */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Contact Details</h2>
          <p className="text-sm text-gray-500 mb-4">
            {isAuthenticatedUser
              ? 'Your registered contact information'
              : 'These details are required for order tracking and refunds'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="text-sm font-medium text-black mb-1"
                />
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={contactDetails[field as keyof ContactDetails]}
                  onChange={(e) =>
                    handleContactChange(field as keyof ContactDetails, e.target.value)
                  }
                  placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  readOnly={isAuthenticatedUser || (field === 'email' && !isAuthenticatedUser)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors[field as keyof ContactDetails] ? 'border-red-500' : 'border-gray-300'
                  } ${
                    isAuthenticatedUser || (field === 'email' && !isAuthenticatedUser)
                      ? 'bg-gray-100 cursor-not-allowed'
                      : ''
                  }`}
                />

                {errors[field as keyof ContactDetails] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[field as keyof ContactDetails]}
                  </p>
                )}
              </div>
            ))}

            {/* Phone Number */}
            <div>
              <ReSubHeading
                subHeading="Phone Number"
                className="text-sm font-medium text-black mb-1"
              />
              <input
                type="tel"
                value={contactDetails.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                readOnly={isAuthenticatedUser}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } ${isAuthenticatedUser ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Escrow Agreement */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2">Escrow Agreement</h2>
          <div className="mt-3 bg-gray-100 p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-gray-700 leading-6">
            <p>
              By proceeding with this payment, you acknowledge that the funds will be held in escrow
              until the transaction is completed successfully. The funds will be released to the
              seller only after you confirm receipt and satisfaction with the goods/services.
            </p>
            <p className="mt-2">
              You have the right to dispute the transaction if the goods/services do not match the
              agreed-upon terms. PayAfta will mediate any disputes fairly and in accordance with our
              terms of service.
            </p>
          </div>
          <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="w-5 h-5 border rounded-md cursor-pointer mt-0.5"
            />
            <span className="ml-2 text-sm">
              You agree to the{' '}
              <Link href="terms-and-condition" className="text-blue-700">
                terms and conditions
              </Link>{' '}
              and acknowledge the{' '}
              <Link href="privacy-policy" className="text-blue-700">
                privacy policy
              </Link>{' '}
              and{' '}
              <Link href="refund-policy" className="text-blue-700">
                refund policy
              </Link>
            </span>
          </label>
        </div>

        {/* CTA Button */}
        {/* <button
          onClick={handleMakePayment}
          disabled={!agree || isLoadingWallet}
          className={`w-full py-3 rounded-full text-white text-sm sm:text-base font-semibold transition ${
            !isLoadingWallet
              ? 'bg-[#03045B] hover:bg-blue-900 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoadingWallet ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Preparing payment...</span>
            </span>
          ) : (
            `Make Payment (${formatCurrency(order.amount)})`
          )}
        </button> */}
        <button
          onClick={handleMakePayment}
          disabled={!agree || isLoadingWallet}
          className={`
    w-full py-3 rounded-full text-white text-sm sm:text-base font-semibold transition
    ${
      !agree || isLoadingWallet
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-[#03045B] hover:bg-blue-900 cursor-pointer'
    }
  `}
        >
          {isLoadingWallet ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Preparing payment...</span>
            </span>
          ) : (
            `Make Payment (${formatCurrency(payableAmount)})`
          )}
        </button>
      </div>

      {/* Bank Transfer Modal */}
      <Dialog open={showBankTransferModal} onOpenChange={setShowBankTransferModal}>
        <DialogContent className="max-w-md">
          {walletData && (
            <BankTransferModal
              isOpen={showBankTransferModal}
              onClose={handleModalClose}
              amount={order.amount}
              onSuccess={handlePaymentSuccess}
              oneTimeUseWallet={walletData}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
