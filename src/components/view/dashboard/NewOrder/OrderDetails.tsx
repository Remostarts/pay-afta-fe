'use client';

import React from 'react';
import { Info, X } from 'lucide-react';
import { TCreateOrderInput } from '@/lib/validations/newOrder.validation';

interface OrderDetailsProps {
  orderData: TCreateOrderInput;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export default function OrderDetails({
  orderData,
  onClose,
  onConfirm,
  isSubmitting = false,
}: OrderDetailsProps) {
  // Calculate totals
  const itemTotal = orderData.items.reduce((total, item) => total + Number(item.price || 0), 0);
  const escrowFee = itemTotal * 0.025; // 2.5% fee
  const totalAmount = itemTotal + escrowFee;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Information */}
          <section className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Row label="Transaction Type" value={orderData.transactionType} />
              <Row label="Payment Type" value={orderData.paymentType} />
              <Row
                label="Counter Party Email or PhoneNo"
                value={orderData.counterpartyEmailOrPhoneNo}
              />
              {orderData.role === 'Buyer' ? (
                <Row label={'Invoice Date'} value={formatDate(orderData.invoiceDate)} />
              ) : (
                <Row label={'Delivery Date'} value={formatDate(orderData.deliveryDate)} />
              )}
            </div>
          </section>

          {/* Items Section */}
          <section className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Items</h3>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <Row label="Item Name" value={item.name} />
                  <Row label="Quantity" value={item.quantity} />
                  <Row label="Price" value={formatCurrency(Number(item.price || 0))} />
                  <Row
                    label="Subtotal"
                    value={
                      <span className="font-medium">
                        {formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Item Description */}
          {orderData.detailAboutItem && (
            <section className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Item Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{orderData.detailAboutItem}</p>
              </div>
            </section>
          )}

          {/* Milestones Section */}
          {orderData.milestones && orderData.milestones.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-gray-900">Payment Milestones</h3>
              <div className="space-y-4">
                {orderData.milestones.map((milestone, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <Row label="Milestone" value={milestone.title} />
                    <Row label="Amount" value={formatCurrency(Number(milestone.amount || 0))} />
                    <Row label="Delivery Date" value={formatDate(milestone.deliveryDate)} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Summary Section */}
          <section className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-900">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <Row label="Items Total" value={formatCurrency(itemTotal)} />
              <Row
                label={
                  <span className="inline-flex items-center gap-1">
                    Escrow Charges @2.5%
                    <Info size={14} className="text-gray-500" />
                  </span>
                }
                value={formatCurrency(escrowFee)}
              />
              <div className="border-t border-gray-200 pt-3">
                <Row
                  label="Total Amount"
                  value={<span className="font-bold text-lg">{formatCurrency(totalAmount)}</span>}
                />
              </div>
              {orderData.transactionFee && (
                <div className="text-xs text-gray-500 mt-2">
                  Transaction fee responsibility: {orderData.transactionFee}
                </div>
              )}
            </div>
          </section>

          {/* Validation Status */}
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                All information validated and ready for submission
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full py-3 rounded-full bg-black text-white font-medium hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating Order...' : 'Confirm & Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Row Component */
type RowProps = {
  label: React.ReactNode;
  value: React.ReactNode;
};

function Row({ label, value }: RowProps) {
  return (
    <div className="grid grid-cols-2 py-1 gap-4">
      <p className="text-gray-600">{label}</p>
      <p className="text-right font-medium">{value}</p>
    </div>
  );
}
