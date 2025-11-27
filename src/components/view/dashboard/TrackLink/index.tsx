'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';

import { DataTable } from './DataTable';
import MilestoneDialog from './MilestoneDialog';
import TrackButtonDropdown from './TrackButtonDropdown';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useGeneral } from '@/context/generalProvider';
import page from '@/app/(auth)/forget-pass/page';
import { formatISODateToReadable } from '@/helpers/utils/makeTimeReadable';
import { getAllOrdersByUser } from '@/lib/actions/order/order.actions';

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Order = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  type: string;
  transactionType: 'Product' | 'Services';
  amount: number;
  payment: string;
  buyer: User;
  seller: User;
  name: string;
  status: string;
  progressHistory?: Array<{
    id: string;
    status: string;
    timestamp: string;
    notes: string;
    step: number;
  }>;
};

export type { Order as SimpleOrder };

export default function TrackLink() {
  const [isSelectedTransaction, setIsSelectedTransaction] = useState<boolean>(false);
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactionType, setTransactionType] = useState<string>('');
  const router = useRouter();
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  console.log('🌼 🔥🔥 TrackLink 🔥🔥 orders🌼', orders);

  const { session, user, loadUserData } = useGeneral();

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <div>{formatISODateToReadable(row?.original?.createdAt)}</div>,
    },
    {
      accessorKey: 'sssd',
      header: 'Your Role',
      cell: ({ row }) => (
        <div>
          {row?.original?.buyer?.id === user?.id
            ? 'Buyer'
            : row?.original?.seller?.id === user?.id
              ? 'Seller'
              : 'Unknown'}
        </div>
      ),
    },
    {
      accessorKey: 'transactionType',
      header: 'Transaction Type',
      cell: ({ row }) => <div>{row?.original?.transactionType}</div>,
    },
    {
      accessorKey: 'transactionType2',
      header: 'Milestone Payment',
      cell: ({ row }) =>
        row?.original?.transactionType === 'Product' ? (
          <span className="rounded-md bg-red-400 px-4 py-1 text-white">No</span>
        ) : row?.original?.transactionType === 'Services' ? (
          <Dialog>
            <DialogTrigger asChild>
              <button className="cursor-pointer text-blue-600" onClick={handleMilestoneDialog}>
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
      cell: ({ row }) => <div>{row?.original?.payment || 'Pending'}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount (₦)',
      cell: ({ row }) => <div>{row?.original?.amount}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row?.original?.status;

        // status dynamic label + color map
        // Extended status label logic for Agreement steps
        let statusKey = status;
        let label = '';
        let bg = '';
        let text = '';

        if (status === 'BUYER_AGREED' || status === 'SELLER_AGREED') {
          // Use the proper progressHistory property from the order
          const order = row?.original;
          const progressHistory = order?.progressHistory ?? [];
          // Helper to check if both agreed

          console.log(progressHistory);

          const buyerConfirmed = progressHistory?.some(
            (progress: any) =>
              progress.status === 'BUYER_AGREED' && progress.notes?.includes('Agreement signed')
          );
          const sellerConfirmed = progressHistory?.some(
            (progress: any) =>
              progress.status === 'SELLER_AGREED' && progress.notes?.includes('Agreement signed')
          );
          if (buyerConfirmed && sellerConfirmed) {
            label = 'Both Agreed';
            bg = 'bg-[#E8FDEF]';
            text = 'text-[#0F973C]';
          } else if (buyerConfirmed && !sellerConfirmed) {
            label = 'Buyer Agreed';
            bg = 'bg-[#E8FDEF]';
            text = 'text-[#0F973C]';
          } else if (!buyerConfirmed && sellerConfirmed) {
            label = 'Seller Agreed';
            bg = 'bg-[#E8FDEF]';
            text = 'text-[#0F973C]';
          } else {
            label = 'Agreement Pending';
            bg = 'bg-gray-200';
            text = 'text-gray-800';
          }
        } else {
          const statusMap: Record<string, { label: string; bg: string; text: string }> = {
            PENDING: { label: 'Pending', bg: 'bg-gray-200', text: 'text-gray-800' },
            CANCELED: { label: 'Canceled', bg: 'bg-gray-300', text: 'text-gray-800' },
            PAID: { label: 'Paid', bg: 'bg-[#FCE9E9]', text: 'text-[#0F973C]' },
            REJECTED: { label: 'Rejected', bg: 'bg-red-200', text: 'text-red-700' },
            SHIPPED: { label: 'Shipped', bg: 'bg-[#FFF8E1]', text: 'text-[#FFA000]' },
            DELIVERED: { label: 'Delivered', bg: 'bg-[#E6E7FE]', text: 'text-[#070AC5]' },
            COMPLETED: { label: 'Completed', bg: 'bg-green-100', text: 'text-green-700' },
            CLOSED: { label: 'Closed', bg: 'bg-gray-200', text: 'text-gray-600' },
            DISPUTED_REQUESTED: {
              label: 'Dispute Requested',
              bg: 'bg-[#FFE5EC]',
              text: 'text-[#A81D1C]',
            },
            DISPUTED: { label: 'Disputed', bg: 'bg-[#FFE5EC]', text: 'text-[#C21807]' },
          };
          if (statusMap[status]) {
            label = statusMap[status].label;
            bg = statusMap[status].bg;
            text = statusMap[status].text;
          } else {
            label = 'Not Started';
            bg = 'bg-gray-300';
            text = 'text-gray-800';
          }
        }

        return (
          <div>
            <span className={`rounded-full p-1 px-4 font-inter text-sm ${bg} ${text}`}>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'view',
      header: 'Actions',
      cell: ({ row }) => (
        <TrackButtonDropdown
          order={row?.original}
          onOrderUpdate={() => {
            // Refresh the orders data when an order is updated
            handlePageChange(1, 'All', 'All');
          }}
        />
      ),
    },
  ];

  async function handlePageChange(page: number, transactionType: string, status: string) {
    try {
      console.log('page no.', page, ' transaction type ', transactionType, 'status', status);
      setIsLoading(true);

      // setInvoiceHPage(page);

      const data = await getAllOrdersByUser(page);

      if (!data.success) {
        throw new Error(`Error fetching invoice history request: ${data.statusText}`);
      }

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

  const handleMilestoneDialog = () => {
    setIsMilestoneDialogOpen(true);
  };

  return (
    <section className="rounded-md bg-white p-5">
      <DataTable
        columns={columns}
        data={orders}
        lable={'Order History'}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
