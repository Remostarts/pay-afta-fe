'use client';

import React, { useEffect, useState } from 'react';
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
import Skeleton from 'react-loading-skeleton';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

interface DataTableProps<TData extends { transactionType: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lable: string;
  isLoading: boolean;
  onPageChange: (pageNumber: number) => void;
}

const PAGE_SIZE = 8;
const DEFAULT_PAGE = 1;

export function DataTable<TData extends { transactionType: string }, TValue>({
  columns,
  data,
  lable,
  isLoading,
  onPageChange = (pageNumber: number) => {},
}: DataTableProps<TData, TValue>) {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(null);
  const route = useRouter();

  const [visibleTableData, setVisibleTableData] = useState<TData[]>(data);
  // console.log(visibleTableData);

  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  // const visibleData = data.slice(startIndex, endIndex);
  // setFilteredData(visibleData);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const table = useReactTable({
    data: visibleTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // initialState: {
    //   pagination: {
    //     pageSize: 8,
    //   },
    // },
  });

  const filteredDataByTransaction = () => {
    setVisibleTableData(
      selectedTransactionType
        ? data.filter((item) => item.transactionType === selectedTransactionType)
        : data
    );
  };

  useEffect(() => {
    filteredDataByTransaction();
  }, [selectedTransactionType]);

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
  // console.log(pageNumberButtons);
  // console.log(isLoading);

  return (
    <div>
      <div className=" mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-medium">{lable}</h2>
        <div className="flex flex-col gap-5">
          <Select onValueChange={(e) => setSelectedTransactionType(e === 'All' ? null : e)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Transaction Type</SelectLabel>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Credit">Credit</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                <SelectItem value="Track Link">Track Link</SelectItem>
                <SelectItem value="Card Funded">Card Funded</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-5">
                  <Skeleton count={5} className="w-full" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
