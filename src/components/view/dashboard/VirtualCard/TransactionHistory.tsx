'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';

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
        }[status] || '';

      return <div className={style}>{status}</div>;
    },
  },
];

const tData = [
  {
    id: '1',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '2',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Track Link',
  },
  {
    id: '3',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '4',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
  {
    id: '5',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
  {
    id: '6',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Card Funded',
  },
  {
    id: '7',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '9',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Track Link',
  },
  {
    id: '10',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
];

export default function TransactionHistory() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function handlePageChange(pageNumber: any) {
    try {
      console.log(pageNumber);
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
    handlePageChange(1);
  }, []);

  return (
    <section>
      <div className="rounded-md bg-white p-5">
        <DataTable
          columns={columns}
          data={data}
          lable={'Recent Transaction'}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
