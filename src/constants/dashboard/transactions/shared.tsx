'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Payment = {
  id: string;
  date: string;
  amount: number;
  status: string;
  transcationType: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'transcationType',
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
