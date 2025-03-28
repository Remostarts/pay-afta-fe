'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { DataTable } from './DataTable';

export type Payment = {
  id: string;
  date: string;
  amount: number;
  status: string;
  transactionType: string;
};

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

      const style =
        {
          Successful:
            'bg-[#E8FDEF] rounded-full text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
        }[status] ||
        'bg-red-200 rounded-full text-red-600 text-center py-1 text-sm font-medium font-inter';

      return <div className={`${style} `}>{status}</div>;
    },
  },
];

const tData = [
  {
    id: '1',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
  {
    id: '2',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Successful',
    transactionType: 'Track Link',
  },
  {
    id: '3',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
  {
    id: '4',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
  {
    id: '6',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Successful',
    transactionType: 'Card Funded',
  },
  {
    id: '7',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '21-02-2025, 02:24pm',
    amount: 500000,
    status: 'Failed',
    transactionType: 'Credit',
  },
];

export default function Transcations() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function handlePageChange(pageNumber: number, transactionType: string) {
    try {
      console.log('page no., ', pageNumber, ' transaction type, ', transactionType);
      setTimeout(() => {
        setData(tData);
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange(1, 'All');
  }, []);

  return (
    <section>
      <div className="rounded-md bg-white p-5">
        <DataTable
          columns={columns}
          data={data}
          lable={'Transaction History'}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
