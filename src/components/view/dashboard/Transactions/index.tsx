'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { ReDataTable } from '../shared/ReDateTable';

import { TransactionReceipt } from './TransactionReceipt';

export type Payment = {
  id: string;
  date: string;
  amount: number;
  status: string;
  transactionType: string;
};

// const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: 'date',
//     header: 'Date',
//   },
//   {
//     accessorKey: 'transactionType',
//     header: 'Transcation Type',
//   },
//   {
//     accessorKey: 'amount',
//     header: 'Amount (₦)',
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell: ({ row }) => {
//       const status = row.getValue('status') as string;

//       const style =
//         {
//           Successful:
//             'bg-[#E8FDEF] rounded-full text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
//         }[status] ||
//         'bg-red-200 rounded-full text-red-600 text-center py-1 text-sm font-medium font-inter';

//       return <div className={`${style} `}>{status}</div>;
//     },
//   },
// ];

const tData : Payment[] = [
  // {
  //   id: '1',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '2',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Track Link',
  // },
  // {
  //   id: '3',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '4',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Withdrawal',
  // },
  // {
  //   id: '6',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Card Funded',
  // },
  // {
  //   id: '7',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '8',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '8',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '8',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '8',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
  // {
  //   id: '8',
  //   date: '21-02-2025, 02:24pm',
  //   amount: 500000,
  //   status: 'Successful',
  //   transactionType: 'Credit',
  // },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function Transcations() {
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);
  const pageSize = 8;

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'transactionType',
      header: 'Transcation Type',
    },
    {
      accessorKey: 'amount',
      header: 'Amount (₦)',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const payment = row.original;

        const style =
          {
            Successful:
              'bg-[#E8FDEF] rounded-full text-[#0F973C] text-center py-1 text-sm font-medium font-inter cursor-pointer',
          }[status] ||
          'bg-red-200 rounded-full text-red-600 text-center py-1 text-sm font-medium font-inter';

        return (
          <button
            className={`${style} w-full`}
            onClick={() => {
              if (status === 'Successful') {
                setSelectedTransaction(payment);
                setShowReceipt(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (status === 'Successful') {
                  setSelectedTransaction(payment);
                  setShowReceipt(true);
                }
              }
            }}
            tabIndex={0}
            aria-label={`Transaction status: ${status}`}
          >
            {status}
          </button>
        );
      },
    },
  ];

  // function handlePageChange(pageNumber: number, transactionType: string) {
  //   try {
  //     console.log('page no., ', pageNumber, ' transaction type, ', transactionType);
  //     setTimeout(() => {
  //       setData(tData);
  //       setIsLoading(false);
  //     }, 5000);
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   handlePageChange(1, 'All');
  // }, []);

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
        {/* <DataTable
          columns={columns}
          data={data}
          lable={'Transaction History'}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        /> */}

        <ReDataTable
          label="Transaction History"
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
            defaultValue: 'All',
          }}
          filters={[
            {
              name: 'Transaction Type',
              placeholder: 'Transaction Type',
              options: [
                { label: 'All', value: 'All' },
                { label: 'Withdrawal', value: 'Withdrawal' },
                { label: 'Bank transfer', value: 'Bank transfer' },
                { label: 'Delivery Payment', value: 'Delivery Payment' },
                { label: 'Escrow holding', value: 'Escrow holding' },
                { label: 'Escrow withdrawal', value: 'Escrow withdrawal' },
              ],
            },
          ]}
        />
      </div>

      {selectedTransaction && (
        <TransactionReceipt
          onClose={() => {
            setShowReceipt(false);
            setSelectedTransaction(null);
          }}
          amount={selectedTransaction.amount.toString()}
          date={selectedTransaction.date}
          status={selectedTransaction.status}
          transactionType={selectedTransaction.transactionType}
          bankName="Access Bank"
          accountNumber="0123456789"
          accountName="John Doe"
          narration="Payment for services"
          transactionId={selectedTransaction.id}
        />
      )}
    </section>
  );
}
