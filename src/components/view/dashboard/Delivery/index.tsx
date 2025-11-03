// 'use client';

// import { useState, useEffect } from 'react';
// import { ColumnDef } from '@tanstack/react-table';

// import { ReDataTable } from '../../adminDashboard/shared/ReDateTable';

// import AssignOrderList from './AssignOrderList';
// import DeliveryStats from './DeliveryStats';
// import { getUnassignOrdersAndStatsByUser } from '@/lib/actions/order/order.actions';

// export type Payment = {
//   date: string;
//   deliveryCompany: string;
//   amount: string;
//   status: string;
// };

// const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: 'date',
//     header: 'Date',
//   },
//   {
//     accessorKey: 'deliveryCompany',
//     header: 'Delivery Company',
//   },
//   {
//     accessorKey: 'amount',
//     header: 'Amount',
//   },
//   {
//     accessorKey: 'status',
//     header: 'Status',
//     cell({ row }) {
//       const status = row.getValue('status') as string;

//       const styles =
//         {
//           REJECTED:
//             'bg-[#B54708] text-[#FFFAEB] text-center py-1 text-sm font-medium font-inter rounded-full',
//           REQUESTED:
//             'bg-[#ABE5C6] text-[#067647] text-center py-1 text-sm font-medium font-inter rounded-full',
//           ACCEPTED:
//             'bg-[#ABEFC6] text-[#067647] text-center py-1 text-sm font-medium font-inter rounded-full',
//           Scheduled:
//             'bg-[#FFFAEB] text-[#B54708] text-center py-1 text-sm font-medium font-inter rounded-full',
//           InTransit:
//             'bg-[#D5D9EB] text-[#363F72] text-center py-1 text-sm font-medium font-inter rounded-full',
//         }[status] || '';

//       return <div className={styles}>{status}</div>;
//       //   console.log(status);
//     },
//   },
//   {
//     accessorKey: 'amount',
//     header: 'Action',
//   },
// ];

// interface PageChangeParams {
//   pageNumber?: number;
//   selectedDate?: string;
//   Status?: string;
// }

// export default function Delivery() {
//   const [deliveriesData, setDeliveriesData] = useState<Payment[]>([]);
//   const [stats, setStats] = useState({});
//   const [unassignOrder, setUnassignOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [page, setPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const pageSize = 8;

//   async function handlePageChange(params: PageChangeParams = {}) {
//     const { pageNumber = 1, selectedDate = 'Today', Status = 'Active' } = params;
//     try {
//       const { data } = await getUnassignOrdersAndStatsByUser(page);

//       console.log({ pageNumber, selectedDate, Status });
//       setTimeout(() => {
//         setStats(data?.stats);
//         setUnassignOrders(data?.orders);
//         setDeliveriesData(data?.deliveries);
//         setTotalCount(data?.deliveries?.length);
//         setPage(pageNumber);
//         setIsLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error('Error loading data:', error);
//       setIsLoading(false);
//       setDeliveriesData([]);
//     }
//   }

//   useEffect(() => {
//     handlePageChange({ pageNumber: 1 });

//     // setDeliveriesData(tData);
//   }, []);

//   return (
//     <section className="min-h-screen rounded-md bg-white p-4 md:p-8">
//       <DeliveryStats stat={stats} />
//       <AssignOrderList orders={unassignOrder} onAssignSuccess={handlePageChange} />
//       <ReDataTable
//         label="Deliveries"
//         columns={columns}
//         data={deliveriesData}
//         isLoading={false}
//         onPageChange={handlePageChange}
//         rowClickMode="none"
//         count={totalCount}
//         page={page}
//         setPage={setPage}
//         pageSize={pageSize}
//         dateFilter={{
//           enabled: true,
//           defaultValue: 'Today',
//         }}
//         filters={[
//           {
//             name: 'Status',
//             placeholder: 'Select a State',
//             options: [
//               { label: 'Active', value: 'Active' },
//               { label: 'Suspended', value: 'Suspended' },
//               { label: 'Pending', value: 'Pending' },
//             ],
//           },
//         ]}
//       />
//     </section>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ReDataTable } from '../../adminDashboard/shared/ReDateTable';
import AssignOrderList from './AssignOrderList';
import DeliveryStats from './DeliveryStats';
import { getUnassignOrdersAndStatsByUser } from '@/lib/actions/order/order.actions';
import { Button } from '@/components/ui/button';

export type Payment = {
  id: string;
  date: string;
  deliveryCompany: string;
  amount: string;
  status: string;
  trackingNumber?: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'deliveryCompany',
    header: 'Delivery Company',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          REQUESTED:
            'bg-[#E0F2FE] text-[#0369A1] text-center py-1 text-sm font-medium font-inter rounded-full',
          ACCEPTED:
            'bg-[#ABEFC6] text-[#067647] text-center py-1 text-sm font-medium font-inter rounded-full',
          REJECTED:
            'bg-[#FEE4E2] text-[#B42318] text-center py-1 text-sm font-medium font-inter rounded-full',
          PICKED_UP:
            'bg-[#FEF9C3] text-[#854D0E] text-center py-1 text-sm font-medium font-inter rounded-full',
          IN_TRANSIT:
            'bg-[#D5D9EB] text-[#363F72] text-center py-1 text-sm font-medium font-inter rounded-full',
          DELIVERED:
            'bg-[#D1FADF] text-[#027A48] text-center py-1 text-sm font-medium font-inter rounded-full',
          FAILED:
            'bg-[#FEE4E2] text-[#B42318] text-center py-1 text-sm font-medium font-inter rounded-full',
          RETURNED:
            'bg-[#FFE4E6] text-[#9F1239] text-center py-1 text-sm font-medium font-inter rounded-full',
          RETRY:
            'bg-[#FDE68A] text-[#92400E] text-center py-1 text-sm font-medium font-inter rounded-full',
        }[status] || 'bg-gray-100 text-gray-600 text-center py-1 text-sm font-medium rounded-full';

      return <div className={styles}>{status}</div>;
    },
  },

  // ---------- DYNAMIC ACTION COLUMN ----------
  {
    id: 'action',
    header: 'Action',
    cell({ row }) {
      const delivery = row.original;
      const status = delivery.status;
      const trackingNumber = delivery.trackingNumber;

      if (status === 'ACCEPTED') {
        return (
          <Button
            size="sm"
            className="bg-[#027A48] text-white hover:bg-[#01663C]"
            onClick={() => console.log(`Pay now for ${delivery.id}`)}
          >
            Pay Now
          </Button>
        );
      }

      if (status === 'REJECTED') {
        return (
          <Button
            size="sm"
            className="bg-[#B54708] text-white hover:bg-[#933C07]"
            onClick={() => console.log(`Reassign delivery partner for ${delivery.id}`)}
          >
            Re-Assign
          </Button>
        );
      }

      if (trackingNumber) {
        return (
          <Button
            size="sm"
            className="bg-[#1D4ED8] text-white hover:bg-[#153EA1]"
            onClick={() => console.log(`View details for ${delivery.id}`)}
          >
            View
          </Button>
        );
      }

      // Default fallback
      return <span className="text-gray-400 text-sm italic">No Action</span>;
    },
  },
];

interface PageChangeParams {
  pageNumber?: number;
  selectedDate?: string;
  Status?: string;
}

export default function Delivery() {
  const [deliveriesData, setDeliveriesData] = useState<Payment[]>([]);
  const [stats, setStats] = useState({});
  const [unassignOrder, setUnassignOrders] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 8;

  async function handlePageChange(params: PageChangeParams = {}) {
    const { pageNumber = 1 } = params;
    try {
      const { data } = await getUnassignOrdersAndStatsByUser(pageNumber);
      setTimeout(() => {
        setStats(data?.stats);
        setUnassignOrders(data?.orders);
        setDeliveriesData(data?.deliveries);
        setTotalCount(data?.deliveries?.length || 0);
        setPage(pageNumber);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
      setDeliveriesData([]);
    }
  }

  useEffect(() => {
    handlePageChange({ pageNumber: 1 });
  }, []);

  return (
    <section className="min-h-screen rounded-md bg-white p-4 md:p-8">
      <DeliveryStats stat={stats} />
      <AssignOrderList
        orders={unassignOrder}
        onAssignSuccess={handlePageChange}
        onStatusChange={handlePageChange}
      />
      <ReDataTable
        label="Deliveries"
        columns={columns}
        data={deliveriesData}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        rowClickMode="none"
        count={totalCount}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        dateFilter={{
          enabled: true,
          defaultValue: 'Today',
        }}
        filters={[
          {
            name: 'Status',
            placeholder: 'Select a State',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Suspended', value: 'Suspended' },
              { label: 'Pending', value: 'Pending' },
            ],
          },
        ]}
      />
    </section>
  );
}
