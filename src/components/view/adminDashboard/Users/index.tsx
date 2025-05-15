'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { ReDataTable } from '../shared/ReDateTable';

export type Payment = {
  userId: string;
  name: string;
  email: string;
  date: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'userId',
    header: 'USER ID',
  },
  {
    accessorKey: 'name',
    header: 'NAME',
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
  },
  {
    accessorKey: 'date',
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
  Status?: string;
}

export default function Users() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  function handlePageChange(params: PageChangeParams = {}) {
    const { pageNumber = 1, selectedDate = 'Today', Status = 'Active' } = params;
    try {
      console.log({ pageNumber, selectedDate, Status });
      setTimeout(() => {
        setTotalCount(tData.length);
        setData(tData);
        setPage(pageNumber);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
      setData([]);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });

    setData(tData);
  }, []);

  return (
    <section>
      <div className="rounded-md bg-white p-5">
        <ReDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          rowClickMode="link"
          getLinkHref={(row) => `/admin-dashboard/users/${row.original.userId}`}
          count={totalCount}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          dateFilter={{
            enabled: true,
            defaultValue: 'Today',
          }}
          filters={[
            {
              name: 'Status',
              placeholder: 'Select a State',
              options: [
                { label: 'Active', value: 'Active' },
                { label: 'Suspended', value: 'Suspended' },
                { label: 'Pending', value: 'Pending' },
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
