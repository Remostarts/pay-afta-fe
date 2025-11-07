'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { ReDataTable } from '../shared/ReDateTable';
import TransactionModal from '../shared/TransactionModal';
import { getDeliveries } from '@/lib/actions/delivery/delivery.actions';

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
    header: 'Status',
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
        }[status] || 'bg-gray-100 text-gray-600 text-center py-1 text-sm font-medium rounded-full';

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

  async function fetchDeliveries({
    pageNumber = 1,
    selectedDate = 'Today',
    Status = 'Active',
  }: PageChangeParams = {}) {
    setIsLoading(true);
    try {
      const apiResponse = await getDeliveries();

      const deliveries = apiResponse.data || [];
      const count = apiResponse.count || deliveries.length;

      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = deliveries.slice(startIndex, endIndex);

      setTotalCount(count);
      setData(deliveries);
      setPage(pageNumber);
    } catch (error) {
      console.error('Error loading deliveries from API:', error);
      setTotalCount(data.length);
      setData(data);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageChange(params: PageChangeParams = {}) {
    fetchDeliveries(params);
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });
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
