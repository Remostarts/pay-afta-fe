'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGeneral } from '@/context/generalProvider';

type User = { id: string; firstName: string; lastName: string };
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
  const router = useRouter();
  const { session, user } = useGeneral();

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/get-by-user?page=1&limit=3`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: session?.accessToken || '',
          },
          cache: 'no-store',
        }
      );

      if (!res.ok) throw new Error(`Error fetching: ${res.statusText}`);
      const data = await res.json();
      setOrders(data?.data?.data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusStyles: Record<string, { label: string; bg: string; text: string }> = {
    AGREEMENT: { label: 'Agreement', bg: 'bg-[#E8FDEF]', text: 'text-[#0F973C]' },
    PAYMENT: { label: 'Payment', bg: 'bg-[#FCE9E9]', text: 'text-[#D33030]' },
    SHIPPING: { label: 'In-transit', bg: 'bg-[#FFF8E1]', text: 'text-[#FFA000]' },
    DELIVERY: { label: 'Delivered', bg: 'bg-[#E6E7FE]', text: 'text-[#070AC5]' },
    CLOSED: { label: 'Awaiting Agreement', bg: 'bg-gray-200', text: 'text-gray-600' },
    DISPUTED: { label: 'Dispute', bg: 'bg-[#FFE5EC]', text: 'text-[#C21807]' },
    CANCELED: { label: 'Canceled', bg: 'bg-gray-300', text: 'text-gray-800' },
  };

  return (
    <div className="mt-5 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-inter text-lg font-semibold text-[#333333]">Recent Orders</h2>
        <button
          className="font-inter text-sm font-bold text-[#6B6DFA] hover:text-[#5759e6] transition"
          onClick={() => router.push('/dashboard/track-links')}
        >
          VIEW ALL
        </button>
      </div>

      {/* Orders */}
      {!isLoading && orders.length > 0 ? (
        orders.map((service, index) => {
          const { bg, text, label } = statusStyles[service.status] ?? statusStyles.CLOSED;
          const counterpart =
            service.buyer?.id === user?.id
              ? `${service.seller?.firstName} ${service.seller?.lastName}`
              : `${service.buyer?.firstName} ${service.buyer?.lastName}` || 'Unknown User';
          const role = service.seller?.id === user?.id ? 'Seller' : 'Buyer';

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b last:border-b-0 py-4 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-inter font-medium text-gray-800">
                  {counterpart && counterpart.trim() !== '' && counterpart !== 'undefined undefined'
                    ? counterpart
                    : 'Guest User'}
                </h3>
                <span className="font-inter text-2xl font-semibold text-gray-900">
                  ₦{service.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-inter text-sm font-medium text-gray-600">{role}</p>
                <span
                  className={`font-inter text-sm font-medium rounded-full px-4 py-1 ${bg} ${text}`}
                >
                  {label}
                </span>
              </div>
            </motion.div>
          );
        })
      ) : isLoading ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          Loading recent orders...
        </div>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center">
          <Image
            src="/assets/dashboard/Dashboard/no-payment-history.svg"
            alt="No payment history"
            width={139}
            height={146}
          />
          <p className="mt-4 text-sm text-gray-500">No recent orders found</p>
        </div>
      )}
    </div>
  );
}
