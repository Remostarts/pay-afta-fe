'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ReDataTable } from '../shared/ReDateTable';

import { TOrder, TOrderResponse } from '@/types/admin/orders.type';
import { formatISODateToReadable } from '@/helpers/utils/makeTimeReadable';

const columns: ColumnDef<TOrder>[] = [
  {
    accessorKey: 'transactionType',
    header: 'TYPE',
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE',
    cell: ({ row }) => <div>{formatISODateToReadable(row.original.createdAt)}</div>,
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          AGREEMENT: 'bg-[#E0F7FA] text-[#00796B] text-center py-1 text-sm font-medium font-inter',
          PAYMENT: 'bg-[#FFF3E0] text-[#F57C00] text-center py-1 text-sm font-medium font-inter',
          SHIPPING: 'bg-[#E3F2FD] text-[#1976D2] text-center py-1 text-sm font-medium font-inter',
          DELIVERY: 'bg-[#F1F8E9] text-[#33691E] text-center py-1 text-sm font-medium font-inter',
          CLOSED: 'bg-[#ECEFF1] text-[#455A64] text-center py-1 text-sm font-medium font-inter',
          DISPUTED: 'bg-[#FFEBEE] text-[#C62828] text-center py-1 text-sm font-medium font-inter',
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

export default function UserPaymentOrder({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [orders, setOrders] = useState<TOrderResponse>({} as TOrderResponse);

  const handleOrderFilterChange = async (
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/orders?createdAt=${params?.selectedDate === 'all' ? '' : params?.selectedDate}&sortBy=createdAt&sortOrder=desc&page=${params?.pageNumber}&limit=${pageSize}&startDate=${startDate}&endDate=${endDate}&userId=${userId}`,
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
        setOrders(data?.data);
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
    handleOrderFilterChange({ pageNumber: 1 });
  }, [userId]);

  return (
    <section>
      <div className="grid grid-cols-2 gap-4">
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Total Order</p>
          <p className="font-inter text-xl font-semibold">{orders?.meta?.total}</p>
        </div>
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Pending Order</p>
          <p className="font-inter text-xl font-semibold">{orders?.meta?.pending}</p>
        </div>
      </div>
      <div>
        <div className="rounded-md bg-white p-5">
          <ReDataTable
            columns={columns}
            data={orders?.data}
            isLoading={isLoading}
            onPageChange={handleOrderFilterChange}
            rowClickMode="none"
            label="History"
            count={orders?.meta?.total}
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
