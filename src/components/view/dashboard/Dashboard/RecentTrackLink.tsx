'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useGeneral } from '@/context/generalProvider';

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

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Order = {
  id: string;
  createdAt: string;
  type: string;
  transactionType: 'Product' | 'Services';
  amount: number;
  payment: string;
  buyer: User;
  seller: User;
  name: string;
  status: string;
};

export default function RecentTrackLink() {
  const route = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  console.log('🌼 🔥🔥 TrackLink 🔥🔥 orders🌼', orders);

  const { session, user } = useGeneral();

  async function handlePageChange() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-by-user?page=1&limit=3`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: session?.accessToken as string,
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching invoice history request: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('🌼 🔥🔥 handleLoadInvoiceHistory 🔥🔥 data🌼', data);

      setOrders(data?.data?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handlePageChange();
  }, []);

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center font-inter text-lg font-semibold text-[#333333]">
          Recent Track Link
          {/* <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-sm">2</span> */}
        </h2>
        <button
          className="font-inter text-sm font-bold text-[#6B6DFA]"
          onClick={() => route.push('/dashboard/track-links')}
        >
          VIEW ALL
        </button>
      </div>
      <div className="">
        {orders?.length > 0 ? (
          orders?.map((service, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">
                  {service?.buyer?.id === user?.id
                    ? `${service?.seller?.firstName} ${service?.seller?.lastName}`
                    : `${service?.buyer?.firstName} ${service?.buyer?.lastName}` || 'Unknown User'}
                </h3>
                <span className="font-inter text-2xl font-semibold">{service?.amount}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <p className="mb-2 font-inter text-sm font-medium text-gray-600">
                  {service?.seller?.id === user?.id ? 'Seller' : 'Buyer'}
                </p>
                <span
                  className={`rounded-full p-1 px-4 font-inter text-sm ${
                    service?.status === 'AGREEMENT'
                      ? 'bg-[#E8FDEF] text-[#0F973C]'
                      : service?.status === 'PAYMENT'
                        ? 'bg-[#FCE9E9] text-[#D42620]'
                        : service?.status === 'SHIPPING'
                          ? 'bg-[#FFF8E1] text-[#FFA000]'
                          : service?.status === 'DELIVERY'
                            ? 'bg-[#E6E7FE] text-[#070AC5]'
                            : service?.status === 'CLOSED'
                              ? 'bg-gray-200 text-gray-600'
                              : service?.status === 'DISPUTED'
                                ? 'bg-[#FFE5EC] text-[#C21807]'
                                : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {service?.status}
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
