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

const data = [
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
  const [filteredDataByStatus, setFilteredDataByStatus] = useState<Payment[]>([]);

  function filterSelectedStatusType() {
    const filteredData = selectedStatusType
      ? data.filter((item) => item.status === selectedStatusType)
      : data;
    setFilteredDataByStatus(filteredData);
  }

  useEffect(() => {
    filterSelectedStatusType();
  }, [selectedStatusType]);

  const sampleTransaction = {
    id: 'US-123456789',
    userId: 'User ID',
    fullName: 'Full Name',
    status: 'Successful' as const,
    type: 'Money Recieved',
    amount: '₦200,000.00',
    senderBank: 'Lorem Ipsum',
    senderAccount: '0011223344',
    senderName: 'Lorem Ipsum',
    reference: 'ht62gbs-7wyhe-i98id-29uejh-8uh-d9uh8id-dyhd',
    date: '5 Jun, 2024 10:30PM',
  };

  return (
    <div>
      <FilterDataSection setSelectedStatusType={setSelectedStatusType} />
      <div className="container mx-auto rounded-md bg-white p-5">
        <DataTable columns={columns} data={filteredDataByStatus} />
      </div>

      {/* <ReDialog
        btnLabel="Open Dialog"
        DialogComponent={TransactionModal}
        componentProps={{
          transaction: sampleTransaction,
        }}
        // onOpenChange={(open) => console.log('Dialog state:', open)}
      /> */}
    </div>
  );
}
