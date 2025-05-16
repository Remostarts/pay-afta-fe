'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ReDataTable } from '../shared/ReDateTable';

import { TUser, UsersApiResponse } from '@/types/admin/users.type';

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
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Active: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Suspended: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
    },
  },
];

const tData = [
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'Abram Lipshutz',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Bergson',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Cristofer Dias',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kadin Workman',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Wilson Aminoff',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Phillip Passaquindici Arcand',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kianna Bator',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
];

// Define the type for page change parameters
interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: {
    Status: string;
  };
}

export default function Users() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [users, setUsers] = useState<UsersApiResponse>({} as UsersApiResponse);

  const handleTransactionFilterChange = async (
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users?status=${params?.Status?.Status === 'all' ? '' : params?.Status?.Status}&createdAt=${params?.selectedDate === 'all' ? '' : params?.selectedDate}&sortBy=createdAt&sortOrder=desc&page=${params?.pageNumber}&limit=2&startDate=${startDate}&endDate=${endDate}`,
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
    handleTransactionFilterChange({ pageNumber: 1 });
  }, []);

  // useEffect(() => {
  //   filterSelectedStatusType();
  // }, [selectedStatusType]);

  //   console.log(filteredDataByStatus);

  //   console.log(selectedStatusType);

  return (
    <section>
      <div className="rounded-md bg-white p-5">
        <ReDataTable
          columns={columns}
          data={users?.data}
          isLoading={isLoading}
          onPageChange={handleTransactionFilterChange}
          rowClickMode="link"
          getLinkHref={(row) => `/admin-dashboard/users/${row?.original?.id}`}
          count={users?.meta?.total}
          page={page}
          setPage={setPage}
          pageSize={2}
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
