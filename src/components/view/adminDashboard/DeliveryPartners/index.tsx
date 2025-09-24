'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { ReDataTable } from '../shared/ReDateTable';
import TransactionModal from '../shared/TransactionModal';
import { toast } from 'sonner';
import { TUser, UsersApiResponse } from '@/types/admin/users.type';
import { formatISODateToReadable } from '@/helpers/utils/makeTimeReadable';

export type Payment = {
  userId: string;
  name: string;
  email: string;
  date: string;
  status: string;
};

const columns: ColumnDef<TUser>[] = [
  {
    accessorKey: 'id',
    header: 'USER ID',
  },
  {
    accessorKey: 'firstName',
    header: 'NAME',
    cell({ row }) {
      return (
        <div>
          {row?.original?.firstName} {row?.original?.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE JOINED',
    cell({ row }) {
      return <div>{formatISODateToReadable(row?.original?.createdAt)}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row?.getValue('status') as string;

      const styles =
        {
          active: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          pending: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          suspended: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
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

export default function DeliveryPartner() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [users, setUsers] = useState<UsersApiResponse>({} as UsersApiResponse);

  const handleUserFilterChange = async (
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users?status=${params?.Status?.Status === 'all' ? '' : params?.Status?.Status}&createdAt=${params?.selectedDate === 'all' ? '' : params?.selectedDate}&sortBy=createdAt&sortOrder=desc&page=${params?.pageNumber}&limit=${pageSize}&startDate=${startDate}&endDate=${endDate}&role=logistic`,
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
        setUsers(data?.data);
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
    handleUserFilterChange({ pageNumber: 1 });
  }, []);

  return (
    <section>
      <div className="mt-3 rounded-md bg-white p-5">
        <ReDataTable
          columns={columns}
          data={users?.data}
          isLoading={isLoading}
          onPageChange={handleUserFilterChange}
          rowClickMode="link"
          getLinkHref={(row) => `/admin-dashboard/delivery-partners/${row?.original?.id}`}
          count={users?.meta?.total}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          dateFilter={{
            enabled: true,
            defaultValue: '',
          }}
          filters={[
            {
              name: 'Status',
              placeholder: 'Select a State',
              options: [
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Suspended', value: 'suspended' },
                { label: 'Pending', value: 'pending' },
              ],
            },
          ]}
          export={{
            enabled: true,
            buttonText: 'Export',
          }}
        />
      </div>
    </section>
  );
}
