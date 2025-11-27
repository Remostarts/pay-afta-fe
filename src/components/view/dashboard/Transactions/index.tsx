'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { ReDataTable } from '../shared/ReDateTable';

import { TransactionReceipt } from './TransactionReceipt';
import { getUserTransactions } from '@/lib/actions/root/user.action';
import WalletTopcard from './WalletTopcard';

export type Payment = {
  id: string;
  date: string;
  amount: number;
  status: string;
  transactionType: string;
};

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function Transcations() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);
  const pageSize = 8;

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'transactionType',
      header: 'Transcation Type',
    },
    {
      accessorKey: 'amount',
      header: 'Amount (₦)',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const payment = row.original;

        const style =
          {
            Successful:
              'bg-[#E8FDEF] rounded-full text-[#0F973C] text-center py-1 text-sm font-medium font-inter cursor-pointer',
          }[status] ||
          'bg-red-200 rounded-full text-red-600 text-center py-1 text-sm font-medium font-inter';

        return (
          <button
            className={`${style} w-full`}
            onClick={() => {
              if (status === 'Successful') {
                setSelectedTransaction(payment);
                setShowReceipt(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (status === 'Successful') {
                  setSelectedTransaction(payment);
                  setShowReceipt(true);
                }
              }
            }}
            tabIndex={0}
            aria-label={`Transaction status: ${status}`}
          >
            {status}
          </button>
        );
      },
    },
  ];

  async function handlePageChange(params: PageChangeParams = {}) {
    const { pageNumber = 1, selectedDate = 'Today', Status = 'Active' } = params;

    try {
      setIsLoading(true);

      const res = await getUserTransactions(pageNumber, 10);

      setData(res?.data?.transactions || []);
      setTotalCount(res?.data?.totalCount || 0);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setData([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });
  }, []);

  return (
    <section>
      <div className="mb-5">
        <WalletTopcard />
      </div>

      <div className="rounded-md bg-white p-5">
        <ReDataTable
          label="Transaction History"
          columns={columns}
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          rowClickMode="none"
          count={totalCount}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          dateFilter={{
            enabled: true,
            defaultValue: 'All',
          }}
          filters={[
            {
              name: 'Transaction Type',
              placeholder: 'Transaction Type',
              options: [
                { label: 'All', value: 'All' },
                { label: 'Withdrawal', value: 'Withdrawal' },
                { label: 'Bank transfer', value: 'Bank transfer' },
                { label: 'Delivery Payment', value: 'Delivery Payment' },
                { label: 'Escrow holding', value: 'Escrow holding' },
                { label: 'Escrow withdrawal', value: 'Escrow withdrawal' },
              ],
            },
          ]}
        />
      </div>

      {selectedTransaction && (
        <TransactionReceipt
          onClose={() => {
            setShowReceipt(false);
            setSelectedTransaction(null);
          }}
          amount={selectedTransaction.amount.toString()}
          date={selectedTransaction.date}
          status={selectedTransaction.status}
          transactionType={selectedTransaction.transactionType}
          bankName="Access Bank"
          accountNumber="0123456789"
          accountName="John Doe"
          narration="Payment for services"
          transactionId={selectedTransaction.id}
        />
      )}
    </section>
  );
}
