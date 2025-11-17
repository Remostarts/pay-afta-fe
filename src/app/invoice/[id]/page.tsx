'use client';

import { useParams } from 'next/navigation';
import InvoicePreview from '@/components/view/public/InvoicePreview';

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  return (
    <section className="">
      <div className="">
        <InvoicePreview orderId={invoiceId} />
      </div>
    </section>
  );
}
