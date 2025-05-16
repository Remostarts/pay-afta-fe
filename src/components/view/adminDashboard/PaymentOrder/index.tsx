'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import { ReDataTable } from '../shared/ReDateTable';

import FilterDataSection from './FilterDataSection';
import { DataTable } from './DataTable';

export type Payment = {
  ordersId: string;
  name: string;
  type: string;
  amount: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'ordersId',
    header: 'ORDERS ID',
  },
  {
    accessorKey: 'name',
    header: 'CREATED BY',
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
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
      //   console.log(status);
    },
  },
];

const tData = [
  {
    ordersId: 'US-123456789',
    name: 'John Doe',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    ordersId: 'US-123456789',
    name: 'Abram Lipshutz',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Tiana Bergson',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Cristofer Dias',
    type: 'Services',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Kadin Workman',
    type: 'Services',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Wilson Aminoff',
    type: 'Services',
    amount: '₦200,000.00',
    status: 'Suspended',
  },
  {
    ordersId: 'US-123456789',
    name: 'Phillip Passaquindici Arcand',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Kianna Bator',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Suspended',
  },
  {
    ordersId: 'US-123456789',
    name: 'Tiana Levin',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function PaymentOrder() {
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
          rowClickMode="none"
          count={totalCount}
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
                { label: 'Successful', value: 'Successful' },
                { label: 'Failed', value: 'Failed' },
                { label: 'Suspended', value: 'Suspended' },
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
