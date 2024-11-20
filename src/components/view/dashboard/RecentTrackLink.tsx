'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock data for pending services
const pendingServices = [
  {
    user: 'Cameron Williamson',
    payment: '1,000,000',
    type: 'Buyer',
    paymentType: 'Agreement',
  },
  {
    user: 'Cameron Willson',
    payment: '1,000,000',
    type: 'Buyer',
    paymentType: 'Payment',
  },
  {
    user: 'Cameron Will',
    payment: '1,000',
    type: 'Seller',
    paymentType: 'Delivery',
  },
];

export default function RecentTrackLink() {
  const route = useRouter();

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center text-lg font-semibold text-gray-800">
          Recent Track Link
          {/* <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-sm">2</span> */}
        </h2>
        <button
          className="text-sm text-blue-600"
          onClick={() => route.push('/lawyer/lawyers/briefs')}
        >
          VIEW ALL
        </button>
      </div>
      <div className="">
        {pendingServices?.length > 0 ? (
          pendingServices?.map((service, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{service?.user || 'Unknown User'}</h3>
                <span className="font-inter text-2xl font-bold">{service?.payment}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <p className="mb-2 font-inter text-sm font-medium text-gray-600">{service?.type}</p>
                <span
                  className={`rounded-full p-1 px-4 font-inter text-sm ${service.paymentType === 'Agreement' ? 'bg-[#E8FDEF] text-[#0F973C]' : service.paymentType === 'Payment' ? 'bg-[#FCE9E9] text-[#D42620]' : service.paymentType === 'Delivery' ? 'bg-[#E6E7FE] text-[#070AC5]' : 'bg-gray-300 text-gray-800'}`}
                >
                  {service?.paymentType}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-80 items-center justify-center">
            <Image
              src="/assets/dashboard/Dashboard/no-payment-history.svg"
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
