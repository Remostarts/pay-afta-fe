'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, CirclePlus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Link from 'next/link';

import { Form } from '@/components/ui/form';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import {
  createOrderZodSchema,
  newOrderSchema,
  TCreateOrderInput,
  TNewOrder,
} from '@/lib/validations/newOrder.validation';
import { createOrder } from '@/lib/actions/order/order.actions';
import { useGeneral } from '@/context/generalProvider';
import { SearchableCounterpartySelect } from '@/components/re-ui/SearchableCounterpartySelect';
import OrderDetails from './OrderDetails';
import EscrowSuccess from './EscrowSuccess';

interface NewOrderProps {
  onBack?: () => void;
}

interface OrderSuccessData {
  orderId: string;
  transactionType: string;
  amount: string;
  trackUrl: string;
  buyerName?: string;
}

const ESCROW_FEE_RATE = 0.025; // 2.5%

export default function NewOrder({ onBack }: NewOrderProps) {
  const { user } = useGeneral();

  // Form state
  const [initiatorRole, setInitiatorRole] = useState<'Buyer' | 'Seller' | undefined>(undefined);
  const [paymentType, setPaymentType] = useState<string>('');

  // UI state
  const [showItem2, setShowItem2] = useState(false);
  const [showMilestone2, setShowMilestone2] = useState(false);
  const [showMilestone3, setShowMilestone3] = useState(false);

  // Modal state
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showEscrowSuccess, setShowEscrowSuccess] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<TCreateOrderInput | null>(null);
  const [orderSuccessData, setOrderSuccessData] = useState<OrderSuccessData | null>(null);

  // Loading state
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Counter Party Email - track invited email
  const [invitedEmail, setInvitedEmail] = useState<string>('');

  // console.log(initiatorRole);

  const form = useForm<TNewOrder>({
    resolver: zodResolver(newOrderSchema()),
    defaultValues: {
      role: '',
      counterpartyEmailOrPhoneNo: '',
      invoiceDate: new Date(),
      transactionType: undefined,
      item1Name: '',
      item1Quantity: '',
      item1Prize: '',
      item2Name: '',
      item2Quantity: '',
      item2Prize: '',
      detailAboutItem: '',
      paymentType: undefined,
      deliveryDate: new Date(),
      milestone1: '',
      milestone1DeliveryDate: new Date(),
      milestone1Amount: '',
      milestone2: '',
      milestone2DeliveryDate: new Date(),
      milestone2Amount: '',
      milestone3: '',
      milestone3DeliveryDate: new Date(),
      milestone3Amount: '',
      transactionFee: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset, setValue, watch, formState } = form;
  const { isSubmitting } = formState;

  // Watch role changes
  const currentRole = watch('role');

  // Update initiatorRole when role changes in form
  useEffect(() => {
    if (currentRole) {
      setInitiatorRole(currentRole as 'Buyer' | 'Seller');
    }
  }, [currentRole]);

  // Handle role change
  const handleRoleChange = (value: string) => {
    const newRole = value as 'Buyer' | 'Seller';

    // Update form values based on new role
    setValue('role', newRole);
    setInitiatorRole(newRole);
  };

  // Handle counterparty selection
  const handleCounterpartyChange = (email: string) => {
    // console.log(email);
    setValue('counterpartyEmailOrPhoneNo', email);
  };

  // Handle invited counterparty email
  const handleInvitedEmail = (email: string) => {
    setInvitedEmail(email);
    setValue('counterpartyEmailOrPhoneNo', email);
  };

  // Handle payment type change
  const handlePaymentTypeChange = (value: 'One time Payment' | 'Milestone Payment') => {
    setPaymentType(value);
    setValue('paymentType', value);

    // Reset milestone visibility when changing payment type
    if (value !== 'Milestone Payment') {
      setShowMilestone2(false);
      setShowMilestone3(false);
    }
  };

  // Item management
  const toggleItem2 = () => {
    if (showItem2) {
      // Clear item 2 fields when hiding
      setValue('item2Name', '');
      setValue('item2Quantity', '');
      setValue('item2Prize', '');
    }
    setShowItem2(!showItem2);
  };

  // Milestone management
  const toggleMilestone2 = () => {
    if (showMilestone2) {
      setValue('milestone2', '');
      setValue('milestone2DeliveryDate', new Date());
      setValue('milestone2Amount', '');
    }
    setShowMilestone2(!showMilestone2);
  };

  const toggleMilestone3 = () => {
    if (showMilestone3) {
      setValue('milestone3', '');
      setValue('milestone3DeliveryDate', new Date());
      setValue('milestone3Amount', '');
    }
    setShowMilestone3(!showMilestone3);
  };

  // Process form data
  const processOrderData = (data: TNewOrder): TCreateOrderInput => {
    console.log('Processing order data:', data);

    // Process items
    const items = [
      data.item1Name &&
        data.item1Name.trim() !== '' && {
          name: data.item1Name,
          price: data.item1Prize || '0',
          quantity: data.item1Quantity || '1',
        },
      data.item2Name &&
        data.item2Name.trim() !== '' && {
          name: data.item2Name,
          price: data.item2Prize || '0',
          quantity: data.item2Quantity || '1',
        },
    ].filter(Boolean) as Array<{ name: string; price: string; quantity: string }>;

    // Calculate total for default milestones
    const itemsTotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

    // Process milestones
    let milestones: Array<{ title: string; amount: string; deliveryDate: Date }> = [];

    if (data.paymentType === 'Milestone Payment') {
      const potentialMilestones = [
        data.milestone1 &&
          data.milestone1.trim() !== '' && {
            title: data.milestone1,
            amount: data.milestone1Amount || '0',
            deliveryDate: data.milestone1DeliveryDate || new Date(),
          },
        data.milestone2 &&
          data.milestone2.trim() !== '' && {
            title: data.milestone2,
            amount: data.milestone2Amount || '0',
            deliveryDate: data.milestone2DeliveryDate || new Date(),
          },
        data.milestone3 &&
          data.milestone3.trim() !== '' && {
            title: data.milestone3,
            amount: data.milestone3Amount || '0',
            deliveryDate: data.milestone3DeliveryDate || new Date(),
          },
      ].filter(Boolean) as Array<{ title: string; amount: string; deliveryDate: Date }>;

      milestones =
        potentialMilestones.length > 0
          ? potentialMilestones
          : [
              {
                title: 'Default Milestone',
                amount: itemsTotal.toString(),
                deliveryDate: data.deliveryDate || new Date(),
              },
            ];
    } else {
      // One-time payment
      milestones = [
        {
          title: 'Full Payment',
          amount: itemsTotal.toString(),
          deliveryDate: data.deliveryDate || new Date(),
        },
      ];
    }

    const processedData: TCreateOrderInput = {
      initiatorRole: data.role,
      counterpartyEmailOrPhoneNo: data.counterpartyEmailOrPhoneNo,
      invoiceDate: data.invoiceDate || new Date(),
      deliveryDate: data.deliveryDate || new Date(),
      detailAboutItem: data.detailAboutItem,
      paymentType: data.paymentType,
      transactionFee: data.transactionFee,
      transactionType: data.transactionType,
      items,
      milestones,
    };

    // console.log('Processed order data:', processedData);
    return processedData;
  };

  // Handle form submission
  const onSubmit = async (data: TNewOrder) => {
    try {
      const processedData = processOrderData(data);
      setPendingOrderData(processedData);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error processing form data:', error);
      toast.error('Failed to process order data. Please check your inputs.');
    }
  };

  // Handle order confirmation
  const handleOrderConfirmation = async () => {
    if (!pendingOrderData) {
      console.error('No pending order data');
      return;
    }

    // console.log(pendingOrderData);

    setIsCreatingOrder(true);

    try {
      console.log('Creating order with data:', pendingOrderData);
      const response = await createOrder(pendingOrderData);

      console.log(response);

      if (response?.success) {
        toast.success('Order created successfully');

        // Calculate amounts
        const totalAmount = pendingOrderData.items.reduce(
          (total, item) => total + Number(item.price || 0),
          0
        );
        const escrowFee = totalAmount * ESCROW_FEE_RATE;
        const finalAmount = totalAmount + escrowFee;

        // Set success data
        setOrderSuccessData({
          orderId: response.data?.orderId || response.data?.id || `ORD-${Date.now()}`,
          transactionType: response.data?.transactionType,
          amount: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
          }).format(finalAmount),
          trackUrl: response.data?.trackUrl,
        });

        // Close order details and show success
        setShowOrderDetails(false);
        setShowEscrowSuccess(true);

        // Reset form state
        resetFormState();
      } else {
        toast.error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Reset form state
  const resetFormState = () => {
    reset({
      role: '',
      transactionType: undefined,
      counterpartyEmailOrPhoneNo: '',
      invoiceDate: new Date(),
      item1Name: '',
      item1Quantity: '',
      item1Prize: '',
      item2Name: '',
      item2Quantity: '',
      item2Prize: '',
      detailAboutItem: '',
      paymentType: undefined,
      deliveryDate: new Date(),
      milestone1: '',
      milestone1DeliveryDate: new Date(),
      milestone1Amount: '',
      milestone2: '',
      milestone2DeliveryDate: new Date(),
      milestone2Amount: '',
      milestone3: '',
      milestone3DeliveryDate: new Date(),
      milestone3Amount: '',
      transactionFee: '',
    });

    setInitiatorRole(undefined);
    setPaymentType('');
    setShowItem2(false);
    setShowMilestone2(false);
    setShowMilestone3(false);
    setPendingOrderData(null);
    setInvitedEmail(''); // Clear invited email
  };

  // Handle modal closes
  const handleCloseOrderDetails = () => {
    setShowOrderDetails(false);
    setPendingOrderData(null);
  };

  const handleCloseEscrowSuccess = () => {
    setShowEscrowSuccess(false);
    setOrderSuccessData(null);
  };

  console.log(orderSuccessData);

  // Render success screen
  if (showEscrowSuccess && orderSuccessData) {
    return (
      <div className="min-h-full rounded-xl bg-white">
        <EscrowSuccess
          orderId={orderSuccessData.orderId}
          amount={orderSuccessData.amount}
          trackUrl={orderSuccessData.trackUrl}
          buyerName={orderSuccessData.buyerName}
          transactionType={orderSuccessData.transactionType}
          onViewOrder={() => {
            // Handle view order
            console.log('View order:', orderSuccessData.orderId);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full rounded-xl bg-white">
        <div className="p-5">
          {/* Header */}
          <Link
            href="/dashboard"
            className="mb-6 flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900 w-fit"
          >
            <ChevronLeft className="size-5" />
            <span className="text-lg">Create Escrow Order</span>
          </Link>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role and Transaction Type */}
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <div className="w-full">
                  <ReHeading heading="Role" size="base" className="text-gray-700 mb-2" />
                  <ReSelect
                    name="role"
                    options={[
                      { label: 'Buyer', value: 'Buyer' },
                      { label: 'Seller', value: 'Seller' },
                    ]}
                    placeholder="Select"
                    onChange={handleRoleChange}
                  />
                </div>

                <div className="w-full">
                  <ReHeading
                    heading="Transaction Type"
                    size="base"
                    className="text-gray-700 mb-2"
                  />
                  <ReSelect
                    name="transactionType"
                    options={[
                      { label: 'Product', value: 'Product' },
                      { label: 'Services', value: 'Services' },
                    ]}
                    placeholder="Select"
                  />
                </div>
              </div>

              {/* Counterparty Search */}
              <div>
                <ReHeading
                  heading="Counterparty Search"
                  size="base"
                  className="text-gray-700 mb-2"
                />
                <SearchableCounterpartySelect
                  onChange={handleCounterpartyChange}
                  inviteCounterpartyEmail={invitedEmail}
                  onInviteSuccess={handleInvitedEmail}
                />
              </div>

              {/* Item 1 */}
              <div>
                <ReHeading heading="Item 1" size="base" className="text-gray-700 mb-2" />
                <ReInput name="item1Name" placeholder="Enter Name" />
                <div className="grid lg:grid-cols-2 lg:gap-5">
                  <ReInput name="item1Quantity" placeholder="Enter Quantity" />
                  <ReInput name="item1Prize" placeholder="₦ 00.00" />
                </div>

                {!showItem2 && (
                  <div className="flex justify-end w-full mt-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={toggleItem2}
                    >
                      <CirclePlus size={20} />
                      <span className="font-inter">Add more</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Item 2 */}
              {showItem2 && (
                <div>
                  <ReHeading heading="Item 2" size="base" className="text-gray-700 mb-2" />
                  <ReInput name="item2Name" placeholder="Enter Name" />
                  <div className="grid lg:grid-cols-2 lg:gap-5">
                    <ReInput name="item2Quantity" placeholder="Enter Quantity" />
                    <ReInput name="item2Prize" placeholder="₦ 00.00" />
                  </div>
                  <div className="flex justify-start w-full mt-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                      onClick={toggleItem2}
                    >
                      <Trash2 size={20} />
                      <span className="font-inter">Delete</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Item Details */}
              <div>
                <ReHeading
                  heading="Give me more details about the expected Item"
                  size="base"
                  className="text-gray-700 mb-2"
                />
                <ReTextarea
                  name="detailAboutItem"
                  className="font-inter"
                  placeholder="Provide detailed description..."
                />
              </div>

              {/* Payment Type */}
              <div>
                <ReHeading heading="Payment Type" size="base" className="text-gray-700 mb-2" />
                <ReRadioGroup
                  name="paymentType"
                  options={[
                    {
                      label: 'One time Payment',
                      value: 'One time Payment',
                      radioDescription:
                        'Pay the agreed amount to the seller at once immediately after reaching an agreement.',
                    },
                    {
                      label: 'Milestone Payment',
                      value: 'Milestone Payment',
                      radioDescription: 'Pay gradually to the seller after reaching an agreement.',
                    },
                  ]}
                  className="flex flex-col lg:grid lg:grid-cols-2 gap-4"
                  onChange={(value: string) =>
                    handlePaymentTypeChange(value as 'One time Payment' | 'Milestone Payment')
                  }
                />
              </div>

              {/* Payment Type Specific Fields */}
              {/* {paymentType === 'One time Payment' && (
                <div>
                  <ReHeading
                    heading="Select Delivery Date"
                    size="base"
                    className="text-gray-700 mb-2"
                  />
                  <ReDatePicker name="deliveryDate" className="lg:w-2/5" disablePast />
                </div>
              )} */}

              {initiatorRole === 'Seller' ? (
                <div>
                  <ReHeading
                    heading="Select Delivery Date"
                    size="base"
                    className="text-gray-700 mb-2"
                  />
                  <ReDatePicker name="deliveryDate" className="lg:w-2/5" disablePast />
                </div>
              ) : // <div>
              //   <ReHeading
              //     heading="Select Delivery Date"
              //     size="base"
              //     className="text-gray-700 mb-2"
              //   />
              //   <ReDatePicker name="deliveryDate" className="lg:w-2/5" disablePast />
              // </div>
              null}

              {paymentType === 'Milestone Payment' && (
                <div className="space-y-6">
                  {/* Milestone 1 */}
                  <div>
                    <ReHeading heading="Milestone 1" size="base" className="text-gray-700 mb-2" />
                    <ReInput
                      name="milestone1"
                      placeholder="Describe deliverable"
                      className="w-full"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <ReDatePicker
                        name="milestone1DeliveryDate"
                        placeholder="Select delivery date"
                        disablePast
                      />
                      <ReInput
                        name="milestone1Amount"
                        placeholder="₦ 00.00"
                        type="number"
                        inputMode="numeric"
                      />
                    </div>

                    {!showMilestone2 && (
                      <div className="flex justify-end w-full mt-4">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                          onClick={toggleMilestone2}
                        >
                          <CirclePlus size={20} />
                          <span className="font-inter">Add more</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Milestone 2 */}
                  {showMilestone2 && (
                    <div>
                      <ReHeading heading="Milestone 2" size="base" className="text-gray-700 mb-2" />
                      <ReInput name="milestone2" placeholder="Describe deliverable" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <ReDatePicker
                          name="milestone2DeliveryDate"
                          placeholder="Select delivery date"
                          disablePast
                        />
                        <ReInput
                          name="milestone2Amount"
                          placeholder="₦ 00.00"
                          type="number"
                          inputMode="numeric"
                        />
                      </div>

                      <div className="flex justify-end gap-4 w-full mt-4">
                        {!showMilestone3 && (
                          <button
                            type="button"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                            onClick={toggleMilestone3}
                          >
                            <CirclePlus size={20} />
                            <span className="font-inter">Add more</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                          onClick={toggleMilestone2}
                        >
                          <Trash2 size={20} />
                          <span className="font-inter">Delete</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Milestone 3 */}
                  {showMilestone3 && (
                    <div>
                      <ReHeading heading="Milestone 3" size="base" className="text-gray-700 mb-2" />
                      <ReInput name="milestone3" placeholder="Describe deliverable" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <ReDatePicker
                          name="milestone3DeliveryDate"
                          placeholder="Select delivery date"
                          disablePast
                        />
                        <ReInput
                          name="milestone3Amount"
                          placeholder="₦ 00.00"
                          type="number"
                          inputMode="numeric"
                        />
                      </div>

                      <div className="flex justify-start w-full mt-4">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                          onClick={toggleMilestone3}
                        >
                          <Trash2 size={20} />
                          <span className="font-inter">Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Transaction Fee */}
              <div>
                <ReHeading heading="Transaction Fee" size="base" className="text-gray-700 mb-2" />
                <ReRadioGroup
                  name="transactionFee"
                  options={[
                    {
                      label: 'I will pay for the transaction',
                      value: 'I will pay for the transaction',
                    },
                    {
                      label: 'Seller pays for the transaction fee',
                      value: 'Seller pays for the transaction fee',
                    },
                    {
                      label: 'Both Parties Pay (50/50)',
                      value: 'Both Parties Pay (50/50)',
                    },
                  ]}
                  className="flex flex-col gap-4 sm:flex-row sm:gap-2 lg:grid lg:grid-cols-3"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center pt-4">
                <ReButton
                  className="w-[70%] md:w-[30%] rounded-full p-5 font-inter"
                  type="submit"
                  isSubmitting={isSubmitting || isCreatingOrder}
                >
                  Create Order
                </ReButton>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && pendingOrderData && (
        <OrderDetails
          orderData={pendingOrderData}
          onClose={handleCloseOrderDetails}
          onConfirm={handleOrderConfirmation}
          isSubmitting={isCreatingOrder}
        />
      )}
    </>
  );
}
