'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

import FilterDataSection from './FilterDataSection';
import { DataTable } from './DataTable';

export type Payment = {
  ordersId: string;
  name: string;
  type: string;
  amount: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'ordersId',
    header: 'ORDERS ID',
  },
  {
    accessorKey: 'name',
    header: 'CREATED BY',
  },
  {
    accessorKey: 'type',
    header: 'TYPE',
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Active: 'bg-[#E9F5FB] text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'bg-[#E9F5FB] text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Suspended: 'bg-[#FCE9E9] text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const tData = [
  {
    ordersId: 'US-123456789',
    name: 'John Doe',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Pending',
  },
  {
    ordersId: 'US-123456789',
    name: 'Abram Lipshutz',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Tiana Bergson',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Cristofer Dias',
    type: 'Services',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Kadin Workman',
    type: 'Services',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Wilson Aminoff',
    type: 'Services',
    amount: '₦200,000.00',
    status: 'Suspended',
  },
  {
    ordersId: 'US-123456789',
    name: 'Phillip Passaquindici Arcand',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
  {
    ordersId: 'US-123456789',
    name: 'Kianna Bator',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Suspended',
  },
  {
    ordersId: 'US-123456789',
    name: 'Tiana Levin',
    type: 'Product',
    amount: '₦200,000.00',
    status: 'Active',
  },
];

export default function PaymentOrder() {
  const [selectedStatusType, setSelectedStatusType] = useState<string | null>(null);
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function filterSelectedStatusType() {
    const filteredData = selectedStatusType
      ? data.filter((item) => item.status === selectedStatusType)
      : data;
    setData(filteredData);
  }

  function handlePageChange(pageNumber: any) {
    try {
      console.log(pageNumber);
      setTimeout(() => {
        setData(tData);
        setIsLoading(false);
      }, 5000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange(1);
  }, []);

  useEffect(() => {
    filterSelectedStatusType();
  }, [selectedStatusType]);

  return (
    <section>
      <div>
        <FilterDataSection setSelectedStatusType={setSelectedStatusType} />
      </div>
      <div className=" rounded-md bg-white p-5">
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
