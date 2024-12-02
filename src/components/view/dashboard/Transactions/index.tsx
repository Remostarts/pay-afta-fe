import { ColumnDef } from '@tanstack/react-table';

import { DataTable } from './DataTable';

export type Payment = {
  id: string;
  date: string;
  amount: number;
  status: string;
  transactionType: string;
};

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
  },
];

const data = [
  {
    id: '1',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '2',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Track Link',
  },
  {
    id: '3',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '4',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
  {
    id: '5',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
  {
    id: '6',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Card Funded',
  },
  {
    id: '7',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '8',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Credit',
  },
  {
    id: '9',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Track Link',
  },
  {
    id: '10',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transactionType: 'Withdrawal',
  },
];

export default function Transcations() {
  return (
    <section>
      <div className="container mx-auto rounded-md bg-white p-5">
        <DataTable columns={columns} data={data} lable={'Transaction History'} />
      </div>
    </section>
  );
}
