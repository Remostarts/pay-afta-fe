'use client';

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGeneral } from '@/context/generalProvider';
import { OrderDetails } from '@/types/order';
import { toast } from 'sonner';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';

interface InvoicePreviewProps {
  orderId: string;
  invoiceData: OrderDetails;
  onAccept?: () => void;
  onReject?: () => void;
}

export default function InvoicePreview({
  orderId = 'INV-2023-0749268',
  invoiceData,
  onAccept,
  onReject,
}: InvoicePreviewProps) {
  const router = useRouter();
  const { user } = useGeneral();

  console.log(invoiceData);

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAccept = async () => {
    console.log('agreement Accept');

    // try {
    //   // const response = await updateOrderProgress(
    //   //   {
    //   //     status: agreement,
    //   //     step: 1,
    //   //     notes: 'Agreement signed',
    //   //     userId: user?.id,
    //   //   } as UpdateOrderProgressDTO,
    //   //   orderId?.id as string
    //   // );
    //   // if (response?.success) {
    //     toast.success('Order updated successfully!');
    //     router.push(
    //       `/finalize-payment?orderId=${invoiceData?.id}&invoiceData=${encodeURIComponent(JSON.stringify(invoiceData))}`
    //     );
    //   // } else {
    //     // toast.error(response?.message || 'Failed to update order');
    //   }
    // } catch (error) {
    //   toast.error(
    //     error instanceof Error ? error.message : 'Failed to update order progress history'
    //   );
    // }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    } else {
      // Handle reject logic
      console.log('Invoice rejected');
    }
  };

  // console.log(user);

  return (
    <div className="w-full bg-white shadow-sm rounded-xl px-6 py-8">
      {/* Title */}
      <h1 className="text-xl font-semibold mb-6">Payment Invoice</h1>

      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-b pb-6">
        <div>
          <p className="text-xs text-gray-500">Invoice Number</p>
          <p className="font-medium">{invoiceData?.id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-medium">{invoiceData?.status}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Transaction Type</p>
          <p className="font-medium">{invoiceData?.transactionType || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Created Date</p>
          <p className="font-medium">
            {invoiceData?.createdAt ? formatDate(invoiceData.createdAt) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {/* Seller */}
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Seller</p>
          <p className="font-semibold">
            {invoiceData?.seller?.firstName && invoiceData?.seller?.lastName
              ? `${invoiceData.seller.firstName} ${invoiceData.seller.lastName}`
              : invoiceData?.sellerId || 'N/A'}
          </p>
          <p className="text-gray-500 text-sm">{invoiceData?.seller?.email || 'N/A'}</p>
          {invoiceData?.seller?.username && (
            <p className="text-gray-400 text-xs">@{invoiceData.seller.username}</p>
          )}
        </div>

        {/* Buyer */}
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Buyer</p>
          <p className="font-semibold">
            {invoiceData?.buyer?.firstName && invoiceData?.buyer?.lastName
              ? `${invoiceData.buyer.firstName} ${invoiceData.buyer.lastName}`
              : invoiceData?.buyerId || 'N/A'}
          </p>
          <p className="text-gray-500 text-sm">{invoiceData?.buyer?.email || 'N/A'}</p>
          {invoiceData?.buyer?.username && (
            <p className="text-gray-400 text-xs">@{invoiceData.buyer.username}</p>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-4">Order Items</h2>
        {invoiceData?.items?.length > 0 ? (
          invoiceData.items.map((item, index) => (
            <div key={item?.id || index} className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Item {index + 1}</div>

              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold">Description</p>
                  <p className="text-sm text-gray-600">
                    {item?.detailAboutItem || 'No description available'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold">Quantity</p>
                    <p>{item.quantity || 0}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold">Unit Price</p>
                    <p>{formatCurrency(item?.amount || 0)}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold">Total</p>
                    <p>{formatCurrency((item?.amount || 0) * (item.quantity || 0))}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border rounded-lg p-4 text-center text-gray-500">
            <p>No items found for this order</p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-medium">{formatCurrency(invoiceData?.amount || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>scrow Fee</span>
            <span>{formatCurrency(invoiceData?.escrowFee || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Type</span>
            <span>{invoiceData?.paymentType || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Date</span>
            <span>{invoiceData?.deliveryDate ? formatDate(invoiceData.deliveryDate) : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-4">Payment Milestones</h2>
        {invoiceData?.milestones?.length > 0 ? (
          <div className="space-y-4">
            {invoiceData.milestones.map((milestone, index) => (
              <div key={milestone.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm">{milestone.title}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      milestone.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : milestone.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {milestone.status}
                  </span>
                </div>
                {milestone.description && (
                  <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold">Amount</p>
                    <p className="font-medium">{formatCurrency(milestone.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Delivery Date</p>
                    <p>{milestone.deliveryDate ? formatDate(milestone.deliveryDate) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Payment ID</p>
                    <p className="text-xs text-gray-500">{milestone.paymentId || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg p-4 text-center text-gray-500">
            <p>No payment milestones found for this order</p>
          </div>
        )}
      </div>

      {/* Delivery Information */}
      {invoiceData?.delivery && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Delivery Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold">Tracking Number</p>
              <p>{invoiceData.delivery.trackingNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold">Delivery Status</p>
              <p>{invoiceData.delivery.status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold">Delivery Cost</p>
              <p>{formatCurrency(invoiceData.delivery.totalCost || 0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details */}
      {invoiceData?.Payment && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Payment Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold">Total Amount</p>
              <p className="font-medium">{formatCurrency(invoiceData.Payment.totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold">Paid Amount</p>
              <p>{formatCurrency(invoiceData.Payment.paidAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold">Remaining Amount</p>
              <p>{formatCurrency(invoiceData.Payment.remainingAmount)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold">Payment Status</p>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  invoiceData.Payment.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-800'
                    : invoiceData.Payment.status === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {invoiceData.Payment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Approval Section */}
      {invoiceData?.status &&
        ['PENDING', 'BUYER_AGREED', 'SELLER_AGREED'].includes(invoiceData.status) && (
          <div className="border rounded-xl p-6 mt-10 bg-[#E6E6E6]">
            <p className="font-semibold mb-2">
              {invoiceData.status === 'PENDING'
                ? 'Review Transaction'
                : 'Transaction Update Required'}
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {invoiceData.status === 'PENDING'
                ? 'The buyer/seller has created a payment. Make sure you inspect the details before approving.'
                : `This transaction is currently ${invoiceData.status}. Please review the current status and take appropriate action.`}
            </p>

            {invoiceData.status === 'PENDING' && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="w-full bg-[#03045B] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={handleReject}
                  className="w-full border border-gray-300 py-3 rounded-lg font-medium bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

      {/* Order Progress */}
      {invoiceData?.progressHistory && invoiceData.progressHistory.length > 0 && (
        <div className="border rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-4">Order Progress</h3>
          <div className="space-y-3">
            {invoiceData.progressHistory.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    step.status === 'COMPLETED'
                      ? 'bg-green-500'
                      : step.status === 'FAILED'
                        ? 'bg-red-500'
                        : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{step.notes}</p>
                  <p className="text-xs text-gray-500">{formatDate(step.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-6 mt-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            If you have any questions about this invoice, please contact us at support@payafta.com
          </p>
          {invoiceData?.updatedAt && <p>Last updated: {formatDate(invoiceData.updatedAt)}</p>}
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">
            Order ID: {invoiceData?.id} • Current Step: {invoiceData?.currentStep || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
