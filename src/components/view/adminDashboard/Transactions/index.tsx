'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

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

export default function Transactions() {
  const [selectedStatusType, setSelectedStatusType] = useState<string | null>(null);
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function filterSelectedStatusType() {
    const filteredData = selectedStatusType
      ? data.filter((item) => item.status === selectedStatusType)
      : data;
    setData(filteredData);
  }

  function handlePageChange(pageNumber: any) {
    try {
      console.log(pageNumber);
      setTimeout(() => {
        setData(tData);
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange(1);
  }, []);

  useEffect(() => {
    filterSelectedStatusType();
  }, [selectedStatusType]);

  return (
    <div>
      <FilterDataSection setSelectedStatusType={setSelectedStatusType} />
      <div className="container mx-auto rounded-md bg-white p-5">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
