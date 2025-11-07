import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* 🔹 Reusable shimmer effect */
const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={cn('relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800', className)}
  >
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-600/20"
      animate={{ translateX: ['-100%', '100%'] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
    />
  </div>
);

/* 🔹 Card skeleton */
const StatCardSkeleton = () => (
  <div className="flex flex-col justify-between rounded-2xl p-4 sm:p-6 bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 w-full h-[110px] sm:h-[130px]">
    <Shimmer className="h-4 w-1/3 mb-2" />
    <Shimmer className="h-5 w-1/2 mb-2" />
    <Shimmer className="h-6 w-1/4" />
  </div>
);

/* 🔹 Delivery Analysis item */
const AnalysisItemSkeleton = () => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 sm:p-6 flex-1 min-w-[120px] sm:min-w-[160px]">
    <Shimmer className="h-3 w-12 mb-3" />
    <Shimmer className="h-6 w-8 rounded-full" />
  </div>
);

/* 🔹 Order card skeleton */
const OrderCardSkeleton = () => (
  <div className="flex flex-col justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 sm:p-6 w-full sm:w-[260px] shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <Shimmer className="h-4 w-1/3" />
      <Shimmer className="h-4 w-1/4" />
    </div>

    <div className="flex flex-col gap-3 mb-4">
      <Shimmer className="h-3 w-3/4" />
      <Shimmer className="h-3 w-2/3" />
      <Shimmer className="h-3 w-1/2" />
    </div>

    <div className="flex gap-2">
      <Shimmer className="h-8 w-1/2 rounded-full" />
      <Shimmer className="h-8 w-1/2 rounded-full" />
    </div>
  </div>
);

/* 🔹 Main skeleton component */
export default function DashboardSkeleton() {
  return (
    <div className="w-full px-3 sm:px-6 md:px-8 py-6 space-y-8 animate-in fade-in duration-500">
      {/* Wallet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Delivery Analysis */}
      <div>
        <Shimmer className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <AnalysisItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Awaiting Confirmation */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Shimmer className="h-4 w-40" />
          <Shimmer className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
