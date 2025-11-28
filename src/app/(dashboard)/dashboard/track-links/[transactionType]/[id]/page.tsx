'use client';

import { useParams, useRouter } from 'next/navigation';

// import TransactionsSummaryForProduct from '@/components/view/dashboard/TrackLink/TransactionsSummaryForProduct';
// import TransactionsSummaryForService from '@/components/view/dashboard/TrackLink/TransactionsSummaryForService';
import TransactionsSummaryBase from '@/components/view/dashboard/TrackLink/TransactionsSummaryBase';

export default function TransactionPage() {
  const router = useRouter();
  const { transactionType, id } = useParams();

  function handleBackToTable() {
    router.push('/dashboard/track-links');
  }

  return (
    <section className="min-h-screen w-full rounded-md bg-gray-50">
      {transactionType === 'Product' ? (
        <TransactionsSummaryBase id={id as string} type="product" onBack={handleBackToTable} />
      ) : (
        <TransactionsSummaryBase id={id as string} type="service" onBack={handleBackToTable} />
      )}
    </section>
  );
}
