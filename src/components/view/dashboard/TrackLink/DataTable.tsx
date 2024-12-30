'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
import { Input } from '@/components/ui/input';

interface DataTableProps<TData extends { payment: string; status: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lable: string;
}

export function DataTable<
  TData extends {
    name: string;
    payment: string;
    status: string;
  },
  TValue,
>({ columns, data, lable }: DataTableProps<TData, TValue>) {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchFilterData, setSearchFilterData] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const route = useRouter();

  const filteredDataByTransaction = () => {
    setFilteredData(
      selectedTransactionType
        ? data.filter((item) => item.payment === selectedTransactionType)
        : data
    );
  };

  const filteredDataByStatus = () => {
    setFilteredData(selectedStatus ? data.filter((item) => item.status === selectedStatus) : data);
  };

  useEffect(() => {
    filteredDataByTransaction();
    filteredDataByStatus();
  }, [selectedTransactionType, selectedStatus]);

  // console.log(filterDataByTransaction);

  // console.log(filterDataByStatus);

  // console.log(selectedStatus);
  // console.log(selectedTransactionType);

  // function handleChange(e: any) {
  //   const value = e.target.value;
  //   setSearchFilterData(value);
  // }
  // console.log(searchFilterData);

  // if (searchFilterData) {
  //   filteredData = filteredData?.filter((item) =>
  //     item?.name?.toLowerCase().includes(searchFilterData.toLowerCase())
  //   );
  // }

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
        <div className="grid grid-rows-2">
          <h2 className="text-2xl font-medium">{lable}</h2>
          {/* <Input onChange={handleChange} placeholder="Search by Name" className="w-full" /> */}
        </div>
        <div className="flex flex-col gap-5">
          <button
            className="flex w-3/5 items-center gap-5 rounded-md border p-5"
            onClick={() => {
              route.push('/dashboard');
            }}
          >
            <Image
              src="/assets/dashboard/TrackLinks/track-order.svg"
              alt=""
              width={43}
              height={43}
            />
            <span className="font-inter text-xl font-semibold">New Order</span>
          </button>
          <div className="flex items-center gap-2">
            {/* payment filter DropdownMenu */}
            <Select onValueChange={(e) => setSelectedTransactionType(e === 'All' ? null : e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Transaction Type</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="In Escrow">In Escrow</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Released">Released</SelectItem>
                  <SelectItem value="Card Funded">Card Funded</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Status Filter DropdownMenu */}
            <Select onValueChange={(e) => setSelectedStatus(e === 'All' ? null : e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Agreement">Agreement</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                  <SelectItem value="Dispute">Dispute</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
