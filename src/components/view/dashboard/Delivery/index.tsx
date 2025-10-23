'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { ReDataTable } from '../../adminDashboard/shared/ReDateTable';

import AssignOrderList from './AssignOrderList';
import DeliveryStats from './DeliveryStats';

export type Payment = {
  date: string;
  deliveryCompany: string;
  amount: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'deliveryCompany',
    header: 'Delivery Company',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Delivered:
            'bg-[#ABEFC6] text-[#067647] text-center py-1 text-sm font-medium font-inter rounded-full',
          Scheduled:
            'bg-[#FFFAEB] text-[#B54708] text-center py-1 text-sm font-medium font-inter rounded-full',
          InTransit:
            'bg-[#D5D9EB] text-[#363F72] text-center py-1 text-sm font-medium font-inter rounded-full',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Delivered',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Scheduled',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'InTransit',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Delivered',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Scheduled',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Scheduled',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'InTransit',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Scheduled',
  },
  {
    date: 'US-123456789',
    deliveryCompany: 'John Doe',
    amount: '₦200,000.00',
    status: 'Scheduled',
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function Delivery() {
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
        // setTotalCount(tData.length);
        // setData(tData);
        // setPage(pageNumber);
        // setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
      setData([]);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });

    // setData(tData);
  }, []);

  return (
    <section className="min-h-screen rounded-md bg-white p-4 md:p-8">
      <DeliveryStats />
      {/* <AssignOrderList /> */}
      <ReDataTable
        label="Deliveries"
        columns={columns}
        data={data}
        isLoading={false}
        onPageChange={handlePageChange}
        rowClickMode="none"
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
      />
    </section>
  );
}
