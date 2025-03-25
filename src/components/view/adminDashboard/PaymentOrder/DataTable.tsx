'use client';

import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import 'react-loading-skeleton/dist/skeleton.css';

interface DataTableProps<TData extends { ordersId: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lable?: string;
  isLoading: boolean;
  onPageChange: (pageNumber: number) => void;
}

const PAGE_SIZE = 8;
const DEFAULT_PAGE = 1;

export function DataTable<TData extends { ordersId: string }, TValue>({
  columns,
  data,
  lable,
  isLoading,
  onPageChange = (pageNumber: number) => {},
}: DataTableProps<TData, TValue>) {
  const [visibleTableData, setVisibleTableData] = useState<TData[]>(data);
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  // const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(null);
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 8,
  // });
  // const route = useRouter();
  //   ? data.filter((item) => item.transactionType === selectedTransactionType)
  //   : data;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange: setPagination,
    // state: {
    //   pagination,
    // },
  });

  useEffect(() => {
    const visibleData = data.slice(startIndex, endIndex);
    setVisibleTableData(visibleData);
  }, [currentPage, data]);

  const pageNumberButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

  function handlePageChange(pageNumber: number) {
    console.log(pageNumber);
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  }

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-5">
                  <Skeleton count={5} className="w-full" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  // onClick={() => console.log('clicked', row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=" p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
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
      <div className="flex items-center justify-center gap-8 space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          {pageNumberButtons.map((pageNumber) => {
            return (
              <Button
                key={pageNumber}
                variant="outline"
                size="sm"
                className={currentPage === pageNumber ? 'bg-[#E6E7FE] text-black' : ''}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
