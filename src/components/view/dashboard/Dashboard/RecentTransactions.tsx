'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock data for pending services
const pendingServices: any[] = [
  // {
  //   transactionsType: 'Link Payment',
  //   paymentAmount: '1,000,000',
  //   date: '25th Sep,2023',
  //   payment: 'successful',
  // },
  // {
  //   transactionsType: 'Withdrawal',
  //   paymentAmount: '1,000,000',
  //   date: '25th Sep,2023',
  //   payment: 'successful',
  // },
  // {
  //   transactionsType: 'Credit',
  //   paymentAmount: '1,000',
  //   date: '25th Sep,2023',
  //   payment: 'successful',
  // },
];

export default function RecentTransactions() {
  const route = useRouter();

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center text-lg font-semibold text-gray-800">
          Recent Transactions
          {/* <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-sm">2</span> */}
        </h2>
        <button
          className="text-sm text-blue-600"
          onClick={() => route.push('/dashboard/transactions')}
        >
          VIEW ALL
        </button>
      </div>
      <div className="">
        {pendingServices?.length > 0 ? (
          pendingServices?.map((service, index) => (
            <div key={index} className="flex gap-4 border-b pb-4 last:border-b-0">
              <div className="shrink-0">
                <span className="inline-block">
                  <Image
                    src={`${service.transactionsType === 'Link Payment' ? '/assets/dashboard/Dashboard/credit.svg' : service.transactionsType === 'Withdrawal' ? '/assets/dashboard/Dashboard/withdrawal.svg' : '/assets/dashboard/Dashboard/credit.svg'}`}
                    alt="Logo"
                    width={48}
                    height={48}
                  />
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-inter font-semibold">{service.transactionsType}</h3>
                  <span className="font-inter text-2xl font-semibold">{service.paymentAmount}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="mb-2 font-inter text-sm font-medium text-gray-600">
                    {service.date}
                  </p>
                  <span
                    className={`rounded-full bg-green-100 p-1 px-4 font-inter text-sm text-green-800`}
                  >
                    {service.payment}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-80 items-center justify-center">
            <Image
              src="/assets/dashboard/Dashboard/no-transaction-history.svg"
              alt="no payment history"
              width={139}
              height={146.14}
            />
          </div>
        )}
      </div>
    </div>
  );
}
