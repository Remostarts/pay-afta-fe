'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useState, useEffect } from 'react';

import { ReDataTable } from '../shared/ReDateTable';

export type Payment = {
  type: string;
  amount: string;
  date: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'type',
    header: 'TYPE',
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
  },
  {
    accessorKey: 'date',
    header: 'DATE',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Active: ' text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Suspended: 'text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Pending',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  selectedStatusType?: string;
}

export default function UserVirtualCard() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  function handlePageChange(params: PageChangeParams = {}) {
    const { pageNumber = 1, selectedDate = 'Today', selectedStatusType = 'Active' } = params;
    try {
      console.log({ pageNumber, selectedDate, selectedStatusType });
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
      <div className="">
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Card Balance</p>
          <p className="font-inter text-xl font-semibold">₦0.00</p>
        </div>
      </div>
      <div>
        <div className="rounded-md bg-white p-5">
          <ReDataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            rowClickMode="none"
            label="Transactions"
            count={totalCount}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            dateFilter={{
              enabled: true,
              defaultValue: 'Today',
            }}
          />
        </div>
      </div>
    </section>
  );
}
