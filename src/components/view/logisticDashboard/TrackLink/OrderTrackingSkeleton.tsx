import React from 'react';

const OrderTrackingSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 ml-4">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="px-4 py-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse mb-3" />
              {/* Label */}
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Pick Up Details Section */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between cursor-pointer">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Details Content */}
        <div className="px-4 py-4 space-y-6 border-t border-gray-100">
          {/* Seller Name Row */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Address Row */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Pickup Date & Time Row */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-4 w-28 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="h-5 w-48 bg-gray-100 rounded animate-pulse" />
          </div>

          {/* Contact Seller Row */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
              <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details Section */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between cursor-pointer">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingSkeleton;
