'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';
import ReSelect from '@/components/re-ui/ReSelect';
import { ReTextarea } from '@/components/re-ui/ReTextarea';
import { rejectOrderSchema, TRejectOrderInput } from '@/lib/validations/order';
import { rejectOrder, updateOrderProgress } from '@/lib/actions/order/order.actions';

interface RejectOrderModalProps {
  orderId: string;
  onClose: () => void;
  onSuccess: () => void;
  orderDetails?: {
    orderNumber: string;
    transactionType: string;
    amount: string;
  };
}

export default function RejectOrderModal({
  orderId,
  onClose,
  onSuccess,
  orderDetails,
}: RejectOrderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TRejectOrderInput>({
    resolver: zodResolver(rejectOrderSchema),
    defaultValues: {
      orderId: orderId || '',
      // rejectionReason: undefined,
      rejectionComments: '',
      resolutionDetails: '',
      contactPreference: undefined,
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState } = form;
  const { errors, isValid } = formState;

  useEffect(() => {
    // Reset form whenever orderId changes
    reset({
      orderId,
      // rejectionReason: undefined,
      rejectionComments: '',
      resolutionDetails: '',
      contactPreference: undefined,
    });
  }, [orderId, reset]);

  const onSubmit = async (data: TRejectOrderInput) => {
    console.log(data);
    try {
      setIsSubmitting(true);

      const response = await updateOrderProgress(
        {
          status: 'REJECTED',
          step: 8,
          notes: data.rejectionComments,
        },
        orderId
      );

      console.log(response);

      if (response?.success) {
        toast.success('Order rejected successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response?.message || 'Failed to reject order');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header inside Dialog */}
      <DialogHeader className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-semibold">Reject Order</DialogTitle>
            <p className="text-sm text-gray-600">Order #{orderDetails?.orderNumber || orderId}</p>
          </div>
        </div>
      </DialogHeader>

      {/* Order Summary */}
      {orderDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Transaction Type:</span>
              <p className="font-medium">{orderDetails.transactionType}</p>
            </div>
            <div>
              <span className="text-gray-600">Amount:</span>
              <p className="font-medium">₦{orderDetails.amount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rejection Reason */}
          {/* <div>
            <ReHeading
              heading="Reason for Rejection *"
              size="base"
              className="text-gray-700 mb-2"
            />
            <div id="rejection-reason">
              <ReSelect
                name="rejectionReason"
                options={[
                  { label: 'Payment Issue', value: 'Payment Issue' },
                  { label: 'Product/Service Quality', value: 'Product/Service Quality' },
                  { label: 'Delivery Issues', value: 'Delivery Issues' },
                  { label: 'Miscommunication', value: 'Miscommunication' },
                  { label: 'Item Not as Described', value: 'Item Not as Described' },
                  { label: 'Price Dispute', value: 'Price Dispute' },
                  { label: 'Timeline Issues', value: 'Timeline Issues' },
                  { label: 'Buyer/Seller Unresponsive', value: 'Buyer/Seller Unresponsive' },
                  { label: 'Fraud/Security Concerns', value: 'Fraud/Security Concerns' },
                  { label: 'Other', value: 'Other' },
                ]}
                placeholder="Select rejection reason"
              />
            </div>
            {errors.rejectionReason && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.rejectionReason.message}
              </p>
            )}
          </div> */}

          {/* Rejection Comments */}
          <div>
            <ReHeading heading="Notes" size="base" className="text-gray-700 mb-2" />
            <ReTextarea
              name="rejectionComments"
              className="font-inter"
              placeholder="Please provide detailed comments about why you're rejecting this order..."
              rows={4}
            />
            {errors.rejectionComments && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.rejectionComments.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Minimum 10 characters required</p>
          </div>

          {/* Resolution Details */}
          {/* <div>
            <ReHeading heading="Resolution Details" size="base" className="text-gray-700 mb-2" />
            <ReTextarea
              name="resolutionDetails"
              className="font-inter"
              placeholder="Optional: Describe how this issue should be resolved..."
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-500">Optional field for additional context</p>
          </div> */}

          {/* Contact Preference */}
          {/* <div>
            <ReHeading
              heading="Preferred Contact Method"
              size="base"
              className="text-gray-700 mb-2"
            />
            <ReSelect
              name="contactPreference"
              options={[
                { label: 'Email', value: 'Email' },
                { label: 'Phone', value: 'Phone' },
                { label: 'Platform Messages', value: 'Platform Messages' },
              ]}
              placeholder="How would you like to be contacted?"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional: How you'd like to be contacted about this rejection
            </p>
          </div> */}

          {/* Warning Message */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Once you reject this order, the transaction will be cancelled and both parties
                  will be notified. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <ReButton
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-[30%] rounded-full p-4 font-inter border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </ReButton>
            <ReButton
              type="submit"
              disabled={!isValid || isSubmitting}
              isSubmitting={isSubmitting}
              className={`w-[30%] rounded-full p-4 font-inter transition-all ${
                !isValid || isSubmitting
                  ? 'cursor-not-allowed bg-gray-300 text-gray-600'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isSubmitting ? 'Rejecting...' : 'Reject Order'}
            </ReButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
