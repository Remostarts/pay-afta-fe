'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@radix-ui/react-dropdown-menu';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData extends { transactionType: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lable: string;
}

export function DataTable<TData extends { transactionType: string }, TValue>({
  columns,
  data,
  lable,
}: DataTableProps<TData, TValue>) {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(null);
  const route = useRouter();

  const filteredData = selectedTransactionType
    ? data.filter((item) => item.transactionType === selectedTransactionType)
    : data;

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 3;
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(i - 1)}
          className={`${currentPage === i ? 'bg-[#E6E7FE] text-black' : ''}`}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div>
      <div className=" mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-medium">{lable}</h2>
        <div className="flex flex-col gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="relative ">
              <Button variant="outline" size="sm" className="w-[200px]">
                {selectedTransactionType || 'Transactions Types'}
                <ChevronDownIcon className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className=" bg-white">
              <DropdownMenuCheckboxItem
                key="all"
                className="capitalize"
                checked={selectedTransactionType === null}
                onCheckedChange={() => setSelectedTransactionType(null)}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                key="credit"
                className="capitalize"
                checked={selectedTransactionType === 'Credit'}
                onCheckedChange={() => setSelectedTransactionType('Credit')}
              >
                Credit
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                key="withdrawal"
                className="capitalize"
                checked={selectedTransactionType === 'Withdrawal'}
                onCheckedChange={() => setSelectedTransactionType('Withdrawal')}
              >
                Withdrawal
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                key="track-link"
                className="capitalize"
                checked={selectedTransactionType === 'Track Link'}
                onCheckedChange={() => setSelectedTransactionType('Track Link')}
              >
                Track Link
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                key="card-funded"
                className="capitalize"
                checked={selectedTransactionType === 'Card Funded'}
                onCheckedChange={() => setSelectedTransactionType('Card Funded')}
              >
                Card Funded
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-gray-600">
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Image
                      src="/assets/dashboard/VirtualCard/transaction-history.svg"
                      alt="transaction history"
                      width={120}
                      height={120}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination  */}
      <div className="flex items-center justify-center gap-8 space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          {renderPageButtons()}
          {totalPages > 3 && currentPage < totalPages - 1 && (
            <>
              <Button variant="outline" size="sm" disabled>
                ...
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(totalPages - 1)}
                className={`${currentPage === totalPages ? 'bg-primary-500 text-white' : ''}`}
              >
                {totalPages}
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground flex-1 text-sm">
            Showing{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filteredData.length
            )}{' '}
            of {filteredData.length} entries
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-[70px]">
                {table.getState().pagination.pageSize}
                <ChevronDownIcon className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {[8, 16, 24, 32].map((pageSize) => (
                <DropdownMenuCheckboxItem
                  key={pageSize}
                  className="capitalize"
                  checked={table.getState().pagination.pageSize === pageSize}
                  onCheckedChange={() => table.setPageSize(pageSize)}
                >
                  {pageSize}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
