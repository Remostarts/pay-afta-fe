'use client';
import { Transaction } from '@/types/general.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const route = useRouter();

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center font-inter text-lg font-semibold text-[#333333]">
          Recent Transactions
        </h2>
        <button
          className="font-inter text-sm font-bold text-[#6B6DFA]"
          onClick={() => route.push('/dashboard/wallets')}
        >
          VIEW ALL
        </button>
      </div>

      <div className="">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="flex gap-4 border-b pb-4 last:border-b-0">
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
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-inter font-semibold">{tx.type}</h3>
                  <span className="font-inter text-2xl font-semibold">
                    {tx.amount.toLocaleString()} {tx.currency}
                  </span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="mb-2 font-inter text-sm font-medium text-gray-600">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                  <span
                    className={`rounded-full p-1 px-4 font-inter text-sm ${
                      tx.status === 'SUCCESS'
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-80 items-center justify-center">
            <Image
              src="/assets/dashboard/Dashboard/no-transaction-history.svg"
              alt="no payment history"
              width={139}
              height={146.14}
            />
          </div>
        )}
      </div>
    </div>
  );
}
