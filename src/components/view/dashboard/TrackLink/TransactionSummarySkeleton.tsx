'use client';

const TransactionSummarySkeleton = () => {
  return (
    <section className="flex flex-col gap-6 p-6">
      {/* Main Card */}
      <div className="rounded-xl bg-card shadow-sm border border-border p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          <div className="h-7 w-48 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
        </div>

        <div className="h-5 w-32 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer mb-6" />

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-32 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
            <div className="h-5 w-24 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-32 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
            <div className="h-5 w-24 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          </div>
        </div>

        <div className="w-full mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="relative flex flex-col items-center flex-1">
                {step < 5 && (
                  <div className="absolute left-[50%] top-[16px] h-1 hidden sm:block w-full translate-x-2 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
                )}

                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 animate-shimmer shadow-sm" />

                <div className="mt-3 h-3 w-14 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-6 backdrop-blur-sm">
          <div className="h-7 w-56 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
            <div className="h-4 w-5/6 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
            <div className="h-4 w-4/6 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card shadow-sm border border-border p-6 max-w-sm">
        <div className="space-y-5">
          <div className="h-7 w-40 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
            <div className="h-4 w-5/6 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
            <div className="h-4 w-4/6 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="h-4 w-28 rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer mb-3" />
            <div className="h-11 w-full rounded-lg bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer" />
          </div>
        </div>
      </div>
    </section>
  );
};

export { TransactionSummarySkeleton };
export default TransactionSummarySkeleton;
