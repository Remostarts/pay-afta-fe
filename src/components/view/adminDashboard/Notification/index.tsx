'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReDataTable } from '../shared/ReDateTable';

export type Payment = {
  userId: string;
  name: string;
  email: string;
  date: string;
  status: string;
};

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

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
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
  {
    userId: 'US-123456789',
    name: 'John Doe',
    email: 'xyz@gmail.com',
    date: '12/5/6465',
    status: 'Pending',
  },
];

export default function Notification() {
  const [specificUserNotifications, setSpecificUserNotifications] = useState(false);
  const [specificCustomerNotifications, setSpecificCustomerNotifications] = useState(true);
  const [generalNotifications, setGeneralNotifications] = useState(false);

  // New state for notification type selection
  const [notificationType, setNotificationType] = useState('');
  const [specificCategory, setSpecificCategory] = useState('');
  const [specificCustomer, setSpecificCustomer] = useState('');

  // Table states
  const [data, setData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  function handleCheckNotification() {
    setSpecificUserNotifications(!specificUserNotifications);
  }

  function handleCustomerNotification() {
    setSpecificCustomerNotifications(!specificCustomerNotifications);
  }

  function handleGeneralNotification() {
    setGeneralNotifications(!generalNotifications);
  }

  function handleNotificationTypeChange(value: string) {
    setNotificationType(value);
    // Reset sub-selections when notification type changes
    setSpecificCategory('');
    setSpecificCustomer('');
  }

  function handleSpecificCategoryChange(value: string) {
    setSpecificCategory(value);
  }

  function handleSpecificCustomerChange(value: string) {
    setSpecificCustomer(value);
  }

  function handlePageChange(params: PageChangeParams = {}) {
    const { pageNumber = 1, selectedDate = 'Today', Status = 'Active' } = params;
    try {
      console.log({ pageNumber, selectedDate, Status });
      setTimeout(() => {
        setTotalCount(tData.length);
        setData(tData);
        setPage(pageNumber);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
      setData([]);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });

    setData(tData);
  }, []);

  return (
    <section>
      <div className="mb-6 bg-white p-6 rounded-md flex items-center justify-between flex-wrap">
        <h2 className="text-xl font-semibold">Notification</h2>
        <div className="sm:flex gap-4">
          {/* Main notification type selector */}
          <Select value={notificationType} onValueChange={handleNotificationTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Notification Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Notification Type</SelectLabel>
                <SelectItem value="specificCategories">Specific Categories</SelectItem>
                <SelectItem value="specificCustomers">Specific Customers</SelectItem>
                <SelectItem value="generalNotification">General Notification</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Conditional second selector for specific categories */}
          {notificationType === 'specificCategories' && (
            <Select value={specificCategory} onValueChange={handleSpecificCategoryChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {/* Conditional second selector for specific customers */}
          {notificationType === 'specificCustomers' && (
            <Select value={specificCustomer} onValueChange={handleSpecificCustomerChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Customer Types</SelectLabel>
                  <SelectItem value="individuals">Individuals</SelectItem>
                  <SelectItem value="businesses">Businesses</SelectItem>
                  <SelectItem value="premium">Premium Customers</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filters" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectLabel>Filters</SelectLabel>
                <SelectItem value="name">Name </SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="">
            <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-2 md:p-4">
              <span>Enable specific users notifications</span>
              <ReToggle checked={specificUserNotifications} onChange={handleCheckNotification} />
            </div>
            <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-2 md:p-4">
              <span>Enable specific customer notifications</span>
              <ReToggle
                checked={specificCustomerNotifications}
                onChange={handleCustomerNotification}
              />
            </div>
            <div className="mb-4 flex items-center justify-between rounded-md bg-[#F8F8F8] p-2 md:p-4">
              <span>Enable General notifications</span>
              <ReToggle checked={generalNotifications} onChange={handleGeneralNotification} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ReDataTable
            label="List of Selected Customers"
            columns={columns}
            data={data}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            rowClickMode="none"
            count={totalCount}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
          />
        </div>
      </div>
    </section>
  );
}
