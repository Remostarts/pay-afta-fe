'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import ReInput from '@/components/re-ui/re-input/ReInput';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData extends { payment: string; status: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  lable: string;
  isLoading: boolean;
  onPageChange: (pageNumber: number, transactionType: string, status: string) => void;
  total: number;
  currentPage: number;
  pageSize: number;
}

export function DataTable<
  TData extends {
    name: string;
    payment: string;
    status: string;
  },
  TValue,
>({
  columns,
  data,
  lable,
  isLoading,
  onPageChange,
  total,
  currentPage,
  pageSize,
}: DataTableProps<TData, TValue>) {
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const route = useRouter();

  const [visibleTableData, setVisibleTableData] = useState<TData[]>(data);
  // console.log(visibleTableData);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = Math.ceil(total / pageSize);
  const pageNumberButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

  const visibleData = data.slice(startIndex, endIndex);
  // setFilteredData(visibleData);

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
        ? data.filter((item) => item.payment === selectedTransactionType)
        : data
    );
  };

  const filteredDataByStatus = () => {
    setVisibleTableData(
      selectedStatus ? data.filter((item) => item.status === selectedStatus) : data
    );
  };

  useEffect(() => {
    filteredDataByTransaction();
  }, [selectedTransactionType]);

  useEffect(() => {
    filteredDataByStatus();
  }, [selectedStatus]);

  useEffect(() => {
    // const visibleData = data.slice(startIndex, endIndex);
    setVisibleTableData(visibleData);
  }, [currentPage, data]);

  useEffect(() => {
    handlePageChange(currentPage, selectedTransactionType || 'All', selectedStatus || 'All');
  }, [currentPage, selectedTransactionType, selectedStatus]);

  function handlePageChange(pageNumber: number, transactionType: string, status: string) {
    // console.log(pageNumber);
    // setCurrentPage(pageNumber);
    onPageChange(pageNumber, transactionType, status);
  }

  function handleChange(e: any) {
    console.log(e.target.value);
  }

  return (
    <div>
      <div className=" mb-4 md:flex md:items-center md:justify-between">
        <div className="w-[400px] md:grid md:grid-rows-2">
          <h2 className="font-inter text-2xl font-medium">{lable}</h2>
          <Input onChange={handleChange} placeholder="Search" className="mt-2 w-full" />
        </div>
        <div className="mt-5 gap-5 md:flex md:flex-col md:items-end">
          <button
            className="flex w-3/5 items-center gap-5 rounded-md border p-2"
            onClick={() => {
              route.push('/dashboard/new-order');
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
          <div className="mt-5 flex items-center gap-2">
            {/* payment filter DropdownMenu */}
            <Select onValueChange={(e) => setSelectedTransactionType(e === 'All' ? null : e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Transaction Type</SelectLabel>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Product Order">Product Order</SelectItem>
                  <SelectItem value="Service Order">Service Order</SelectItem>
                  <SelectItem value="Ongoing Orders">Ongoing Orders</SelectItem>
                  <SelectItem value="Completed Orders">Completed Orders</SelectItem>
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
                  <SelectItem value="Agreement">Agreement</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="In-transit">In-transit</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                  <SelectItem value="Dispute">Dispute</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Settled">Settled</SelectItem>
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
      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1, '', ' ')}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
        </Button>
        {pageNumberButtons.map((number) => {
          return (
            <Button
              key={number}
              variant="outline"
              size="sm"
              className={currentPage === number ? 'bg-[#E6E7FE] text-black' : ''}
              onClick={() => onPageChange(number, '', ' ')}
            >
              {number}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1, '', ' ')}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
