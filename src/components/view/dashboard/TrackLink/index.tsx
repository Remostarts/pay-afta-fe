'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { ReDataTable } from '../shared/ReDateTable';

import TrackButtonDropdown from './TrackButtonDropdown';
import MilestoneDialog from './MilestoneDialog';

import { useGeneral } from '@/context/generalProvider';
import { formatISODateToReadable } from '@/helpers/utils/makeTimeReadable';
import { getAllOrdersByUser } from '@/lib/actions/order/order.actions';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { OrderDetails } from '@/types/order';

export type User = {
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
  paymentType: string;
  createdBy: string;
  status: string;
  progressHistory?: any[];
};

export default function TrackLink() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 8;

  const { user } = useGeneral();

  console.log(user);

  const resolveStatusStyle = (order: Order) => {
    let { status, progressHistory = [] } = order;
    let label = status;

    // Custom Agreement Logic
    if (status === 'BUYER_AGREED' || status === 'SELLER_AGREED') {
      const buyerConfirmed = progressHistory.some((p: any) => p.status === 'BUYER_AGREED');
      const sellerConfirmed = progressHistory.some((p: any) => p.status === 'SELLER_AGREED');

      if (buyerConfirmed && sellerConfirmed) label = 'Both Agreed';
      else if (buyerConfirmed) label = 'Buyer Agreed';
      else if (sellerConfirmed) label = 'Seller Agreed';
      else label = 'Agreement Pending';

      return { label, bg: 'bg-[#E8FDEF]', text: 'text-[#0F973C]' };
    }

    // General Status Map
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
      SUCCESSFUL: { label: 'Successful', bg: 'bg-[#E8FDEF]', text: 'text-[#0F973C]' },
    };

    return (
      statusMap[status] || {
        label: 'Not Started',
        bg: 'bg-gray-300',
        text: 'text-gray-800',
      }
    );
  };

  console.log(orders);

  const handleMilestoneDialog = () => {
    setIsMilestoneDialogOpen(true);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatISODateToReadable(row.original.createdAt),
    },
    {
      accessorKey: 'role',
      header: 'Your Role',
      cell: ({ row }) =>
        row.original.buyer?.id === user?.id
          ? 'Buyer'
          : row.original.seller?.id === user?.id
            ? 'Seller'
            : 'Guest User',
    },
    {
      accessorKey: 'position',
      header: 'Position',
      cell: ({ row }) => {
        const order = row.original;

        const createdBy = order?.createdBy;
        const buyerId = order?.buyer?.id;
        const sellerId = order?.seller?.id;

        // Determine logged in user's identity in this order
        const isBuyer = user?.id === buyerId;
        const isSeller = user?.id === sellerId;

        // Determine initiator
        const initiatorRole =
          createdBy === buyerId ? 'Buyer' : createdBy === sellerId ? 'Seller' : null;

        let position = 'Unknown';

        if (!isBuyer && !isSeller) {
          position = 'Guest User';
        } else if (isBuyer && initiatorRole === 'Buyer') {
          position = 'Initiator';
        } else if (isSeller && initiatorRole === 'Seller') {
          position = 'Initiator';
        } else {
          position = 'Counterparty';
        }

        return <span className="font-semibold text-gray-700">{position}</span>;
      },
    },
    {
      accessorKey: 'transactionType',
      header: 'Transaction Type',
    },
    // {
    //   accessorKey: 'transactionType2',
    //   header: 'Milestone Payment',
    //   cell: ({ row }) =>
    //     row?.original?.transactionType === 'Product' ? (
    //       <span className="rounded-md bg-red-400 px-4 py-1 text-white">No</span>
    //     ) : row?.original?.transactionType === 'Services' ? (
    //       <Dialog>
    //         <DialogTrigger asChild>
    //           <button className="cursor-pointer text-blue-600" onClick={handleMilestoneDialog}>
    //             View
    //           </button>
    //         </DialogTrigger>
    //         {isMilestoneDialogOpen && <MilestoneDialog />}
    //       </Dialog>
    //     ) : (
    //       <span className="rounded-md bg-red-500 px-2 py-1 text-white">Unknown</span>
    //     ),
    // },

    {
      accessorKey: 'Payment Type',
      header: 'Payment Type',
      cell: ({ row }) => row.original?.paymentType,
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
      cell: ({ row }) => row.original.payment || 'Pending',
    },
    {
      accessorKey: 'amount',
      header: 'Amount (₦)',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { label, bg, text } = resolveStatusStyle(row.original);

        return (
          <span className={`rounded-full px-4 py-1 text-sm font-inter ${bg} ${text}`}>{label}</span>
        );
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <TrackButtonDropdown
          order={row.original as unknown as OrderDetails}
          onOrderUpdate={() => handlePageChange({ pageNumber: page })}
          currentUserId={row.original.id}
        />
      ),
    },
  ];

  // ---------- Pagination + Filters ----------
  async function handlePageChange({
    pageNumber = 1,
    selectedDate = 'All',
    Status = 'All',
    transactionType = 'All',
  } = {}) {
    setIsLoading(true);
    try {
      const data = await getAllOrdersByUser(pageNumber, PAGE_SIZE, Status, transactionType);
      setOrders(data?.data?.data || []);
      setTotalCount(data?.data?.meta?.total || 0);
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });
  }, []);

  return (
    <section className="rounded-md bg-white p-5">
      <ReDataTable
        label="Order History"
        columns={columns}
        data={orders}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        rowClickMode="none"
        count={totalCount}
        page={page}
        setPage={setPage}
        pageSize={PAGE_SIZE}
        filters={[
          {
            name: 'Transaction Type',
            placeholder: 'Transaction Type',
            options: [
              { label: 'All', value: 'All' },
              { label: 'Product', value: 'Product' },
              { label: 'Services', value: 'Services' },
            ],
          },
          {
            name: 'Status',
            placeholder: 'Order Status',
            options: [
              { label: 'All', value: 'All' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Paid', value: 'PAID' },
              { label: 'Completed', value: 'COMPLETED' },
              { label: 'Disputed', value: 'DISPUTED' },
              { label: 'Canceled', value: 'CANCELED' },
            ],
          },
        ]}
      />
    </section>
  );
}
