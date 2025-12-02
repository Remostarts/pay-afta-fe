'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Wallet, CreditCard } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSubHeading from '@/components/re-ui/ReSubHeading';
import BankTransferModal from '@/components/view/public/BankTransferModal';
import { TWalletData } from '@/types/order';
import { useGeneral } from '@/context/generalProvider';
import {
  createOneTimeUseWallet,
  createGuestOneTimeUseWallet,
} from '@/lib/actions/order/order.actions';

interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FinalizeOrderPayProps {
  orderId?: string;
  amount?: number;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

export default function FinalizeOrderPay({
  orderId = 'EBD-9087-CBA',
  amount = 300000,
  onPaymentSuccess,
  onPaymentError,
}: FinalizeOrderPayProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useGeneral();

  // Get orderId from URL params or use default
  const urlOrderId = searchParams?.get('orderId');
  const finalOrderId = urlOrderId || orderId;

  // Form state
  const [agree, setAgree] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  // Modal state
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [walletData, setWalletData] = useState<TWalletData | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Check if user is authenticated (registered) or guest
  // If user exists with ID, they are a registered user
  // If user is null, they are a guest user
  const isAuthenticatedUser = user && user.id;

  // Load wallet data based on user type
  useEffect(() => {
    const loadWalletData = async () => {
      setIsLoadingWallet(true);
      try {
        let walletResponse;

        if (isAuthenticatedUser) {
          // For registered users, create one-time use wallet
          walletResponse = await createOneTimeUseWallet({
            amount,
            orderId: finalOrderId,
            userId: user.id,
          });
        } else {
          // For guest users, create guest one-time use wallet
          walletResponse = await createGuestOneTimeUseWallet({
            amount,
            orderId: finalOrderId,
            firstName: contactDetails.firstName,
            lastName: contactDetails.lastName,
            email: contactDetails.email,
            phone: contactDetails.phoneNumber,
          });
        }

        if (walletResponse?.data) {
          // Transform API response to match TWalletData interface
          const transformedWallet: TWalletData = {
            id: walletResponse.data.id || '1',
            walletId: walletResponse.data.walletId || null,
            type: 'ONE_TIME',
            userId: walletResponse.data.userId || (isAuthenticatedUser ? user.id : 'guest'),
            balance: walletResponse.data.balance?.toString() || amount.toString(),
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
            orderId: finalOrderId,
          };
          setWalletData(transformedWallet);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Failed to load wallet data:', error);
        onPaymentError?.('Failed to load payment details. Please try again.');
      } finally {
        setIsLoadingWallet(false);
      }
    };

    // Only load wallet data if we have the minimum required information
    if (
      finalOrderId &&
      amount &&
      (isAuthenticatedUser ||
        (contactDetails.firstName &&
          contactDetails.lastName &&
          contactDetails.email &&
          contactDetails.phoneNumber))
    ) {
      loadWalletData();
    }
  }, [finalOrderId, amount, isAuthenticatedUser, contactDetails, onPaymentError]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contactDetails.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!contactDetails.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!contactDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!contactDetails.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle contact detail changes
  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSecurePayment = async () => {
    if (!validateForm() || !agree) {
      return;
    }

    // Check if wallet data is available
    if (!walletData) {
      onPaymentError?.('Please wait for payment details to load.');
      return;
    }

    try {
      // Open bank transfer modal
      setShowBankTransferModal(true);
    } catch (error) {
      console.error('Payment initiation failed:', error);
      onPaymentError?.('Failed to initiate payment. Please try again.');
    }
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    setShowBankTransferModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    } else {
      router.push('/payment-success');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowBankTransferModal(false);
  };

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      agree &&
      contactDetails.firstName.trim() &&
      contactDetails.lastName.trim() &&
      contactDetails.email.trim() &&
      contactDetails.phoneNumber.trim() &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.email &&
      !errors.phoneNumber &&
      walletData !== null // Ensure wallet data is loaded
    );
  }, [agree, contactDetails, errors, walletData]);

  // Available wallet balance (mock calculation)
  const availableBalance = walletData?.balance ? parseFloat(walletData.balance) : 0;
  const needsPayment = amount > availableBalance;

  return (
    <div className="w-full bg-white shadow rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Finalize Order & Pay</h1>

        <p className="text-sm mt-1">
          Order ID:{' '}
          <span className="text-blue-600 underline font-medium cursor-pointer">{finalOrderId}</span>
        </p>

        <div className="flex items-center gap-4 mt-3">
          <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          {walletData && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wallet size={16} />
              <span>Wallet: {formatCurrency(availableBalance)}</span>
            </div>
          )}
          {/* User type indicator */}
          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {isAuthenticatedUser ? 'Registered User' : 'Guest User'}
          </div>
        </div>

        {needsPayment && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Additional payment required: {formatCurrency(amount - availableBalance)}
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
          {!isAuthenticatedUser && (
            <span className="block mt-1 text-xs text-blue-600">
              <strong>Guest checkout:</strong> We'll create a temporary account for this transaction
            </span>
          )}
          {isAuthenticatedUser && (
            <span className="block mt-1 text-xs text-green-600">
              <strong>Registered user:</strong> Using your existing account for this transaction
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <ReSubHeading subHeading="First Name" className="text-sm font-medium text-black" />
            <div className="space-y-1">
              <input
                type="text"
                value={contactDetails.firstName}
                onChange={(e) => handleContactChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
            </div>
          </div>

          <div>
            <ReSubHeading subHeading="Last Name" className="text-sm font-medium text-black" />
            <div className="space-y-1">
              <input
                type="text"
                value={contactDetails.lastName}
                onChange={(e) => handleContactChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <ReSubHeading subHeading="Email Address" className="text-sm font-medium text-black" />
            <div className="space-y-1">
              <input
                type="email"
                value={contactDetails.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <ReSubHeading subHeading="Phone Number" className="text-sm font-medium text-black" />
            <div className="space-y-1">
              <input
                type="tel"
                value={contactDetails.phoneNumber}
                onChange={(e) => handleContactChange('phoneNumber', e.target.value)}
                placeholder="Enter your phone number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Agreement */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg">2. Escrow Agreement</h2>

        <div className="mt-3 bg-gray-100 p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-gray-700 leading-6">
          Integer neque in sapien varius non iaculis sed bibendum tortor. Malesuada risus posuere
          fermentum fermentum tempus eget. Quis nec gravida enim enim gravida nunc eu ut. Libero
          risus enim duis amet at. Sit egestas iaculis volutpat lobortis massa. Potenti etiam
          sodales nunc et diam. Massa blandit molestie donec fringilla ultrices orci purus. Viverra
          mi dignissim leo nunc nisl. Egestas pharetra arcu dignissim bibendum at cursus id nec.
          Viverra congue maecenas orci ut et integer. Nec vitae placerat egestas luctus volutpat
          sollicitudin malesuada diam.
          <br />
          <br />
          In praesent faucibus gravida sagittis egestas nunc. Mi a duis risus mi. Egestas platea eu
          facilisi scelerisque. Malesuada enim in habitasse vulputate tortor mi in. Metus molestie
          pharetra a pharetra feugiat lectus facilisi cras. Volutpat donec hendrerit lacus sed felis
          ut mattis porta egestas.
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="w-5 h-5 border rounded-md cursor-pointer mt-0.5"
          />
          <span className="text-sm text-gray-700">
            I confirm I have read and "agree" to the{' '}
            <span className="text-[#03045B] font-medium cursor-pointer">Escrow agreement</span> and{' '}
            <span className="text-[#03045B] font-medium cursor-pointer">Terms of service</span>.
          </span>
        </label>
      </div>

      {/* Payment Methods */}
      {/* <div className="mt-8">
        <h2 className="font-semibold text-lg">3. Payment Method</h2>

        <div className="mt-4 space-y-3">
          Bank Transfer Option
          <div className="border rounded-lg p-4 flex items-center gap-3">
            <CreditCard size={20} className="text-blue-600" />
            <div>
              <p className="font-medium">Bank Transfer</p>
              <p className="text-sm text-gray-500">Pay directly to our bank account</p>
            </div>
          </div>
        </div>
      </div> */}

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
          `Secure Payment (${formatCurrency(amount)})`
        )}
      </button>

      {/* Bank Transfer Modal */}
      {walletData && (
        <BankTransferModal
          isOpen={showBankTransferModal}
          onClose={handleModalClose}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          oneTimeUseWallet={walletData}
        />
      )}
    </div>
  );
}
