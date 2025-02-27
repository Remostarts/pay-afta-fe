'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { DataTable } from './DataTable';
import TransactionsSummary from './TransactionsSummary';

export type Payment = {
  id: string;
  date: string;
  name: string;
  type: string;
  amount: number;
  status: string;
  payment: string;
};

const tData = [
  {
    id: '1',
    name: 'adsfj lasdfj',
    date: '24-10-2024, 10:23pm',
    type: 'Buyer',
    amount: 500000.0,
    status: 'Closed',
    payment: 'In Escrow',
    action: 'View',
  },
  {
    id: '2',
    name: 'adsfj',
    date: '24-10-2024, 10:23pm',
    type: 'Seller',
    amount: 500000.0,
    status: 'Closed',
    payment: 'Paid',
    action: 'View',
  },
  {
    id: '3',
    name: 'adsfj lorem2',
    date: '24-10-2024, 10:23pm',
    type: 'Buyer',
    amount: 500000.0,
    status: 'Agreement',
    payment: 'Released',
    action: 'View',
  },
  {
    id: '4',
    name: 'adsfj kjjasdf',
    date: '24-10-2024, 10:23pm',
    type: 'Buyer',
    amount: 500000.0,
    status: 'Agreement',
    payment: 'Refunded',
    action: 'View',
  },
  {
    id: '5',
    name: 'adsfalskdkfj lasdfj',
    date: '24-10-2024, 10:23pm',
    type: 'Seller',
    amount: 500000.0,
    status: 'Payment',
    payment: 'Released',
    action: 'View',
  },
  {
    id: '6',
    name: 'adsfj lakksfd lasdfj',
    date: '24-10-2024, 10:23pm',
    type: 'Seller',
    amount: 500000.0,
    status: 'Shipping',
    payment: 'Paid',
    action: 'View',
  },
  {
    id: '7',
    name: 'adsfj lasdfj asdl',
    date: '24-10-2024, 10:23pm',
    type: 'Buyer',
    amount: 500000.0,
    status: 'Shipping',
    payment: 'Paid',
    action: 'View',
  },
  {
    id: '8',
    name: 'adsfj lasdfj',
    date: '24-10-2024, 10:23pm',
    type: 'Buyer',
    amount: 500000.0,
    status: 'Agreement',
    payment: 'Released',
    action: 'View',
  },
  {
    id: '9',
    name: 'adsfj lasdfj',
    date: '24-10-2024, 10:23pm',
    type: 'Seller',
    amount: 500000.0,
    status: 'Dispute',
    payment: 'Refunded',
    action: 'View',
  },
  {
    id: '10',
    name: 'adsfj lasdfj',
    date: '24-10-2024, 10:23pm',
    type: 'Seller',
    amount: 500000.0,
    status: 'Dispute',
    payment: 'Refunded',
    action: 'View',
  },
];

export default function TrackLink() {
  const [isSelectedTransaction, setIsSelectedTransaction] = useState<boolean>(false);
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

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
    },
    {
      accessorKey: 'amount',
      header: 'Amount (₦)',
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <button
          onClick={() => handleViewTransaction(true)}
          className="text-blue-600 hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  const handleViewTransaction = (p0: boolean) => {
    // console.log(transaction);
    setIsSelectedTransaction(true);
  };

  const handleBackToTable = () => {
    setIsSelectedTransaction(false);
  };
  return (
    <section className="rounded-md bg-white p-5">
      {isSelectedTransaction ? (
        <TransactionsSummary onBack={handleBackToTable} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          lable={'Track Link'}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}
