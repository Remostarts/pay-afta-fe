'use client';

import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import Image from 'next/image';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { DatePickerWithRange } from './DatePicker';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import 'react-loading-skeleton/dist/skeleton.css';

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

export type RowClickMode = 'link' | 'dialog' | 'none';

// Define the type for filters
export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  name: string;
  options: FilterOption[];
  defaultValue?: string;
  placeholder?: string;
};

export type DateFilterConfig = {
  enabled: boolean;
  defaultValue?: string;
  customLabel?: string;
};

export type ExportConfig = {
  enabled: boolean;
  buttonText?: string;
  onExport?: () => void;
};

interface ReDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  label?: string;
  isLoading?: boolean;
  onPageChange?: ({ pageNumber, Status, selectedDate }?: any) => void;
  isTabs?: boolean;
  onTabChange?: (value: any) => void;
  // Row interaction type
  rowClickMode?: RowClickMode;
  // For 'link' mode
  getLinkHref?: (row: any) => string;
  // For 'dialog' mode
  DialogComponent?: React.ComponentType<any>;
  getDialogProps?: (row: any) => object;
  // General props
  onRowClick?: (row: any) => void;
  rowClassName?: string;
  cellClassName?: string;
  pageSize?: number;
  count: number;
  page: number;
  setPage: (page: number) => void;
  // Filter configurations
  filters?: FilterConfig[];
  dateFilter?: DateFilterConfig;
  export?: ExportConfig;
  filterContainerClassName?: string;
}

export function ReDataTable<TData, TValue>({
  columns,
  data,
  label,
  isLoading,
  isTabs,
  onTabChange,
  onPageChange = () => {},
  rowClickMode = 'none',
  getLinkHref,
  DialogComponent,
  getDialogProps = () => ({}),
  onRowClick,
  rowClassName,
  cellClassName,
  pageSize: initialPageSize = 8,
  count,
  page,
  setPage,
  filters = [],
  dateFilter = { enabled: false },
  export: exportConfig = { enabled: false },
  filterContainerClassName,
}: ReDataTableProps<TData, TValue>) {
  console.log('🌼 🔥🔥 data🌼', data);

  const [visibleTableData, setVisibleTableData] = useState<TData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [dateOption, setDateOption] = useState<string | null>(dateFilter.defaultValue || null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null);

  const startIndex = (currentPage - 1) * initialPageSize;
  const endIndex = startIndex + initialPageSize;
  const totalPages = Math.ceil(count / initialPageSize);

  const table = useReactTable({
    data,
    columns,
    // pageCount: Math.max(1, Math.ceil(count / initialPageSize)),
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // state: {
    //   pagination: {
    //     pageIndex: page - 1,
    //     pageSize: initialPageSize,
    //   },
    // },
  });

  const pageNumberButtons = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Handle filter change
  const handleFilterChange = (filterName: string, value: string) => {
    const newFilters = { ...selectedFilters, [filterName]: value };
    setSelectedFilters(newFilters);
    handlePageChangeWithFilters(1, newFilters);
  };

  // Handle date filter change
  const handleDateChange = (value: string) => {
    if (value === 'Custom Range') {
      setPopoverOpen(true);
      setDateOption(value);
    } else {
      setSelectedDateRange(null);
      setDateOption(value);
      handlePageChangeWithFilters(1, selectedFilters, value);
    }
  };

  // Handle custom date range selection
  const handleApplyDateRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const formattedRange = `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
      setSelectedDateRange(formattedRange);
      handlePageChangeWithFilters(page, selectedFilters, formattedRange);
    }
    setPopoverOpen(false);
  };

  // Handle cancel date range
  const handleCancelDateRange = () => {
    setPopoverOpen(false);
    if (!selectedDateRange) {
      setDateOption(null);
    }
  };

  // Handle page change with filters
  const handlePageChangeWithFilters = (
    pageNumber: number,
    filters = selectedFilters,
    date = dateOption
  ) => {
    // if (pageNumber < 1 || pageNumber > Math.ceil(count / initialPageSize)) return;
    setCurrentPage(pageNumber);
    setPage(pageNumber);
    onPageChange({
      pageNumber,
      Status: filters,
      selectedDate: date,
    });
  };

  // Handle export button click
  const handleExport = () => {
    if (exportConfig.onExport) {
      exportConfig.onExport();
    } else {
      console.log('Export data', { data, filters: selectedFilters, date: dateOption });
    }
  };

  useEffect(() => {
    const visibleData = data?.slice(startIndex, endIndex);
    setVisibleTableData(visibleData);
  }, [currentPage, data, startIndex, endIndex]);

  // Render different row types based on rowClickMode
  const renderTableRow = (row: any) => {
    // Standard click handler that works for all row types
    const handleRowClick = () => {
      if (onRowClick) onRowClick(row);
    };

    switch (rowClickMode) {
      case 'link':
        if (!getLinkHref) {
          console.error('getLinkHref function is required when rowClickMode is "link"');
          return renderStandardRow(row, handleRowClick);
        }
        return renderLinkRow(row, getLinkHref(row), handleRowClick);

      // case 'dialog':
      //   if (!DialogComponent) {
      //     console.error('DialogComponent is required when rowClickMode is "dialog"');
      //     return renderStandardRow(row, handleRowClick);
      //   }
      //   return renderDialogRow(row, handleRowClick);

      case 'none':
      default:
        return renderStandardRow(row, handleRowClick);
    }
  };

  // Standard row with optional click handler
  const renderStandardRow = (row: any, handleRowClick: () => void) => (
    <TableRow
      key={row.id}
      className={cn('hover:bg-muted/50', rowClassName, { 'cursor-pointer': !!onRowClick })}
      data-state={row.getIsSelected() && 'selected'}
      onClick={onRowClick ? handleRowClick : undefined}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id} className={cn('transition-colors', cellClassName)}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );

  // Row with link wrapper for each cell
  const renderLinkRow = (row: any, href: string, handleRowClick: () => void) => {
    return (
      <TableRow
        key={row.id}
        className={cn('cursor-pointer hover:bg-muted/50', rowClassName)}
        data-state={row.getIsSelected() && 'selected'}
        onClick={handleRowClick}
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell key={cell.id} className={cn('p-0', cellClassName)}>
            <Link href={href} className="block size-full p-4">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Link>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // const renderDialogRow = (row: any, handleRowClick: () => void) => {
  //   return (
  //     <DialogTableRow
  //       key={row.id}
  //       row={row}
  //       DialogComponent={TransactionModal}
  //       dialogProps={{
  //         transaction: sampleTransaction,
  //         row,
  //       }}
  //       onRowClick={(row: any) => {
  //         if (onRowClick) onRowClick(row);
  //         handleRowClick();
  //       }}
  //       rowClassName={rowClassName}
  //       cellClassName={cellClassName}
  //     />
  //   );
  // };

  // Render the filters
  const renderFilters = () => {
    const hasFilters = filters.length > 0 || dateFilter.enabled || exportConfig.enabled;

    if (!hasFilters) return null;

    return (
      <div className={cn('mb-2 flex flex-col rounded-md bg-white p-4', filterContainerClassName)}>
        <div className={cn('flex items-center', isTabs ? 'justify-between' : 'justify-end')}>
          {/* Tabs section  */}
          {isTabs && (
            <div className="w-full lg:w-auto">
              <Tabs
                defaultValue="Team Members"
                className="w-full rounded-[4px] p-1 lg:h-[56] lg:w-[408]"
              >
                <TabsList className="grid w-full grid-cols-2 rounded-lg border-2 border-[#A9D8EF] bg-[#E9F5FB]">
                  {(['Team Members', 'Role'] as const).map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      onClick={() => onTabChange?.(tab)}
                      className="rounded-lg font-inter text-[#7EC4E7] data-[state=active]:bg-[#1F7EAD] data-[state=active]:text-white"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Date filter */}
          {dateFilter.enabled && (
            <div>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <div>
                    <Select
                      value={dateOption || undefined}
                      onValueChange={handleDateChange}
                      defaultValue={dateFilter.defaultValue}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={dateFilter.customLabel || 'Select Date'} />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          <SelectLabel>Date</SelectLabel>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="last_week">Last Week</SelectItem>
                          <SelectItem value="this_month">This Month</SelectItem>
                          <SelectItem value="last_month">Last Month</SelectItem>
                          <SelectItem value="Custom Range" className="text-[#1F7EAD]">
                            Custom Range
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="start">
                  <DatePickerWithRange
                    onApply={handleApplyDateRange}
                    onCancel={handleCancelDateRange}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Custom filters */}
          {filters.map((filter, index) => (
            <div key={filter.name} className="ml-4">
              <Select
                onValueChange={(value) => handleFilterChange(filter.name, value)}
                defaultValue={filter.defaultValue}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={filter.placeholder || `Select ${filter.name}`} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectLabel>{filter.name}</SelectLabel>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}

          {/* Export button */}
          {exportConfig.enabled && (
            <div>
              <button
                className="ml-4 flex items-center gap-1 rounded-md bg-[#1F7EAD] px-4 py-2 text-white"
                onClick={handleExport}
              >
                <Image
                  src="/assets/admin-dashboard/users/export-icon.svg"
                  width={20}
                  height={20}
                  alt="export"
                />
                {exportConfig.buttonText || 'Export'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {label ? (
          <>
            <h2 className="text-2xl font-medium">{label}</h2>
            <div>{renderFilters()}</div>
          </>
        ) : (
          <div className="ml-auto w-full">{renderFilters()}</div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-[#F8F8F8]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-inter text-[#666666]">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
            ) : table?.getRowCount() ? (
              table.getRowModel().rows.map(renderTableRow)
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

      {/* Pagination */}
      {pageNumberButtons.length ? (
        <div className="flex flex-col items-center justify-center gap-8 space-x-2 py-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChangeWithFilters(currentPage - 1)}
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
                  onClick={() => handlePageChangeWithFilters(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChangeWithFilters(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
