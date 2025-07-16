'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { ReDataTable } from '../shared/ReDateTable';
import TransactionModal from '../shared/TransactionModal';

export type Payment = {
  deliveryId: string;
  date: string;
  fee: string;
  status: string;
  action: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'deliveryId',
    header: 'Delivery ID',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'fee',
    header: 'Fee',
  },
  {
    accessorKey: 'status',
    header: 'status',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Delivered:
            'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter rounded-full',
          Accepted:
            'bg-[#FFFAEB] text-[#B54708] text-center py-1 text-sm font-medium font-inter rounded-full',
          Pickedup:
            'bg-[#F4F3FF] text-[#5925DC] text-center py-1 text-sm font-medium font-inter rounded-full',
          InTransit:
            'bg-[#EFF8FF] text-[#175CD3] text-center py-1 text-sm font-medium font-inter rounded-full',
          Failed:
            'bg-[#FEF3F2] text-[#B42318] text-center py-1 text-sm font-medium font-inter rounded-full',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
  {
    accessorKey: 'action',
    header: 'Actions',
    cell({ row }) {
      console.log(row);
      const Id = row.original.deliveryId;
      return <Link href={`/logistic-dashboard/delivery/${Id}`}>View</Link>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
  },
  {
    deliveryId: 'US-123456789',
    date: '09-07-2025',
    fee: '₦200,000.00',
    status: 'Accepted',
    action: '',
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
    <div>
      <div className="mt-3 rounded-md bg-white p-5">
        <ReDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          label="Deliveries"
          onPageChange={handlePageChange}
          rowClickMode="none"
          DialogComponent={TransactionModal}
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
                { label: 'Accepted', value: 'Accepted' },
                { label: 'Picked Up', value: 'Picked Up' },
                { label: 'In Transit', value: 'In Transit' },
                { label: 'Delivered', value: 'Delivered' },
                { label: 'Failed', value: 'Failed' },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
