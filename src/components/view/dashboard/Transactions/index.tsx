import { Payment, columns } from '../../../../constants/dashboard/transactions/shared';
import { DataTable } from '../shared/dataTable';
import ProfileHeader from '../shared/ProfileHeader';

const data = [
  {
    id: '1',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Credit',
  },
  {
    id: '2',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Track Link',
  },
  {
    id: '3',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Credit',
  },
  {
    id: '4',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Withdrawal',
  },
  {
    id: '5',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Withdrawal',
  },
  {
    id: '6',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Card Funded',
  },
  {
    id: '7',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Credit',
  },
  {
    id: '8',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Credit',
  },
  {
    id: '9',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Track Link',
  },
  {
    id: '10',
    date: '24-10-2024, 10:23pm',
    amount: 500000.0,
    status: 'Successful',
    transcationType: 'Withdrawal',
  },
];

export default function Transcations() {
  return (
    <section>
      <div className="container mx-auto h-screen bg-white">
        <div className="hidden lg:m-6 lg:block">
          <ProfileHeader />
        </div>
        <div className="mb-5">
          <h1 className="font-inter text-3xl font-semibold">Transaction History</h1>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </section>
  );
}
