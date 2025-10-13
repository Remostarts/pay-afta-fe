// components/TransactionSummarySkeleton.tsx
import React from 'react';

const TransactionSummarySkeleton = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-md bg-white p-4 max-w-3xl">
        {/* Header skeleton */}
        <div className="flex items-center mb-4">
          <div className="h-6 w-6 rounded bg-gray-200 mr-2" />
          <div className="h-6 w-40 rounded bg-gray-200" />
        </div>

        {/* Loading text skeleton */}
        <div className="h-4 w-24 rounded bg-gray-200 mb-5" />

        {/* Transaction info skeleton */}
        <div className="mb-5 flex items-center justify-between">
          <div className="h-4 w-40 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>

        {/* Stepper skeleton */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="relative flex flex-col items-center">
                {/* Connector Line */}
                {step < 5 && (
                  <div className="absolute left-[50%] top-[15px] h-[2px] w-[100px] bg-gray-200" />
                )}

                {/* Step Circle */}
                <div className="z-10 flex size-8 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-200">
                  <div className="h-4 w-4 rounded-full bg-gray-300" />
                </div>

                {/* Step Label Skeleton */}
                <div className="mt-2 h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
          <div className="h-6 w-48 rounded bg-gray-200 mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Summary sidebar skeleton */}
      <div className="rounded-md max-w-xl bg-white p-4">
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-gray-200" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="h-4 w-24 rounded bg-gray-200 mb-2" />
            <div className="h-10 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionSummarySkeleton;
