// import { stat } from 'fs';

import Image from 'next/image';

// Mock data for stats
const stats = [
  {
    title: 'Total Balance',
    value: '₦ 9,000,000.00',
    icon: '/assets/admin-dashboard/virtual-card/total-balance.svg',
    //   backgroundColor: 'bg-[#03045B]',
  },
  {
    title: 'Cards Issued',
    value: '10',
    icon: '/assets/admin-dashboard/virtual-card/card-issued.svg',
    //   backgroundColor: 'bg-[white]',
  },
];
export default function StatsSection() {
  return (
    <div className="mt-5 grid w-full md:grid-cols-2">
      {stats?.map((stat, index) => (
        <div
          key={index}
          className={`ml-2 mt-2 flex items-center gap-5 rounded-lg border bg-white p-8`}
        >
          <div>
            <Image src={stat?.icon} alt={stat?.title} width={40} height={40} />
          </div>
          <div>
            <p className="font-inter text-sm text-gray-600">{stat?.title}</p>
            <p className="font-inter text-lg font-semibold"> {stat?.value || 0.0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
