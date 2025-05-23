'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';

import { DataTable } from './DataTable';
import MilestoneDialog from './MilestoneDialog';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useGeneral } from '@/context/generalProvider';
import page from '@/app/(auth)/forget-pass/page';
import { formatISODateToReadable } from '@/helpers/utils/makeTimeReadable';

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Order = {
  id: string;
  createdAt: string;
  type: string;
  transactionType: 'Product' | 'Services';
  amount: number;
  payment: string;
  buyer: User;
  seller: User;
  name: string;
  status: string;
};

export default function TrackLink() {
  const [isSelectedTransaction, setIsSelectedTransaction] = useState<boolean>(false);
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactionType, setTransactionType] = useState<string>('');
  const router = useRouter();
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  console.log('🌼 🔥🔥 TrackLink 🔥🔥 orders🌼', orders);

  const { session, user } = useGeneral();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <div>{formatISODateToReadable(row.original.createdAt)}</div>,
    },
    {
      accessorKey: 'sssd',
      header: 'Your Role',
      cell: ({ row }) => (
        <div>
          {row.original.buyer.id === user?.id
            ? 'Buyer'
            : row.original.seller.id === user?.id
              ? 'Seller'
              : 'Unknown'}
        </div>
      ),
    },
    {
      accessorKey: 'transactionType',
      header: 'Transaction Type',
      cell: ({ row }) => <div>{row.original.transactionType}</div>,
    },
    {
      accessorKey: 'transactionType2',
      header: 'Milestone Payment',
      cell: ({ row }) =>
        row.original.transactionType === 'Product' ? (
          <span className="rounded-md bg-red-400 px-4 py-1 text-white">No</span>
        ) : row.original.transactionType === 'Services' ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-blue-600 hover:underline" onClick={handleMilestoneDialog}>
                View
              </button>
            </DialogTrigger>
            {isMilestoneDialogOpen && <MilestoneDialog />}
          </Dialog>
        ) : (
          <span className="rounded-md bg-red-500 px-2 py-1 text-white">Unknown</span>
        ),
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
      cell: ({ row }) => <div>{row.original.payment}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount (₦)',
      cell: ({ row }) => <div>{row.original.amount}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.original.status}</div>,
    },
    {
      accessorKey: 'view',
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

  async function handlePageChange(page: number, transactionType: string, status: string) {
    try {
      console.log('page no.', page, ' transaction type ', transactionType, 'status', status);
      setIsLoading(true);

      // setInvoiceHPage(page);

      console.log('🌼 🔥🔥 handleFilterChange 🔥🔥 page🌼', page);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-by-user?page=${page}&limit=8`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: session?.accessToken as string,
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching invoice history request: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🌼 🔥🔥 handleLoadInvoiceHistory 🔥🔥 data🌼', data);

      setOrders(data?.data?.data);
      setIsLoading(false);
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
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-by-user?page=${page}&limit=8`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         authorization: session?.accessToken as string,
  //       },
  //       cache: 'no-store',
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`Error fetching invoice history request: ${response.statusText}`);
  //   }

  //   const data = await response.json();
  //   console.log('🌼 🔥🔥 handleLoadInvoiceHistory 🔥🔥 data🌼', data);

  //   // setOrders(data?.data);
  //   setIsLoading(false);
  // };

  return (
    <section className="rounded-md bg-white p-5">
      <DataTable
        columns={columns}
        data={orders}
        lable={'Track Link'}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
