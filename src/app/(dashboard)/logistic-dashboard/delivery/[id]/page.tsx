'use client';
import { useParams } from 'next/navigation';
import OrderDeliveryTracker from '@/components/view/logisticDashboard/TrackLink';

export default function Page() {
  const params = useParams();
  const deliveryId = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!deliveryId) return <div>Delivery ID missing</div>;
  return (
    <section>
      <OrderDeliveryTracker deliveryId={deliveryId as string} />
    </section>
  );
}
