'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { DataTable } from './DataTable';
import MilestoneDialog from './MilestoneDialog';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export type Payment = {
  id: string;
  date: string;
  name: string;
  type: string;
  transactionType: string;
  milestonePayment: string;
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
    transactionType: 'Product',
    milestonePayment: 'No',
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
    transactionType: 'Product',
    milestonePayment: 'No',
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
    transactionType: 'Service',
    milestonePayment: 'Yes',
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
    transactionType: 'Service',
    milestonePayment: 'Yes',
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
    transactionType: 'Product',
    milestonePayment: 'No',
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
    transactionType: 'Product',
    milestonePayment: 'No',
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
    transactionType: 'Service',
    milestonePayment: 'Yes',
    amount: 500000.0,
    status: 'Shipping',
    payment: 'Paid',
    action: 'View',
  },
];

export default function TrackLink() {
  const [isSelectedTransaction, setIsSelectedTransaction] = useState<boolean>(false);
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactionType, setTransactionType] = useState<string>('');
  const router = useRouter();
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Payment[]>([]);

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
      accessorKey: 'transactionType',
      header: 'Transaction Type',
    },
    {
      accessorKey: 'milestonePayment',
      header: 'Milestone Payment',
      cell: ({ row }) =>
        row.original.milestonePayment === 'Yes' ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-blue-600 hover:underline" onClick={handleMilestoneDialog}>
                View
              </button>
            </DialogTrigger>
            {isMilestoneDialogOpen && <MilestoneDialog />}
          </Dialog>
        ) : (
          <span className="rounded-md bg-red-500 px-2 py-1 text-white">No</span>
        ),
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
          onClick={() => handleViewTransaction(true, row.original.transactionType, row.original.id)}
          className="text-blue-600 hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  function handlePageChange(pageNumber: number, transactionType: string, status: string) {
    try {
      console.log('page no.', pageNumber, ' transaction type ', transactionType, 'status', status);
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
    handlePageChange(1, 'All', 'All');
  }, []);

  const handleViewTransaction = (p0: boolean, transactionType: string, id: string) => {
    console.log('transaction type', transactionType, 'id', id);
    router.push(`/dashboard/track-links/${transactionType}/${id}`);
  };

  const handleMilestoneDialog = () => {
    setIsMilestoneDialogOpen(true);
  };

  // useEffect(() => {
  //   handleLoadInvoiceHistory();
  // }, []);

  // const handleLoadInvoiceHistory = async (filter: string = 'All', page: number = 1) => {
  //   console.log('🌼 🔥🔥 handleFilterChange 🔥🔥 filter🌼', filter, page);
  //   // Optional: Handle filter change
  //   setIsLoading(true);

  //   // setInvoiceHPage(page);

  //   console.log('🌼 🔥🔥 handleFilterChange 🔥🔥 page🌼', page);

  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/all?page=${page}&limit=8`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         // authorization: session?.accessToken as string,
  //       },
  //       cache: 'no-store',
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`Error fetching invoice history request: ${response.statusText}`);
  //   }

  //   const data = await response.json();
  //   console.log('🌼 🔥🔥 handleLoadInvoiceHistory 🔥🔥 data🌼', data);

  //   setOrders(data?.data);
  //   setIsLoading(false);
  // };

  return (
    <section className="rounded-md bg-white p-5">
      <DataTable
        columns={columns}
        data={data}
        lable={'Track Link'}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
