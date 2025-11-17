'use client';

import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface InvoicePreviewProps {
  orderId?: string;
  invoiceData?: {
    id: string;
    issueDate: string;
    dueDate: string;
    seller: {
      name: string;
      email: string;
    };
    buyer: {
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
    totals: {
      subtotal: number;
      tax: number;
      shipping: number;
      total: number;
    };
  };
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

  // Use provided data or fallback to defaults
  const data = invoiceData || {
    id: orderId,
    issueDate: '3 Nov, 2023',
    dueDate: '24 Nov, 2023',
    seller: {
      name: 'John Doe',
      email: 'johndoe@mail.com',
    },
    buyer: {
      name: 'John Doe',
      email: 'johndoe@mail.com',
    },
    items: [
      {
        id: '1',
        description:
          'Lorem ipsum dolor sit amet consectetur. Sapien placerat mauris cras commodo faucibus nisl magna in',
        quantity: 70,
        price: 300000,
      },
    ],
    milestones: [
      {
        id: '1',
        title: 'Milestone 1',
        description:
          'Lorem ipsum dolor sit amet consectetur. Sapien placerat mauris cras commodo faucibus nisl magna in',
        deliveryDate: 'November 24, 2023',
        amount: 150000,
      },
      {
        id: '2',
        title: 'Milestone 2',
        description:
          'Lorem ipsum dolor sit amet consectetur. Sapien placerat mauris cras commodo faucibus nisl magna in',
        deliveryDate: 'November 24, 2023',
        amount: 150000,
      },
    ],
    totals: {
      subtotal: 300000,
      tax: 0,
      shipping: 0,
      total: 300000,
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    } else {
      // Navigate to finalize payment page
      router.push(`/finalize-payment?orderId=${data.id}`);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    } else {
      // Handle reject logic
      console.log('Invoice rejected');
    }
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-xl px-6 py-8">
      {/* Title */}
      <h1 className="text-xl font-semibold mb-6">Payment Invoice</h1>

      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b pb-6">
        <div>
          <p className="text-xs text-gray-500">Invoice Number</p>
          <p className="font-medium">{data.id}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Issue Date</p>
          <p className="font-medium">{data.issueDate}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Due Date</p>
          <p className="font-medium">{data.dueDate}</p>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {/* Seller */}
        <div className="border rounded-lg p-4">
          <p className="text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Initiator
          </p>
          <p className="mt-3 text-sm text-gray-500">Seller</p>
          <p className="font-semibold">{data.seller.name}</p>
          <p className="text-gray-500 text-sm">{data.seller.email}</p>
        </div>

        {/* Buyer */}
        <div className="border rounded-lg p-4">
          <p className="text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Counterparty
          </p>
          <p className="mt-3 text-sm text-gray-500">Buyer</p>
          <p className="font-semibold">{data.buyer.name}</p>
          <p className="text-gray-500 text-sm">{data.buyer.email}</p>
        </div>
      </div>

      {/* Items */}
      {data.items.map((item, index) => (
        <div key={item.id} className="border rounded-lg overflow-hidden mb-4">
          <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Item {index + 1}</div>

          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold">Description</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold">Quantity</p>
                <p>{item.quantity}</p>
              </div>

              <div>
                <p className="text-xs font-semibold">Price</p>
                <p>{formatCurrency(item.price)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Milestones */}
      <h2 className="text-sm font-medium mt-8 mb-4">Payment Milestones</h2>

      <div className="space-y-4">
        {data.milestones.map((milestone, index) => (
          <div key={milestone.id} className="border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">{milestone.title}</p>
            <p className="text-sm text-gray-600">{milestone.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
              <div>
                <p className="text-xs font-semibold">Delivery Date</p>
                <p>{milestone.deliveryDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold">Amount</p>
                <p>{formatCurrency(milestone.amount)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-8 text-sm">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(data.totals.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax ({((data.totals.tax / data.totals.subtotal) * 100).toFixed(0)}%)</span>
            <span>{formatCurrency(data.totals.tax)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(data.totals.shipping)}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total Amount</span>
            <span>{formatCurrency(data.totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Approval Section */}
      <div className="border rounded-xl p-6 mt-10 bg-[#E6E6E6]">
        <p className="font-semibold mb-2">Approve Transaction</p>
        <p className="text-sm text-gray-600 mb-6">
          The buyer/seller has created a payment. Make sure you inspect the details before
          approving.
        </p>

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
      </div>

      {/* Footer */}
      <p className="center text-xs text-gray-500 mt-10">
        If you have any questions about this invoice, please contact us at support@example.com
      </p>
    </div>
  );
}
