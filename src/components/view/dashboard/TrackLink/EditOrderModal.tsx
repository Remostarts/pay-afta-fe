'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, CirclePlus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import ReRadioGroup from '@/components/re-ui/ReRadio';
import ReDatePicker from '@/components/re-ui/ReDatePicker';
import { editOrderSchema, TEditOrderInput } from '@/lib/validations/order';
import { updateOrder } from '@/lib/actions/order/order.actions';

interface EditOrderModalProps {
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditOrderModal({ order, onClose, onSuccess }: EditOrderModalProps) {
  const [paymentType, setPaymentType] = useState<string>('');
  const [showItem2, setShowItem2] = useState(false);
  const [showMilestone2, setShowMilestone2] = useState(false);
  const [showMilestone3, setShowMilestone3] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  const form = useForm<TEditOrderInput>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      transactionType: 'Product',
      detailAboutItem: '',
      paymentType: 'One time Payment',
      transactionFee: 'I will pay for the transaction',
      deliveryDate: new Date(),
      items: [
        {
          name: '',
          price: '',
          quantity: '1',
        },
      ],
      milestones: [],
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset, setValue, watch, formState } = form;
  const { isSubmitting } = formState;
  const currentTransactionType = watch('transactionType');

  useEffect(() => {
    if (order) {
      const defaultItems =
        order.items && order.items.length > 0
          ? order.items.map((item: any) => ({
              name: item.name || '',
              price: item.price || '0',
              quantity: item.quantity?.toString() || '1',
            }))
          : [
              {
                name: '',
                price: '',
                quantity: '1',
              },
            ];

      const defaultMilestones =
        order.milestones && order.milestones.length > 0
          ? order.milestones.map((milestone: any) => ({
              title: milestone.title || '',
              amount: milestone.amount || '0',
              deliveryDate: new Date(milestone.deliveryDate),
            }))
          : [];

      reset({
        transactionType: order.transactionType || 'Product',
        detailAboutItem: order.detailAboutItem || '',
        paymentType: order.paymentType || 'One time Payment',
        transactionFee: order.transactionFee || 'I will pay for the transaction',
        deliveryDate: new Date(order.deliveryDate),
        items: defaultItems,
        milestones: defaultMilestones,
      });

      setPaymentType(order.paymentType || 'One time Payment');
      setShowItem2(defaultItems.length > 1);

      if (defaultMilestones.length > 1) setShowMilestone2(true);
      if (defaultMilestones.length > 2) setShowMilestone3(true);
    }
  }, [order, reset]);

  const handleTransactionTypeChange = (value: string) => {
    setValue('transactionType', value as 'Product' | 'Services');
  };

  const handlePaymentTypeChange = (value: 'One time Payment' | 'Milestone Payment') => {
    setPaymentType(value);
    setValue('paymentType', value);

    if (value !== 'Milestone Payment') {
      setShowMilestone2(false);
      setShowMilestone3(false);
      setValue('milestones', []);
    }
  };

  const toggleItem2 = () => {
    const items = watch('items') || [];
    if (showItem2) {
      if (items.length > 1) {
        items.pop();
        setValue('items', items);
      }
    } else {
      items.push({
        name: '',
        price: '',
        quantity: '1',
      });
      setValue('items', items);
    }
    setShowItem2(!showItem2);
  };

  const toggleMilestone2 = () => {
    const milestones = watch('milestones') || [];
    if (showMilestone2) {
      if (milestones.length > 1) {
        milestones.pop();
        setValue('milestones', milestones);
      }
    } else {
      milestones.push({
        title: '',
        amount: '0',
        deliveryDate: new Date(),
      });
      setValue('milestones', milestones);
    }
    setShowMilestone2(!showMilestone2);
  };

  const toggleMilestone3 = () => {
    const milestones = watch('milestones') || [];
    if (showMilestone3) {
      if (milestones.length > 2) {
        milestones.pop();
        setValue('milestones', milestones);
      }
    } else {
      milestones.push({
        title: '',
        amount: '0',
        deliveryDate: new Date(),
      });
      setValue('milestones', milestones);
    }
    setShowMilestone3(!showMilestone3);
  };

  const onSubmit = async (data: TEditOrderInput) => {
    try {
      setIsUpdatingOrder(true);

      const items = data.items.filter((item) => item.name.trim() !== '');
      if (items.length === 0) {
        toast.error('At least one item is required');
        return;
      }

      let milestones = data.milestones;
      if (data.paymentType === 'Milestone Payment') {
        const validMilestones = milestones?.filter(
          (milestone) => milestone.title.trim() !== '' && milestone.amount.trim() !== ''
        );

        if (!validMilestones || validMilestones.length === 0) {
          const totalAmount = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
          milestones = [
            {
              title: 'Full Payment',
              amount: totalAmount.toString(),
              deliveryDate: data.deliveryDate || new Date(),
            },
          ];
        }
      } else {
        milestones = [];
      }

      const processedData = {
        ...data,
        items,
        milestones: milestones || [],
      };

      const response = await updateOrder(processedData, order.id);

      if (response?.success) {
        toast.success('Order updated successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response?.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update order. Please try again.'
      );
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const items = watch('items') || [];
  const milestones = watch('milestones') || [];

  return (
    <div className="w-full">
      {/* Header inside Dialog */}
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-semibold">Edit Order</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div className="w-full">
            <ReHeading heading="Transaction Type" size="base" className="text-gray-700 mb-2" />
            <ReSelect
              name="transactionType"
              options={[
                { label: 'Product', value: 'Product' },
                { label: 'Services', value: 'Services' },
              ]}
              placeholder="Select"
              onChange={handleTransactionTypeChange}
            />
          </div>

          {/* Counterparty Info (Read-only) */}
          <div>
            <ReHeading heading="Counterparty" size="base" className="text-gray-700 mb-2" />
            <div className="p-3 bg-gray-100 rounded-md text-sm text-gray-600">
              {order?.buyer && `Buyer: ${order.buyer.firstName} ${order.buyer.lastName}`}{' '}
              {order?.seller && `Seller: ${order.seller.firstName} ${order.seller.lastName}`}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {/* Item 1 */}
            <div>
              <ReHeading heading="Item 1" size="base" className="text-gray-700 mb-2" />
              <ReInput name={`items.0.name`} placeholder="Enter Name" />
              <div className="grid lg:grid-cols-2 lg:gap-5">
                <ReInput name={`items.0.quantity`} placeholder="Enter Quantity" />
                <ReInput name={`items.0.price`} placeholder="₦ 00.00" />
              </div>

              {!showItem2 && items.length === 1 && (
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
                <ReInput name={`items.1.name`} placeholder="Enter Name" />
                <div className="grid lg:grid-cols-2 lg:gap-5">
                  <ReInput name={`items.1.quantity`} placeholder="Enter Quantity" />
                  <ReInput name={`items.1.price`} placeholder="₦ 00.00" />
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
          </div>

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

          {/* Delivery Date */}
          {/* <div>
            <ReHeading heading="Select Delivery Date" size="base" className="text-gray-700 mb-2" />
            <ReDatePicker name="deliveryDate" className="lg:w-2/5" disablePast />
          </div> */}

          {/* Milestone Payment Fields */}
          {paymentType === 'Milestone Payment' && (
            <div className="space-y-6">
              {/* Milestone 1 */}
              <div>
                <ReHeading heading="Milestone 1" size="base" className="text-gray-700 mb-2" />
                <ReInput
                  name={`milestones.0.title`}
                  placeholder="Describe deliverable"
                  className="w-full"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <ReDatePicker
                    name={`milestones.0.invoiceDate`}
                    placeholder="Select invoice date"
                    disablePast
                  />
                  <ReInput
                    name={`milestones.0.amount`}
                    placeholder="₦ 00.00"
                    type="number"
                    inputMode="numeric"
                  />
                </div>

                {!showMilestone2 && milestones.length === 1 && (
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
                  <ReInput name={`milestones.1.title`} placeholder="Describe deliverable" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <ReDatePicker
                      name={`milestones.1.invoiceDate`}
                      placeholder="Select invoice date"
                      disablePast
                    />
                    <ReInput
                      name={`milestones.1.amount`}
                      placeholder="₦ 00.00"
                      type="number"
                      inputMode="numeric"
                    />
                  </div>

                  <div className="flex justify-end gap-4 w-full mt-4">
                    {!showMilestone3 && milestones.length === 2 && (
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
                  <ReInput name={`milestones.2.title`} placeholder="Describe deliverable" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <ReDatePicker
                      name={`milestones.2.deliveryDate`}
                      placeholder="Select delivery date"
                      disablePast
                    />
                    <ReInput
                      name={`milestones.2.amount`}
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
              className="flex flex-col lg:grid lg:grid-cols-3 gap-4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center pt-4 gap-4">
            <ReButton
              type="button"
              onClick={onClose}
              className="w-[30%] rounded-full p-5 font-inter border-2 border-[#03045B] bg-white text-[#03045B] hover:bg-gray-50"
            >
              Cancel
            </ReButton>
            <ReButton
              type="submit"
              isSubmitting={isSubmitting || isUpdatingOrder}
              className="w-[30%] rounded-full p-5 font-inter"
            >
              {isUpdatingOrder ? 'Updating...' : 'Update Order'}
            </ReButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
