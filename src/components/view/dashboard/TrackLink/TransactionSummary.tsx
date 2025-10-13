'use client';

import { Download } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function TransactionSummary() {
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
              <SummaryCard label="Buyer" value="Paul Simeon" />
              <SummaryCard label="Seller" value="Adaeze Nwosu" />
              <SummaryCard label="Payment Method" value="One Time" />
              <SummaryCard label="Expected Delivery" value="November 24, 2023" />
            </div>

            {/* Details Section */}
            <div className="mt-8">
              <h4 className="mb-4 text-base font-semibold text-gray-900">Details</h4>
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                <DetailRow label="Escrow ID" value="#0000749268" />
                <DetailRow label="Buyer" value="Paul Simeon (@paul.pfta)" />
                <DetailRow label="Seller" value="Adaeze Nwosu (@adaeze.pfta)" />
                <DetailRow label="Item" value="HP EliteBook 840 G5 - 8GB RAM" />
                <DetailRow label="Quantity" value="1 Unit" />
                <DetailRow label="Amount" value="₦300,000" />
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-[#03045B] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#02033d] focus:outline-none focus:ring-2 focus:ring-[#03045B]/30"
            >
              View / Download Escrow Agreement (PDF)
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
