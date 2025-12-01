'use client';

import { useState, useEffect } from 'react';
import { getSingleOrder, updateOrderProgress } from '@/lib/actions/order/order.actions';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  transactionType: string;
  createdAt: string;
  createdBy: string;
  buyerId: string | null;
  sellerId: string | null;
  guestId: string | null;
  amount: number;
  escrowFee: number;
  deliveryDate: string;
  invoiceDate: string;
  detailAboutItem: string;
  paymentType: string;
  transactionFee: string;
  buyer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  seller?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  guest?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: string;
  } | null;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    amount: number;
    detailAboutItem?: string;
  }>;
  progressHistory: Array<{
    id: string;
    step: number;
    status: string;
    notes?: string;
    createdAt: string;
  }>;
}

export default function InvoicePreview({ orderId }: { orderId: string }) {
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch order data
  useEffect(() => {
    if (!orderId) return;

    const fetchOrderData = async () => {
      try {
        setLoading(true);

        const data = await getSingleOrder(orderId);
        setOrderData(data?.data || ({} as OrderDetails));
        setError(null);
        const usersDetails = localStorage.getItem('usersDetails');
        if (!usersDetails) {
          // No userDetails in localStorage means guest user
          setCurrentUser({
            type: 'GUEST',
            id: data?.data?.guestId || '',
            email: data?.data?.guest?.email || '',
          });
        } else {
          // userDetails present (registered user has accessed this page before)
          const parsedUsers = JSON.parse(usersDetails);
          // Get IDs from orderData (createdBy, buyerId, sellerId)
          const { createdBy, buyerId, sellerId } = data?.data || {};
          let initiator = null;

          // Find the matching initiator (Buyer or Seller)
          if (buyerId && createdBy && buyerId === createdBy) {
            // Initiator is Buyer
            initiator = parsedUsers.find(
              (user: any) => user.type === 'buyer' && user.id === buyerId
            );
            if (initiator)
              setCurrentUser({
                ...initiator,
                type: 'BUYER',
              });
            else
              setCurrentUser({
                type: 'GUEST',
                id: data?.data?.guestId || '',
                email: data?.data?.guest?.email || '',
              });
          } else if (sellerId && createdBy && sellerId === createdBy) {
            // Initiator is Seller
            initiator = parsedUsers.find(
              (user: any) => user.type === 'seller' && user.id === sellerId
            );
            if (initiator)
              setCurrentUser({
                ...initiator,
                type: 'SELLER',
              });
            else
              setCurrentUser({
                type: 'GUEST',
                id: data?.data?.guestId || '',
                email: data?.data?.guest?.email || '',
              });
          } else {
            // Fallback to guest if logic does not match
            setCurrentUser({
              type: 'GUEST',
              id: data?.data?.guestId || '',
              email: data?.data?.guest?.email || '',
            });
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load order');
        toast.error(err?.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  console.log('currentUser : ', currentUser);

  // Detect roles
  const detectRoles = () => {
    if (!orderData) return { viewer: 'GUEST', guestRole: null };

    const { createdBy, buyerId, sellerId, guestId } = orderData;

    const isBuyerReal = buyerId !== null;
    const isSellerReal = sellerId !== null;

    // console.log('isBuyerReal : ', isBuyerReal);
    // console.log('isSellerReal : ', isSellerReal);

    let viewer: 'BUYER' | 'SELLER' | 'GUEST';
    let guestRole: 'BUYER' | 'SELLER' | null = null;

    // Check if current user is authenticated
    if (currentUser && currentUser.id) {
      // Registered user viewing
      if (currentUser.id === buyerId) {
        viewer = 'BUYER';
      } else if (currentUser.id === sellerId) {
        viewer = 'SELLER';
      } else {
        viewer = 'GUEST';
      }
    } else {
      // Guest user viewing - check local storage for user details
      viewer = 'GUEST';

      try {
        // Get user details from local storage
        const storedUsersDetails = localStorage.getItem('usersDetails');
        if (storedUsersDetails) {
          const usersDetails = JSON.parse(storedUsersDetails);

          // Find matching user ID in local storage
          const buyerMatch = usersDetails.find(
            (user: any) => user.type === 'buyer' && user.id === buyerId
          );
          const sellerMatch = usersDetails.find(
            (user: any) => user.type === 'seller' && user.id === sellerId
          );
          const guestMatch = usersDetails.find(
            (user: any) => user.type === 'guest' && user.id === guestId
          );

          console.log(
            'Local storage matches - buyer:',
            buyerMatch,
            'seller:',
            sellerMatch,
            'guest:',
            guestMatch
          );

          // Set viewer based on local storage matches
          if (buyerMatch) {
            viewer = 'BUYER';
          } else if (sellerMatch) {
            viewer = 'SELLER';
          } else if (guestMatch) {
            viewer = 'GUEST';
            // Determine guest role based on which real user exists
            if (isBuyerReal && !isSellerReal) {
              guestRole = 'SELLER';
            } else if (!isBuyerReal && isSellerReal) {
              guestRole = 'BUYER';
            }
          }
        }
      } catch (error) {
        console.error('Error reading from local storage:', error);
      }

      // Fallback logic for guest role when no local storage match
      if (viewer === 'GUEST' && !guestRole) {
        if (isBuyerReal && !isSellerReal) {
          guestRole = 'SELLER';
        } else if (!isBuyerReal && isSellerReal) {
          guestRole = 'BUYER';
        }
      }
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
    if (viewer === 'BUYER') return (orderData?.buyerId as string) || '';
    if (viewer === 'SELLER') return (orderData?.sellerId as string) || '';
    return (orderData?.guest?.id as string) || '';
  };

  console.log('getUserIdByViewer : ', getUserIdByViewer);

  // -----------------------------------------
  // CHECK LATEST STATUS
  // -----------------------------------------
  const getLatestStatus = () => {
    if (!orderData?.progressHistory || orderData.progressHistory.length === 0) {
      return orderData?.status || 'PENDING';
    }
    return orderData.progressHistory[orderData.progressHistory.length - 1].status;
  };

  // -----------------------------------------
  // 🔥 ACCEPT LOGIC WITH INITIATOR-Counterparty FLOW
  // -----------------------------------------
  // Handle Accept
  const handleAccept = async () => {
    if (!orderData) return;

    try {
      const latestStatus = getLatestStatus();

      // Check if order already processed
      if (
        ['SHIPPED', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'CANCELED', 'REJECTED'].includes(
          latestStatus
        )
      ) {
        alert('This order has already been processed.');
        return;
      }

      const isBuyerInitiator = orderData.buyerId === orderData.createdBy;
      const isSellerInitiator = orderData.sellerId === orderData.createdBy;

      let status = 'BUYER_AGREED';

      // Logic for initiator-counterparty flow
      if (isBuyerInitiator) {
        if (latestStatus === 'BUYER_AGREED') {
          // Buyer agreed, seller needs to agree
          if (viewer === 'SELLER' || (viewer === 'GUEST' && !isBuyerReal && isSellerReal)) {
            status = 'SELLER_AGREED';
          } else {
            alert('Waiting for the seller to agree to the agreement.');
            return;
          }
        } else {
          // Buyer needs to agree first
          if (viewer === 'BUYER' || (viewer === 'GUEST' && isBuyerReal && !isSellerReal)) {
            status = 'BUYER_AGREED';
          } else {
            alert('Waiting for the buyer to agree to the agreement.');
            return;
          }
        }
      } else if (isSellerInitiator) {
        if (latestStatus === 'SELLER_AGREED') {
          // Seller agreed, buyer needs to agree
          if (viewer === 'BUYER' || (viewer === 'GUEST' && isBuyerReal && !isSellerReal)) {
            status = 'BUYER_AGREED';
          } else {
            alert('Waiting for the buyer to agree to the agreement.');
            return;
          }
        } else {
          // Seller needs to agree first
          if (viewer === 'SELLER' || (viewer === 'GUEST' && !isBuyerReal && isSellerReal)) {
            status = 'SELLER_AGREED';
          } else {
            alert('Waiting for the seller to agree to the agreement.');
            return;
          }
        }
      }

      const payload: UpdateOrderProgressDTO = {
        status: status as UpdateOrderProgressDTO['status'],
        step: 1,
        notes: `${viewer} accepted the agreement`,
        userId: getUserIdByViewer() as string,
      };

      const response = await updateOrderProgress(payload, orderId);

      if (!response?.success) {
        toast.error(response?.message || 'Failed to update order');
        return;
      }

      toast.success('Order updated successfully!');

      // Only real buyer OR guest acting as buyer can make payment
      const isGuestBuyer = viewer === 'GUEST' && !isBuyerReal && isSellerReal;
      if ((viewer === 'BUYER' && isBuyerReal) || isGuestBuyer) {
        router.push(`/finalize-payment?orderId=${orderId}`);
      } else {
        toast.info('Only the buyer can proceed with payment.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to accept agreement.');
    }
  };

  // -----------------------------------------
  // 🔥 REJECT LOGIC
  // -----------------------------------------
  // Handle Reject
  const handleReject = async () => {
    if (!orderData) return;

    const latestStatus = getLatestStatus();

    if (['BUYER_AGREED', 'SELLER_AGREED', 'CANCELED', 'REJECTED'].includes(latestStatus)) {
      alert('This order has already been processed.');
      return;
    }

    const note = prompt('Please provide a reason for rejection:');

    if (!note || note.trim().length < 3) {
      alert('Rejection note is required!');
      return;
    }

    let status = viewer === 'BUYER' ? 'CANCELED' : ('REJECTED' as UpdateOrderProgressDTO['status']);

    try {
      const payload: UpdateOrderProgressDTO = {
        status: status as UpdateOrderProgressDTO['status'],
        step: 1,
        notes: note as string,
        userId: getUserIdByViewer() as string,
      };

      const response = await updateOrderProgress(payload, orderId);

      if (!response?.success) {
        toast.error(response?.message || 'Failed to reject order');
        return;
      }

      toast.success('Order rejected successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject order');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  console.log('orderData', orderData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const latestStatus = getLatestStatus();
  const showAgreementSection = ['PENDING', 'BUYER_AGREED', 'SELLER_AGREED'].includes(latestStatus);

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Viewer Badge */}
        <div className="mb-4 flex justify-end">
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Viewing as: {viewer} {guestRole && `(Guest ${guestRole})`}
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl px-6 py-8">
          <h1 className="text-xl font-semibold mb-6">Payment Invoice</h1>

          {/* Header */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-b pb-6">
            <div>
              <p className="text-xs text-gray-500">Invoice Number</p>
              <p className="font-medium">{orderData.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="font-medium">{latestStatus}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Transaction Type</p>
              <p className="font-medium">{orderData.transactionType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Created Date</p>
              <p className="font-medium">{formatDate(orderData.createdAt)}</p>
            </div>
          </div>

          {/* Seller & Buyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            {/* Seller */}
            <div className="border rounded-lg p-4">
              <p className="mt-3 text-sm text-gray-500">Seller</p>
              <p className="font-semibold">
                {orderData.seller
                  ? `${orderData.seller.firstName} ${orderData.seller.lastName}`
                  : orderData.guest && guestRole === 'SELLER'
                    ? orderData.guest?.firstName + ' ' + orderData.guest?.lastName || 'N/A'
                    : 'Pending'}
              </p>
              <p className="text-gray-500 text-sm">
                {orderData.seller
                  ? orderData.seller.email
                  : orderData.guest && guestRole === 'SELLER'
                    ? orderData.guest.email
                    : 'N/A'}
              </p>
            </div>

            {/* Buyer */}
            <div className="border rounded-lg p-4">
              <p className="mt-3 text-sm text-gray-500">Buyer</p>
              <p className="font-semibold">
                {orderData.buyer
                  ? `${orderData.buyer.firstName} ${orderData.buyer.lastName}`
                  : orderData.guest && guestRole === 'BUYER'
                    ? orderData.guest.email
                    : 'Pending'}
              </p>
              <p className="text-gray-500 text-sm">
                {orderData.buyer
                  ? orderData.buyer.email
                  : orderData.guest && guestRole === 'BUYER'
                    ? orderData.guest.email
                    : 'N/A'}
              </p>
            </div>
          </div>

          {/* Initiator & Counterparty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Initiator */}
            <div className="border rounded-lg p-4 bg-green-50">
              <p className="mt-3 text-sm text-gray-500">Initiator (Order Creator)</p>
              <p className="font-semibold">
                {orderData.buyerId === orderData.createdBy
                  ? orderData.buyer
                    ? `${orderData.buyer.firstName} ${orderData.buyer.lastName}`
                    : 'Buyer'
                  : orderData.seller
                    ? `${orderData.seller.firstName} ${orderData.seller.lastName}`
                    : 'Seller'}
              </p>
              <p className="text-gray-500 text-sm">
                {orderData.buyerId === orderData.createdBy
                  ? orderData.buyer?.email || 'N/A'
                  : orderData.seller?.email || 'N/A'}
              </p>
            </div>

            {/* Counterparty */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <p className="mt-3 text-sm text-gray-500">Counterparty</p>
              <p className="font-semibold">
                {orderData.buyerId === orderData.createdBy
                  ? orderData.seller
                    ? `${orderData.seller.firstName} ${orderData.seller.lastName}`
                    : orderData.guest?.email || 'Seller'
                  : orderData.buyer
                    ? `${orderData.buyer.firstName} ${orderData.buyer.lastName}`
                    : orderData.guest?.email || 'Buyer'}
              </p>
              <p className="text-gray-500 text-sm">
                {orderData.buyerId === orderData.createdBy
                  ? orderData.seller?.email || orderData.guest?.email || 'N/A'
                  : orderData.buyer?.email || orderData.guest?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-4">Order Items</h2>
            {orderData.items.length > 0 ? (
              orderData.items.map((item, idx) => (
                <div key={item.id} className="border rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Item {idx + 1}</div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold">Item Name</p>
                      <p className="text-sm text-gray-600">{item.name}</p>
                    </div>
                    {item.detailAboutItem && (
                      <div>
                        <p className="text-xs font-semibold">Description</p>
                        <p className="text-sm text-gray-600">{item.detailAboutItem}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold">Quantity</p>
                        <p>{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Unit Price</p>
                        <p>{formatCurrency(item.amount)}</p>
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
              <p className="text-gray-500">No items found</p>
            )}
          </div>

          {/* Summary */}
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span>{formatCurrency(orderData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Fee (2.5%)</span>
                <span>{formatCurrency(orderData.escrowFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Grand Total</span>
                <span>{formatCurrency(orderData.amount + orderData.escrowFee)}</span>
              </div>
            </div>
          </div>

          {/* Agreement Section */}
          {showAgreementSection && (
            <div className="border rounded-xl p-6 mt-10 bg-amber-50 border-amber-200">
              <p className="font-semibold mb-2 text-lg">
                {latestStatus === 'PENDING'
                  ? '⏳ Review Transaction'
                  : latestStatus === 'BUYER_AGREED'
                    ? '✅ Buyer Agreed - Waiting for Seller'
                    : '✅ Seller Agreed - Waiting for Buyer'}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Please inspect all details carefully before approving this escrow agreement.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  ✓ Accept Agreement
                </button>

                <button
                  onClick={handleReject}
                  className="flex-1 border-2 border-red-500 text-red-600 py-3 rounded-lg font-medium bg-white hover:bg-red-50 transition"
                >
                  ✗ Reject Agreement
                </button>
              </div>

              {viewer === 'GUEST' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Guest User:</strong> After accepting, you'll be directed to complete
                    payment or wait for the other party's acceptance.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Completed Status */}
          {!showAgreementSection && (
            <div className="border rounded-xl p-6 mt-10 bg-gray-100">
              <p className="font-semibold text-center text-lg">Order Status: {latestStatus}</p>
              {latestStatus === 'COMPLETED' && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  ✅ This order has been completed successfully!
                </p>
              )}
              {['CANCELED', 'REJECTED'].includes(latestStatus) && (
                <p className="text-center text-sm text-red-600 mt-2">
                  ❌ This order has been {latestStatus.toLowerCase()}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
