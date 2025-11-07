'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import TopCards from './TopCards';
import DeliveryAnalysis from './DeliveryAnalysis';
import AwaitingConfirmation from './AwaitingConfirmation';
import { getLogisticDashboardDeliveries } from '@/lib/actions/delivery/delivery.actions';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await getLogisticDashboardDeliveries();
        if (res?.success) {
          setData(res.data);
        } else {
          toast.error(res?.message || 'Failed to load dashboard data.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong while fetching deliveries.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="min-h-screen p-4 font-sans">
      <TopCards />
      <DeliveryAnalysis stats={data?.stats} />
      <AwaitingConfirmation initialOrders={data?.deliveries} />
    </section>
  );
}
