'use client';

import React from 'react';

interface SummaryProps {
  loading?: boolean; // ← New prop
  showActions?: boolean;
  name?: string;
  paymentMethod?: string;
  deliveryDate?: string;
  item?: string;
  quantity?: number;
  price?: number;
}

export default function ServiceSummary({
  loading = false,
  showActions = false,
  name,
  paymentMethod,
  deliveryDate,
  item,
  quantity,
  price,
}: SummaryProps) {
  // Only show milestones if not loading and showActions is true
  const milestones =
    showActions && !loading
      ? [
          { id: 1, date: 'Dec 25, 2024', amount: 250000 },
          { id: 2, date: 'Jan 10, 2025', amount: 350000 },
        ]
      : [];

  if (loading) {
    return (
      <div className="w-full rounded-xl p-6 shadow-sm">
        {/* Title Skeleton */}
        <div className="mb-5 h-7 animate-pulse rounded bg-gray-200" />

        <div className="space-y-5">
          {/* Basic Info Skeletons (3 fields) */}
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="mt-1 h-5 animate-pulse rounded bg-gray-200" />
            </div>
          ))}

          {/* Item Section Skeleton */}
          <div>
            <div className="mb-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="h-5 w-3/5 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>

          {/* Milestones Skeleton (if showActions) */}
          {showActions && (
            <div>
              <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-4">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold text-gray-900 md:text-2xl">Transaction Summary</h2>

      <div className="space-y-5">
        {/* Basic Info Fields */}
        {[
          { label: 'Name', value: name },
          { label: 'Payment Method', value: paymentMethod },
          { label: 'Delivery Date', value: deliveryDate },
        ].map((field, idx) => (
          <div key={idx}>
            <p className="text-sm font-medium text-gray-500">{field.label}</p>
            <p className="mt-1 text-gray-900">{field.value}</p>
          </div>
        ))}

        {/* Item Details */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-500">Item</p>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-900">{item}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="text-gray-900">{quantity}</span>
              <span className="text-gray-500">Price</span>
              <span className="text-gray-900">₦{price?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Milestones */}
        {showActions && (
          <div>
            <p className="mb-3 text-sm font-medium text-gray-500">Payment Milestones</p>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="rounded-lg border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">{item}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900">{milestone.date}</span>
                    <span className="text-gray-500">Amount</span>
                    <span className="text-gray-900">₦{milestone.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
