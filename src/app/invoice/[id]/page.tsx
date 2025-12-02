'use client';

import { InvoicePreview } from '@/components/view/public/InvoicePreview';
import { useParams } from 'next/navigation';

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  return (
    <section className="">
      <div className="container mx-auto px-4 py-8">
        {invoiceId ? (
          <InvoicePreview orderId={invoiceId} />
        ) : (
          <div className="text-center text-gray-600">No order data available.</div>
        )}
      </div>
    </section>
  );
}
