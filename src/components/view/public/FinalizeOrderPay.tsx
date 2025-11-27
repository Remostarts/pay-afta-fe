'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Wallet, CreditCard } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSubHeading from '@/components/re-ui/ReSubHeading';
import BankTransferModal from '@/components/view/public/BankTransferModal';
import { TWalletData } from '@/types/order';

interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface FinalizeOrderPayProps {
  orderId?: string;
  invoiceData?: {
    id: string;
    issueDate: string;
    dueDate: string;
    seller?: {
      name: string;
      email: string;
    };
    buyer?: {
      name: string;
      email: string;
    };
    items: Array<{
      id: string;
      description: string;
      quantity: number;
      price: number;
    }>;
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      deliveryDate: string;
      amount: number;
    }>;
    totals?: {
      subtotal: number;
      tax: number;
      shipping: number;
      total: number;
    };
  };
  onAccept?: () => void;
  onReject?: () => void;
  onPaymentError?: (error: string) => void;
  onPaymentSuccess?: () => void;
}

export default function FinalizeOrderPay({
  orderId = 'EBD-9087-CBA',
  invoiceData: propInvoiceData,
  onAccept,
  onReject,
  onPaymentError,
  onPaymentSuccess,
}: FinalizeOrderPayProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get and decode invoiceData from query param
  const urlInvoiceData = searchParams?.get('invoiceData');
  const invoiceData = useMemo(() => {
    // Use prop invoiceData first, fallback to URL decoded data
    if (propInvoiceData) {
      return propInvoiceData;
    }

    if (urlInvoiceData) {
      try {
        return JSON.parse(decodeURIComponent(urlInvoiceData));
      } catch (err) {
        console.error('Failed to parse invoiceData from URL:', err);
        return null;
      }
    }
    return null;
  }, [propInvoiceData, urlInvoiceData]);

  // Get orderId from URL params or use default from invoiceData
  const urlOrderId = searchParams?.get('orderId');
  const finalOrderId = urlOrderId || orderId || invoiceData?.id || 'EBD-9087-CBA';

  // Extract amount from invoiceData totals
  const amount = invoiceData?.totals?.total || 0;

  // Form state
  const [agree, setAgree] = useState(false);
  const [contactDetails, setContactDetails] = useState<ContactDetails>(() => {
    // Pre-populate from buyer data if available
    if (invoiceData?.buyer) {
      const [firstName, ...lastNameParts] = invoiceData.buyer.name.split(' ');
      return {
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: invoiceData.buyer.email || '',
        phoneNumber: '',
      };
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    };
  });

  // Modal state
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [walletData, setWalletData] = useState<TWalletData | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock wallet data - in real app, this would come from API
  const mockWalletData: TWalletData = {
    id: '1',
    walletId: null,
    type: 'ONE_TIME',
    userId: 'user1',
    balance: amount.toString(),
    currency: 'NGN',
    isActive: true,
    accountName: 'PayAfta Escrow',
    accountNumber: '1234567890',
    bankName: 'First Bank',
    referenceId: `REF-${Date.now()}`,
    transactionId: `TXN-${Date.now()}`,
    expiredAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    orderId: finalOrderId,
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Load wallet data (mock implementation)
  useEffect(() => {
    const loadWalletData = async () => {
      setIsLoadingWallet(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWalletData(mockWalletData);
      } catch (error) {
        console.error('Failed to load wallet data:', error);
        onPaymentError?.('Failed to load payment details');
      } finally {
        setIsLoadingWallet(false);
      }
    };

    loadWalletData();
  }, [finalOrderId, onPaymentError]);

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
      !errors.phoneNumber
    );
  }, [agree, contactDetails, errors]);

  // Available wallet balance (mock calculation)
  const availableBalance = walletData?.balance ? parseFloat(walletData.balance) : 0;
  const needsPayment = amount > availableBalance;

  return (
    <div className="w-full bg-white shadow rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Finalize Order & Pay</h1>

        <div className="text-sm mt-1 space-y-1">
          <p>
            Order ID:{' '}
            <span className="text-blue-600 underline font-medium cursor-pointer">
              {finalOrderId}
            </span>
          </p>
          {invoiceData?.id && invoiceData.id !== finalOrderId && (
            <p>
              Invoice ID: <span className="text-gray-600 font-medium">{invoiceData.id}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3">
          <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          {walletData && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wallet size={16} />
              <span>Wallet: {formatCurrency(availableBalance)}</span>
            </div>
          )}
        </div>

        {needsPayment && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              Additional payment required: {formatCurrency(amount - availableBalance)}
            </p>
          </div>
        )}

        {!invoiceData && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Invoice data not available. Using default values.
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Invoice Details Section */}
      {invoiceData && (
        <div className="mb-6">
          <h2 className="font-semibold text-lg">Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <ReSubHeading subHeading="Issue Date" className="text-xs font-medium text-gray-500" />
              <p className="text-gray-900">{invoiceData.issueDate}</p>
            </div>
            <div>
              <ReSubHeading subHeading="Due Date" className="text-xs font-medium text-gray-500" />
              <p className="text-gray-900">{invoiceData.dueDate}</p>
            </div>
            {invoiceData.seller && (
              <div>
                <ReSubHeading subHeading="Seller" className="text-xs font-medium text-gray-500" />
                <p className="text-gray-900">{invoiceData.seller.name}</p>
                <p className="text-gray-500 text-xs">{invoiceData.seller.email}</p>
              </div>
            )}
            {invoiceData.buyer && (
              <div>
                <ReSubHeading subHeading="Buyer" className="text-xs font-medium text-gray-500" />
                <p className="text-gray-900">{invoiceData.buyer.name}</p>
                <p className="text-gray-500 text-xs">{invoiceData.buyer.email}</p>
              </div>
            )}
          </div>

          {/* Items Summary */}
          {invoiceData.items && invoiceData.items.length > 0 && (
            <div className="mt-4">
              <ReSubHeading subHeading="Items" className="text-xs font-medium text-gray-500 mb-2" />
              <div className="space-y-2">
                {invoiceData.items
                  .slice(0, 3)
                  .map(
                    (item: {
                      id: string;
                      description: string;
                      quantity: number;
                      price: number;
                    }) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                      >
                        <span className="text-gray-900">{item.description}</span>
                        <span className="text-gray-600">{item.quantity}x</span>
                      </div>
                    )
                  )}
                {invoiceData.items.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{invoiceData.items.length - 3} more items
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Totals Breakdown */}
          {invoiceData.totals && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-2">Payment Summary</h3>
              <div className="space-y-1 text-sm">
                {invoiceData.totals.subtotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">
                      {formatCurrency(invoiceData.totals.subtotal)}
                    </span>
                  </div>
                )}
                {invoiceData.totals.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">{formatCurrency(invoiceData.totals.tax)}</span>
                  </div>
                )}
                {invoiceData.totals.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">
                      {formatCurrency(invoiceData.totals.shipping)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">{formatCurrency(invoiceData.totals.total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <Separator />

      {/* Contact Section */}
      <div>
        <h2 className="font-semibold text-lg">1. Contact Details</h2>
        <p className="text-sm text-gray-500">
          These details are required for order tracking and refunds
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
            Loading...
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
