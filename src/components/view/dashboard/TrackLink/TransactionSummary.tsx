'use client';

import { Download } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { OrderDetails } from '@/types/order';
import { toast } from 'sonner';
import {
  GeneratePendingAgreementPdf,
  GenerateSignedAgreementPdf,
} from '@/helpers/utils/pdfCreation';
interface TransactionSummaryProps {
  order?: OrderDetails | null;
}

export default function TransactionSummary({ order }: TransactionSummaryProps) {
  console.log('🌼 🔥🔥 TransactionSummary 🔥🔥 order🌼', order);

  const handleDownload = (version: 'pending' | 'signed') => {
    if (!order) {
      toast.error('Unable to generate agreement – order not found.');
      return;
    }

    try {
      if (version === 'pending') {
        GeneratePendingAgreementPdf(order);
      } else if (version === 'signed') {
        GenerateSignedAgreementPdf(order);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate agreement PDF.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex w-full items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">View Order Details</h2>
            </div>
          </AccordionTrigger>

          <AccordionContent className="px-6 pb-6">
            {/* Header */}
            <div className="mt-2 mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-semibold text-gray-900">Transaction Summary</h3>
              {/* <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button> */}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
              <SummaryCard
                label="Buyer"
                value={
                  order?.buyer
                    ? `${order?.buyer?.firstName} ${order?.buyer?.lastName}`
                    : 'Guest User'
                }
              />
              <SummaryCard
                label="Seller"
                value={
                  order?.seller
                    ? `${order?.seller?.firstName} ${order?.seller?.lastName}`
                    : 'Guest User'
                }
              />
              <SummaryCard label="Payment Method" value={`${order?.paymentType}  `} />
              <SummaryCard
                label="Expected Delivery"
                value={
                  order?.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '--'
                }
              />
            </div>

            {/* Details Section */}
            <div className="mt-8">
              <h4 className="mb-4 text-base font-semibold text-gray-900">Details</h4>
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                {/* <DetailRow label="Escrow ID" value="#0000749268" /> */}
                <DetailRow
                  label="Buyer"
                  value={`${order?.buyer?.firstName} ${order?.buyer?.lastName} (@${order?.buyer?.username})`}
                />
                <DetailRow
                  label="Seller"
                  value={`${order?.seller?.firstName} ${order?.seller?.lastName} (@${order?.seller?.username})`}
                />
                <DetailRow label="Item" value={`${order?.detailAboutItem}`} />
                <DetailRow label="Quantity" value={`${order?.items?.[0]?.quantity ?? 0}`} />
                <DetailRow label="Amount" value={`₦${order?.amount}`} />
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleDownload('signed')}
              className="mb-8 flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
            >
              <Download className="h-4 w-4" />
              Download Escrow Agreement (PDF)
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/* Helper Components */
const SummaryCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between px-4 py-3 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);
