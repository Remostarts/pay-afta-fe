'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { ReDataTable } from '../shared/ReDateTable';

import FilterDataSection from './FilterDataSection';
import { DataTable } from './DataTable';
import TransactionModal from './TransactionModal';

import { ReDialog } from '@/components/re-ui/ReDialog';

export type Payment = {
  transactionId: string;
  type: string;
  user: string;
  amount: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'transactionId',
    header: 'TRANSACTION ID',
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
  },
  {
    accessorKey: 'user',
    header: 'USER',
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
          Sucessful: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Failed: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    transactionId: 'US-123456789',
    type: 'Money Received',
    user: 'Jaxson Saris',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    transactionId: 'US-123456789',
    type: 'Escrow Hold',
    user: 'Abram Lipshutz',
    amount: '₦200,000.00',
    status: 'Sucessful',
  },
  {
    transactionId: 'US-123456789',
    type: 'Money Received',
    user: 'Jaxson Saris',
    amount: '₦200,000.00',
    status: 'Sucessful',
  },
  {
    transactionId: 'US-123456789',
    type: 'Money Received',
    user: 'Tiana Bergson',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    transactionId: 'US-123456789',
    type: 'Escrow Hold',
    user: 'Tiana Bergson',
    amount: '₦200,000.00',
    status: 'Sucessful',
  },
  {
    transactionId: 'US-123456789',
    type: 'Escrow Paid',
    user: 'Cristofer Dias',
    amount: '₦200,000.00',
    status: 'Failed',
  },
  {
    transactionId: 'US-123456789',
    type: 'Escrow Received',
    user: 'Kadin Workman',
    amount: '₦200,000.00',
    status: 'Failed',
  },
  {
    transactionId: 'US-123456789',
    type: 'Money Received',
    user: 'Wilson Aminoff',
    amount: '₦200,000.00',
    status: 'Failed',
  },
  {
    transactionId: 'US-123456789',
    type: 'Money Received',
    user: 'Jaxson Saris',
    amount: '₦200,000.00',
    status: 'Failed',
  },
  {
    transactionId: 'US-123456789',
    type: 'Money Received',
    user: 'Kadin Workman',
    amount: '₦200,000.00',
    status: 'Sucessful',
  },
  {
    transactionId: 'US-123456789',
    type: 'Transfer 2 Wallet',
    user: 'Jaxson Saris',
    amount: '₦200,000.00',
    status: 'Sucessful',
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function Transactions() {
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
      <div className="rounded-md bg-white p-5">
        <ReDataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          rowClickMode="dialog"
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
    </div>
  );
}
