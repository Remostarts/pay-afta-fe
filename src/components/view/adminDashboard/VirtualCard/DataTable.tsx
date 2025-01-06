'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { DialogTableRow } from './DialogTableRow';
import TransactionModal from './TransactionModal';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lable?: string;
}

export function DataTable<TData, TValue>({ columns, data, lable }: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  });
  const route = useRouter();
  //   ? data.filter((item) => item.transactionType === selectedTransactionType)
  //   : data;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div>
      <div className=" mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-medium">{lable}</h2>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-[#E9F5FB]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-inter text-[#1F7EAD]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <DialogTableRow
                  key={row.id}
                  row={row}
                  DialogComponent={TransactionModal}
                  dialogProps={{
                    transaction: sampleTransaction,
                  }}
                  onRowClick={(row) => {
                    console.log('Row clicked:', row.id);
                    // Add any additional click handling here
                  }}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination  */}
      <div className="h-2">
        <div className="mt-2 flex items-center justify-end gap-2">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[8, 16, 24, 32, 40].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Row as per page: {pageSize}
              </option>
            ))}
          </select>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft />
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
