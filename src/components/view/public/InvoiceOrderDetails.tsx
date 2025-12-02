'use client';

import React from 'react';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  detailAboutItem?: string;
}

interface Order {
  orderNumber: string;
  status: string;
  transactionType?: string;
  createdAt: string;
  buyer?: User | null;
  seller?: User | null;
  guest?: User | null;
  items: Item[];
  amount: number;
  escrowFee: number;
  currentStep?: string;
}

interface InvoiceOrderDetailsProps {
  order: Order;
  userRole: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const InvoiceOrderDetails: React.FC<InvoiceOrderDetailsProps> = ({ order, userRole }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl px-6 py-8 mt-6">
      {/* Header */}
      <h1 className="text-xl font-semibold mb-6">Payment Invoice</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-b pb-6">
        <div>
          <p className="text-xs text-gray-500">Invoice Number</p>
          <p className="font-medium">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="font-medium">{order.status}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Transaction Type</p>
          <p className="font-medium">{order.transactionType || 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Created Date</p>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>
      </div>
      {/* Disabled actions message */}
      {['CANCELED', 'REJECTED'].includes(order.status) && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {(() => {
            // If order was canceled
            if (order.status === 'CANCELED') {
              return userRole.includes('BUYER')
                ? 'You canceled this order. No further actions can be performed.'
                : 'The buyer canceled this order. No further actions can be performed.';
            }

            // If order was rejected
            if (order.status === 'REJECTED') {
              return userRole.includes('SELLER')
                ? 'You rejected this order. No further actions can be performed.'
                : 'The seller rejected this order. No further actions can be performed.';
            }

            return null;
          })()}
        </div>
      )}

      {/* Buyer & Seller */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Seller</p>
          <p className="font-semibold">
            {order.seller
              ? `${order.seller.firstName} ${order.seller.lastName}`
              : order.guest?.firstName || 'Not available'}
          </p>
          <p className="text-gray-500 text-sm">{order.seller?.email || order.guest?.email}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="mt-3 text-sm text-gray-500">Buyer</p>
          <p className="font-semibold">
            {order.buyer
              ? `${order.buyer.firstName} ${order.buyer.lastName}`
              : order.guest?.firstName || 'Not available'}
          </p>
          <p className="text-gray-500 text-sm">{order.buyer?.email || order.guest?.email}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h2 className="text-sm font-medium mb-4">Order Items</h2>
        {order.items.map((item, idx) => (
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
                  <p>{formatCurrency(Number(item.price) || 0)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold">Total</p>
                  <p>{formatCurrency((Number(item.price) || 0) * (item.quantity || 0))}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-4 mb-6 bg-gray-50">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span>{formatCurrency(Number(order.amount))}</span>
          </div>
          <div className="flex justify-between">
            <span>Escrow Fee (2.5%)</span>
            <span>{formatCurrency(Number(order.escrowFee))}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Grand Total</span>
            <span>{formatCurrency(Number(order.amount) + Number(order.escrowFee))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceOrderDetails;
