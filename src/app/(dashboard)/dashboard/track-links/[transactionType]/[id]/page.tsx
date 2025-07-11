'use client';

import { useParams, useRouter } from 'next/navigation';

import TransactionsSummaryForProduct from '@/components/view/dashboard/TrackLink/TransactionsSummaryForProduct';
import TransactionsSummaryForService from '@/components/view/dashboard/TrackLink/TransactionsSummaryForService';

export default function TransactionPage() {
  const router = useRouter();
  const { transactionType, id } = useParams();
  console.log('🌼 🔥🔥 TransactionPage 🔥🔥 transactionType🌼', transactionType);
  console.log('🌼 🔥🔥 TransactionPage 🔥🔥 id🌼', id);

  function handleBackToTable() {
    router.push('/dashboard/track-links');
  }

  return (
    <section className="min-h-screen w-full rounded-md bg-gray-50">
      {transactionType === 'Product' ? (
        <TransactionsSummaryForProduct onBack={handleBackToTable} id={id as string} />
      ) : (
        <TransactionsSummaryForService onBack={handleBackToTable} id={id as string} />
      )}
    </section>
  );
}
