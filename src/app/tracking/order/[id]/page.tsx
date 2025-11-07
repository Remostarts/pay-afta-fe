// Public delivery tracking page

'use client';

import OrderTracker from '@/components/view/public/OrderTracker';
import { useParams, useSearchParams } from 'next/navigation';

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const trackingId = params.id as string;
  const type = searchParams.get('type') || 'delivery';

  // Validate that we have a delivery ID
  if (!trackingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Tracking Link</h1>
          <p className="text-gray-600">Please check your tracking link and try again.</p>
        </div>
      </div>
    );
  }

  // Show page with OrderTracker component
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <OrderTracker trackingId={trackingId} />
      </div>
    </div>
  );
}
