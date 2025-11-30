'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { OrderDetails } from '@/types/order';
import { updateOrderProgress } from '@/lib/actions/order/order.actions';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';

interface InvoicePreviewProps {
  orderId: string;
  invoiceData: OrderDetails;
}

export default function InvoicePreview({ orderId, invoiceData }: InvoicePreviewProps) {
  const router = useRouter();

  // -----------------------------------------
  // 🔥 SMART ROLE DETECTION
  // -----------------------------------------
  const detectRoles = () => {
    const { createdBy, buyerId, sellerId } = invoiceData;

    const isBuyerReal = createdBy === buyerId;
    const isSellerReal = createdBy === sellerId;

    let viewer: 'BUYER' | 'SELLER' | 'GUEST';
    let guestRole: 'BUYER' | 'SELLER' | null = null;

    if (isBuyerReal && isSellerReal) {
      // Both real users exist, no guest
      viewer = isBuyerReal ? 'BUYER' : 'SELLER';
      guestRole = null;
    } else if (isBuyerReal) {
      viewer = 'BUYER';
      guestRole = 'SELLER';
    } else if (isSellerReal) {
      viewer = 'SELLER';
      guestRole = 'BUYER';
    } else {
      // Neither buyer nor seller is real → guest
      viewer = 'GUEST';
      guestRole = null;
    }

    return { viewer, isBuyerReal, isSellerReal, guestRole };
  };

  const { viewer, isBuyerReal, isSellerReal, guestRole } = detectRoles();

  console.log(
    'viewer:',
    viewer,
    'buyer:',
    isBuyerReal,
    'seller:',
    isSellerReal,
    'guest:',
    guestRole
  );

  // -----------------------------------------
  // 🔥 HELPER TO GET USER ID
  // -----------------------------------------
  const getUserIdByViewer = () => {
    if (viewer === 'BUYER') return invoiceData.buyerId;
    if (viewer === 'SELLER') return invoiceData.sellerId;
    return invoiceData.guest?.id || 'UNKNOWN';
  };

  console.log('getUserIdByViewer : ', getUserIdByViewer);

  // -----------------------------------------
  // CHECK LATEST STATUS
  // -----------------------------------------

  const getLatestStatus = () => {
    if (!invoiceData.progressHistory || invoiceData.progressHistory.length === 0) return null;
    // Assuming progressHistory is sorted by step or createdAt ascending
    return invoiceData.progressHistory[invoiceData.progressHistory.length - 1].status;
  };

  console.log('getLatestStatus', getLatestStatus());

  // -----------------------------------------
  // 🔥 ACCEPT LOGIC WITH INITIATOR-Counterparty FLOW
  // -----------------------------------------
  const handleAccept = async () => {
    try {
      const latestStatus = getLatestStatus();

      console.log(latestStatus);

      if (
        ['SHIPPED', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'CANCELED', 'REJECTED'].includes(
          latestStatus || ''
        )
      ) {
        toast.info('This order has already been processed.');
        return;
      }

      // Determine who the initiator is
      const isBuyerInitiator = invoiceData?.buyerId === invoiceData?.createdBy;
      const isSellerInitiator = invoiceData?.sellerId === invoiceData?.createdBy;

      let status: UpdateOrderProgressDTO['status'] = 'BUYER_AGREED';

      console.log(isBuyerInitiator);
      console.log(viewer);

      // Logic: If initiator has agreed, counterparty needs to agree
      if (isBuyerInitiator) {
        // Buyer is initiator
        if (latestStatus === 'BUYER_AGREED') {
          // Buyer has already agreed, now seller needs to agree
          if (viewer === 'SELLER' || (viewer === 'GUEST' && !isBuyerReal && isSellerReal)) {
            status = 'SELLER_AGREED';
            console.log('Seller Agreed');
          } else {
            toast.info('Waiting for the seller to agree to the agreement.');
            return;
          }
        } else {
          // Buyer hasn't agreed yet, buyer can agree
          if (viewer === 'BUYER' || (viewer === 'GUEST' && isBuyerReal && !isSellerReal)) {
            status = 'BUYER_AGREED';
          } else {
            toast.info('Waiting for the buyer to agree to the agreement.');
            return;
          }
        }
      } else if (isSellerInitiator) {
        // Seller is initiator
        if (latestStatus === 'SELLER_AGREED') {
          // Seller has already agreed, now buyer needs to agree
          if (viewer === 'BUYER' || (viewer === 'GUEST' && isBuyerReal && !isSellerReal)) {
            status = 'BUYER_AGREED';
          } else {
            toast.info('Waiting for the buyer to agree to the agreement.');
            return;
          }
        } else {
          // Seller hasn't agreed yet, seller can agree
          if (viewer === 'SELLER' || (viewer === 'GUEST' && !isBuyerReal && isSellerReal)) {
            status = 'SELLER_AGREED';
          } else {
            toast.info('Waiting for the seller to agree to the agreement.');
            return;
          }
        }
      } else {
        // Fallback to original logic if initiator cannot be determined
        if (viewer === 'BUYER') {
          status = 'BUYER_AGREED';
        } else if (viewer === 'SELLER') {
          status = 'SELLER_AGREED';
        } else if (viewer === 'GUEST') {
          if (isBuyerReal)
            status = 'SELLER_AGREED'; // guest is seller
          else if (isSellerReal)
            status = 'BUYER_AGREED'; // guest is buyer
          else status = 'BUYER_AGREED'; // fallback
        }
      }

      const payload: UpdateOrderProgressDTO = {
        status,
        step: 1,
        notes: `${viewer} accepted the agreement`,
        userId: getUserIdByViewer(),
      };

      const response = await updateOrderProgress(payload, invoiceData?.id);

      if (!response?.success) {
        toast.error(response?.message || 'Failed to update order');
        return;
      }

      toast.success('Order updated successfully!');

      // Only real buyer OR guest acting as buyer can make payment
      const isGuestBuyer = viewer === 'GUEST' && !isBuyerReal && isSellerReal;
      if ((viewer === 'BUYER' && isBuyerReal) || isGuestBuyer) {
        router.push(`/finalize-payment?orderId=${invoiceData?.id}`);
      } else {
        toast.info('Only the buyer can proceed with payment.');
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to accept agreement.');
    }
  };

  // -----------------------------------------
  // 🔥 REJECT LOGIC
  // -----------------------------------------
  const handleReject = async () => {
    const latestStatus = getLatestStatus();

    if (['BUYER_AGREED', 'SELLER_AGREED', 'CANCELED', 'REJECTED'].includes(latestStatus || '')) {
      toast.info('This order has already been processed.');
      return;
    }
    const note = prompt('Please provide a reason for rejection:');

    if (!note || note.trim().length < 3) {
      toast.error('Rejection note is required!');
      return;
    }

    let status: UpdateOrderProgressDTO['status'];
    if (viewer === 'BUYER') status = 'CANCELED';
    else if (viewer === 'SELLER') status = 'REJECTED';
    else status = 'REJECTED';

    try {
      const payload: UpdateOrderProgressDTO = {
        status,
        step: 1,
        notes: note,
        userId: getUserIdByViewer(),
      };

      const response = await updateOrderProgress(payload, invoiceData?.id);

      if (!response?.success) {
        toast.error(response?.message || 'Failed to reject order');
        return;
      }

      toast.success('Order rejected successfully');
      router.refresh();
    } catch {
      toast.error('Something went wrong');
    }
  };

  // -----------------------------------------
  // Helpers
  // -----------------------------------------
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

  return (
    <div className="w-full bg-white shadow-sm rounded-xl px-6 py-8">
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

      {/* Seller & Buyer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {/* Seller */}
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Seller</p>
          <p className="font-semibold">
            {invoiceData?.seller?.firstName
              ? `${invoiceData.seller.firstName} ${invoiceData.seller.lastName}`
              : invoiceData?.guest && guestRole === 'SELLER'
                ? `${invoiceData.guest.firstName} ${invoiceData.guest.lastName}`
                : invoiceData?.sellerId}
          </p>
          <p className="text-gray-500 text-sm">
            {invoiceData?.seller?.email
              ? invoiceData.seller.email
              : invoiceData?.guest && guestRole === 'SELLER'
                ? invoiceData.guest.email
                : 'N/A'}
          </p>
        </div>

        {/* Buyer */}
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Buyer</p>
          <p className="font-semibold">
            {invoiceData?.buyer?.firstName
              ? `${invoiceData.buyer.firstName} ${invoiceData.buyer.lastName}`
              : invoiceData?.guest && guestRole === 'BUYER'
                ? `${invoiceData.guest.firstName} ${invoiceData.guest.lastName}`
                : invoiceData?.buyerId}
          </p>
          <p className="text-gray-500 text-sm">
            {invoiceData?.buyer?.email
              ? invoiceData.buyer.email
              : invoiceData?.guest && guestRole === 'BUYER'
                ? invoiceData.guest.email
                : 'N/A'}
          </p>
        </div>
      </div>

      {/* Initiator & Counterparty */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Initiator */}
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Initiator</p>
          <p className="font-semibold">
            {invoiceData?.buyerId === invoiceData?.createdBy
              ? invoiceData?.buyer?.firstName
                ? `${invoiceData.buyer.firstName} ${invoiceData.buyer.lastName}`
                : invoiceData?.guest && guestRole === 'BUYER'
                  ? `${invoiceData.guest.firstName} ${invoiceData.guest.lastName}`
                  : invoiceData?.buyerId
              : invoiceData?.sellerId === invoiceData?.createdBy
                ? invoiceData?.seller?.firstName
                  ? `${invoiceData.seller.firstName} ${invoiceData.seller.lastName}`
                  : invoiceData?.guest && guestRole === 'SELLER'
                    ? `${invoiceData.guest.firstName} ${invoiceData.guest.lastName}`
                    : invoiceData?.sellerId
                : 'N/A'}
          </p>
          <p className="text-gray-500 text-sm">
            {invoiceData?.buyerId === invoiceData?.createdBy
              ? invoiceData?.buyer?.email
                ? invoiceData.buyer.email
                : invoiceData?.guest && guestRole === 'BUYER'
                  ? invoiceData.guest.email
                  : 'N/A'
              : invoiceData?.sellerId === invoiceData?.createdBy
                ? invoiceData?.seller?.email
                  ? invoiceData.seller.email
                  : invoiceData?.guest && guestRole === 'SELLER'
                    ? invoiceData.guest.email
                    : 'N/A'
                : 'N/A'}
          </p>
        </div>

        {/* Counterparty */}
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Counterparty</p>
          <p className="font-semibold">
            {invoiceData?.buyerId === invoiceData?.createdBy
              ? invoiceData?.seller?.firstName
                ? `${invoiceData.seller.firstName} ${invoiceData.seller.lastName}`
                : invoiceData?.guest && guestRole === 'SELLER'
                  ? `${invoiceData.guest.firstName} ${invoiceData.guest.lastName}`
                  : invoiceData?.sellerId
              : invoiceData?.sellerId === invoiceData?.createdBy
                ? invoiceData?.buyer?.firstName
                  ? `${invoiceData.buyer.firstName} ${invoiceData.buyer.lastName}`
                  : invoiceData?.guest && guestRole === 'BUYER'
                    ? `${invoiceData.guest.firstName} ${invoiceData.guest.lastName}`
                    : invoiceData?.buyerId
                : 'N/A'}
          </p>
          <p className="text-gray-500 text-sm">
            {invoiceData?.buyerId === invoiceData?.createdBy
              ? invoiceData?.seller?.email
                ? invoiceData.seller.email
                : invoiceData?.guest && guestRole === 'SELLER'
                  ? invoiceData.guest.email
                  : 'N/A'
              : invoiceData?.sellerId === invoiceData?.createdBy
                ? invoiceData?.buyer?.email
                  ? invoiceData.buyer.email
                  : invoiceData?.guest && guestRole === 'BUYER'
                    ? invoiceData.guest.email
                    : 'N/A'
                : 'N/A'}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-4">Order Items</h2>
        {invoiceData?.items?.length ? (
          invoiceData.items.map((item, idx) => (
            <div key={idx} className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Item {idx + 1}</div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold">Description</p>
                  <p className="text-sm text-gray-600">
                    {item?.detailAboutItem || 'No description'}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold">Qty</p>
                    <p>{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Unit Price</p>
                    <p>{formatCurrency(item?.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Total</p>
                    <p>{formatCurrency(item.amount * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span>{formatCurrency(invoiceData.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Escrow Fee</span>
            <span>{formatCurrency(invoiceData.escrowFee)}</span>
          </div>
        </div>
      </div>

      {/* Agreement Section */}
      {['PENDING', 'BUYER_AGREED', 'SELLER_AGREED'].includes(invoiceData.status) && (
        <div className="border rounded-xl p-6 mt-10 bg-[#E6E6E6]">
          <p className="font-semibold mb-2">
            {invoiceData.status === 'PENDING'
              ? 'Review Transaction'
              : 'Transaction Update Required'}
          </p>
          <p className="text-sm text-gray-600 mb-6">Please inspect details before approving.</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAccept}
              className="w-full bg-[#03045B] text-white py-3 rounded-lg font-medium hover:bg-blue-900"
            >
              Accept
            </button>

            <button
              onClick={handleReject}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium bg-gray-50 hover:bg-gray-100"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
