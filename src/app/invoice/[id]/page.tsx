'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InvoicePreview from '@/components/view/public/InvoicePreview';
import { fetchOrderById, InvoiceData } from '@/lib/actions/order/order.client-actions';

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderData = async () => {
      if (!invoiceId) {
        setError('Invalid invoice ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchOrderById(invoiceId);

        console.log(data);

        setInvoiceData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading invoice:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load invoice data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadOrderData();
  }, [invoiceId]);

  console.log('Invoice ID:', invoiceId);
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log('Invoice Data:', invoiceData);

  if (loading) {
    return (
      <section className="">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading invoice...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Invoice</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="container mx-auto px-4 py-8">
        {invoiceData ? (
          <InvoicePreview orderId={invoiceId} invoiceData={invoiceData} />
        ) : (
          <div className="text-center text-gray-600">No invoice data available.</div>
        )}
      </div>
    </section>
  );
}
