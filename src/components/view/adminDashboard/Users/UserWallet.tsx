import { ColumnDef } from '@tanstack/react-table';

import { UserWalletDataTable } from './UserWalletDataTable';

export type Payment = {
  type: string;
  amount: string;
  date: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'type',
    header: 'TYPE',
  },
  {
    accessorKey: 'amount',
    header: 'AMOUNT',
  },
  {
    accessorKey: 'date',
    header: 'DATE',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell({ row }) {
      const status = row.getValue('status') as string;

      const styles =
        {
          Active: ' text-[#0F973C] text-center py-1 text-sm font-medium font-inter',
          Pending: 'text-[#1F7EAD] text-center py-1 text-sm font-medium font-inter',
          Suspended: 'text-[#D42620] text-center py-1 text-sm font-medium font-inter',
        }[status] || '';

      return <div className={styles}>{status}</div>;
      //   console.log(status);
    },
  },
];

const data = [
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Pending',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
  {
    type: 'Wallet Funded',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Suspended',
  },
  {
    type: 'Withdrawal',
    amount: '₦1,500,000.00',
    date: '15 Jun, 2024',
    status: 'Active',
  },
];

export default function UserWallet() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-4">
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Balance</p>
          <p className="font-inter text-xl font-semibold">₦0.00</p>
        </div>
        <div className="mt-2 rounded-md border-2 border-gray-200 bg-white p-3">
          <p className="font-inter text-sm text-gray-500">Escrow Balance</p>
          <p className="font-inter text-xl font-semibold">₦0.00</p>
        </div>
      </div>
      <div>
        <div className="container mx-auto rounded-md bg-white p-5">
          <UserWalletDataTable columns={columns} data={data} />
        </div>
      </div>
    </section>
  );
}
