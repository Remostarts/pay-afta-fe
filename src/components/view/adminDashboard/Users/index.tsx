'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from './DataTable';
import FilterDataSection from './FilterDataSection';
import UserDetails from './Userdetails';

import { UsersApiResponse } from '@/types/admin/users.type';

export type Payment = {
  userId: string;
  name: string;
  email: string;
  date: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'userId',
    header: 'USER ID',
  },
  {
    accessorKey: 'name',
    header: 'NAME',
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
  },
  {
    accessorKey: 'date',
    header: 'DATE JOINED',
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
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'Abram Lipshutz',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Bergson',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Cristofer Dias',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kadin Workman',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Wilson Aminoff',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Phillip Passaquindici Arcand',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Kianna Bator',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    userId: 'US-123456789',
    name: 'Tiana Levin',
    email: 'Jaxson@gmail.com',
    date: '15 Jun, 2024',
    status: 'Active',
  },
];

export default function Users() {
  // const [selectedStatusType, setSelectedStatusType] = useState<string | null>(null);
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UsersApiResponse>({} as UsersApiResponse);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // function filterSelectedStatusType() {
  //   const filteredData = selectedStatusType
  //     ? data.filter((item) => item.status === selectedStatusType)
  //     : data;
  //   setData(filteredData);
  // }

  // console.log(selectedDate);
  // console.log(selectedStatusType);

  function handlePageChange({
    pageNumber = 1,
    selectedDate = 'Today',
    selectedStatusType = 'Active',
  }: any) {
    try {
      console.log(pageNumber);
      console.log(selectedDate);
      console.log(selectedStatusType);
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

  const handleTransactionFilterChange = async (filter: string = 'All', page: number = 1) => {
    // if (!user?.id) return;
    console.log('🌼 🔥🔥 handleFilterChange 🔥🔥 filter🌼', filter, page);
    // Optional: Handle filter change
    setLoading(true);

    setPage(page);

    console.log('🌼 🔥🔥 handleFilterChange 🔥🔥 page🌼', page);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoice/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // authorization: session?.accessToken as string,
        },
        cache: 'no-store',
      });
      const data = await response.json();

      console.log('🌼 🔥🔥 handleTransactionFilterChange 🔥🔥 data🌼', data);

      if (data?.success) {
        setUsers(data?.data);
      } else {
        toast.error(data?.errorName || 'Failed to load users');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   filterSelectedStatusType();
  // }, [selectedStatusType]);

  //   console.log(filteredDataByStatus);

  //   console.log(selectedStatusType);

  return (
    <section>
      <div>
        <FilterDataSection
          // setSelectedStatusType={setSelectedStatusType}
          // setSelectedDate={setSelectedDate}
          handlePageChange={handlePageChange}
        />
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
