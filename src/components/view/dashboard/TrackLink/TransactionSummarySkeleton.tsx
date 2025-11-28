'use client';

const Shimmer =
  'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800';

// Reusable Component
const SkeletonBar = ({
  width = 'w-full',
  height = 'h-4',
  className,
}: {
  width?: string;
  height?: string;
  className?: string;
}) => <div className={`${height} ${width} rounded-lg ${Shimmer} ${className}`} />;

export default function TransactionSummarySkeleton() {
  return (
    <section className="flex flex-col lg:flex-row gap-6 p-6">
      {/* LEFT CARD */}
      <div className="w-full lg:flex-1 rounded-xl bg-card border border-border shadow-sm p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <SkeletonBar width="w-48" height="h-7" />
          <div className="flex gap-3">
            <SkeletonBar width="w-32" height="h-5" />
            <SkeletonBar width="w-40" height="h-5" />
          </div>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center mt-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              {i !== 4 && (
                <div
                  className={`absolute top-[16px] left-[50%] w-full h-1 hidden sm:block ${Shimmer}`}
                />
              )}
              <div
                className={`h-10 w-10 rounded-full border-2 border-slate-300 dark:border-slate-700 shadow-sm ${Shimmer}`}
              />
              <SkeletonBar width="w-14" height="h-3" className="mt-3" />
            </div>
          ))}
        </div>

        {/* Agreement Section */}
        <div className="space-y-4">
          <SkeletonBar width="w-56" height="h-6" />
          <div className="space-y-3">
            <SkeletonBar />
            <SkeletonBar width="w-5/6" />
            <SkeletonBar width="w-4/6" />
          </div>
          <SkeletonBar width="w-52" height="h-4" /> {/* Download Link */}
        </div>

        {/* Checkbox text */}
        <div>
          <SkeletonBar width="w-64" />
        </div>

        {/* Agreement Status Box */}
        <div className="border border-border rounded-xl p-4 space-y-3">
          <SkeletonBar width="w-48" height="h-5" />
          <SkeletonBar width="w-32" height="h-4" />
          <SkeletonBar width="w-24" height="h-4" />
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
          <SkeletonBar height="h-11" className="flex-1" />
          <SkeletonBar height="h-11" className="flex-1" />
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-[350px] rounded-xl bg-card border border-border shadow-sm p-6 space-y-6">
        <SkeletonBar width="w-48" height="h-6" />

        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBar width="w-32" height="h-3" />
              <SkeletonBar width="w-24" height="h-4" />
            </div>
          ))}
        </div>

        {/* Item Box */}
        <div className="border border-border rounded-xl p-4 space-y-3">
          <SkeletonBar width="w-36" height="h-4" />
          <SkeletonBar width="w-20" height="h-4" />
          <SkeletonBar width="w-14" height="h-4" />
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-border">
          <SkeletonBar width="w-24" height="h-5" />
        </div>
      </div>
    </section>
  );
}
