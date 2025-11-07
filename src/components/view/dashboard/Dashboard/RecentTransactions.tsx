'use client';
import { Transaction } from '@/types/general.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export default function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  const router = useRouter();

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAILED':
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-inter text-lg font-semibold text-[#333333]">Recent Transactions</h2>
        <button
          onClick={() => router.push('/dashboard/wallets')}
          className="font-inter text-sm font-bold text-[#6B6DFA] hover:text-[#5759e6] transition"
        >
          VIEW ALL
        </button>
      </div>

      {/* List */}
      {transactions.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 py-4 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
            >
              <div className="shrink-0">
                <Image
                  src={
                    tx.type === 'DEPOSIT'
                      ? '/assets/dashboard/Dashboard/credit.svg'
                      : tx.type === 'WITHDRAWAL'
                        ? '/assets/dashboard/Dashboard/withdrawal.svg'
                        : '/assets/dashboard/Dashboard/credit.svg'
                  }
                  alt={tx.type}
                  width={48}
                  height={48}
                  priority
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-inter font-semibold capitalize">
                    {tx.type.replace('_', ' ')}
                  </h3>
                  <span className="font-inter text-lg sm:text-xl font-semibold text-gray-800">
                    {tx.amount.toLocaleString()} {tx.currency}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-inter text-xs sm:text-sm text-gray-600">
                    {formatDate(tx.createdAt)}
                  </p>
                  <span
                    className={`font-inter text-xs sm:text-sm px-4 py-1 rounded-full font-medium ${getStatusStyle(
                      tx.status
                    )}`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center">
          <Image
            src="/assets/dashboard/Dashboard/no-transaction-history.svg"
            alt="No transaction history"
            width={139}
            height={146}
          />
          <p className="mt-4 text-sm text-gray-500">No recent transactions</p>
        </div>
      )}
    </div>
  );
}
