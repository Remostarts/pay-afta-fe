'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
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
          Success: ' text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: ' text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    type: 'Withdrawal',
    amount: '20000',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    type: 'Withdrawal',
    amount: '20000',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    type: 'Withdrawal',
    amount: '20000',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    type: 'Wallet Funded',
    amount: '20000',
    date: '12/5/6465',
    status: 'Success',
  },
  {
    type: 'Wallet Funded',
    amount: '20000',
    date: '12/5/6465',
    status: 'Success',
  },
  {
    type: 'Wallet Funded',
    amount: '20000',
    date: '12/5/6465',
    status: 'Success',
  },
  {
    type: 'Wallet Funded',
    amount: '20000',
    date: '12/5/6465',
    status: 'Success',
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

function Transaction() {
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
      <div className="mt-3 rounded-md bg-white p-5">
        <ReDataTable
          label="Transaction"
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
            defaultValue: 'Today',
          }}
        />
      </div>
    </section>
  );
}

export default Transaction;
