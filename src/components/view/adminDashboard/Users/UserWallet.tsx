'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ReDataTable } from '../shared/ReDateTable';

import { Transaction, TransactionResponse } from '@/types/admin/transactions.type';
import { formatISODateToReadable } from '@/helpers/utils/makeTimeReadable';

export type Payment = {
  type: string;
  amount: string;
  date: string;
  status: string;
};

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'type',
    header: 'TYPE',
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE',
    cell({ row }) {
      return <div>{formatISODateToReadable(row?.original?.createdAt)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          SUCCESSFUL: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          PENDING: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          FAILED: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: {
    Status: string;
  };
}

export default function UserWallet({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [transactions, setTransactions] = useState<TransactionResponse>({} as TransactionResponse);

  const handleTransactionsFilterChange = async (
    params: PageChangeParams = {
      pageNumber: 1,
      selectedDate: '',
      Status: { Status: '' },
    }
  ) => {
    console.log('🌼 🔥🔥 handleTransactionFilterChange 🔥🔥 params🌼', params);

    // Optional: Handle filter change
    setIsLoading(true);

    let startDate, endDate;

    // Check if the value is a date range like "May 5, 2025 - May 7, 2025"
    if (params?.selectedDate && params?.selectedDate?.includes(' - ')) {
      const date = params?.selectedDate?.split(' - ');

      const startDateI = new Date(date[0]);
      const endDateI = new Date(date[1]);

      const formattedStart = startDateI.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const formattedEnd = endDateI.toISOString().split('T')[0]; // "YYYY-MM-DD"

      startDate = formattedStart;
      endDate = formattedEnd;
      params.selectedDate = '';
    }

    console.log('🌼 🔥🔥 Users 🔥🔥 startDate🌼', startDate);
    console.log('🌼 🔥🔥 Users 🔥🔥 endDate🌼', endDate);

    setPage(params?.pageNumber || 1);

    console.log('🌼 🔥🔥 handleFilterChange 🔥🔥 page🌼', page);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/transactions?createdAt=${params?.selectedDate === 'all' ? '' : params?.selectedDate}&sortBy=createdAt&sortOrder=desc&page=${params?.pageNumber}&limit=${pageSize}&startDate=${startDate}&endDate=${endDate}&userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // authorization: session?.accessToken as string,
          },
          cache: 'no-store',
        }
      );
      const data = await response.json();

      console.log('🌼 🔥🔥 handleTransactionFilterChange 🔥🔥 data🌼', data);

      if (data?.success) {
        setTransactions(data?.data);
      } else {
        toast.error(data?.errorName || 'Failed to load users');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleTransactionsFilterChange({ pageNumber: 1 });
  }, [userId]);

  return (
    <section>
      <div className="grid grid-cols-2 gap-4">
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Balance</p>
          <p className="font-inter text-xl font-semibold">₦0.00</p>
        </div>
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Escrow Balance</p>
          <p className="font-inter text-xl font-semibold">₦0.00</p>
        </div>
      </div>
      <div>
        <div className="rounded-md bg-white p-5">
          <ReDataTable
            columns={columns}
            data={transactions?.data}
            isLoading={isLoading}
            onPageChange={handleTransactionsFilterChange}
            rowClickMode="none"
            label="Transactions"
            count={transactions?.meta?.total}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            dateFilter={{
              enabled: true,
              defaultValue: '',
            }}
          />
        </div>
      </div>
    </section>
  );
}
