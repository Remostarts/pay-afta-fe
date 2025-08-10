'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { ReDataTable } from '../shared/ReDateTable';
import TransactionModal from '../shared/TransactionModal';

import TopCards from './TopCards';

export type Payment = {
  date: string;
  type: string;
  amount: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Pending:
            'bg-[#FCCEEE] text-[#C11574] text-center py-1 text-sm font-medium font-inter rounded-full',
          Paid: 'bg-[#E8FDEF] text-[#0F973C] text-center py-1 text-sm font-medium font-inter rounded-full',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    date: '09-07-2025',
    type: 'Credit',
    amount: '₦200,000.00',
    status: 'Paid',
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function Wallet() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  function handlePageChange(params: PageChangeParams = {}) {
    const { pageNumber = 1, selectedDate = 'Today', Status = 'Active' } = params;
    try {
      console.log({ pageNumber, selectedDate, Status });
      setTimeout(() => {
        setTotalCount(tData.length);
        setData(tData);
        setPage(pageNumber);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
      setData([]);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });

    setData(tData);
  }, []);

  return (
    <section>
      <TopCards />
      <div className="mt-3 rounded-md bg-white p-5">
        <ReDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          label="Recent Transactions"
          onPageChange={handlePageChange}
          rowClickMode="none"
          DialogComponent={TransactionModal}
          count={totalCount}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          dateFilter={{
            enabled: true,
            defaultValue: 'Today',
          }}
          filters={[
            {
              name: 'Status',
              placeholder: 'Select a State',
              options: [
                { label: 'Accepted', value: 'Accepted' },
                { label: 'Picked Up', value: 'Picked Up' },
                { label: 'In Transit', value: 'In Transit' },
                { label: 'Delivered', value: 'Delivered' },
                { label: 'Failed', value: 'Failed' },
              ],
            },
          ]}
        />
      </div>
    </section>
  );
}
