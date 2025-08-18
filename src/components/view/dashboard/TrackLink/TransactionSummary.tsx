import { ChevronUp, Download } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function TransactionSummary() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex items-center rounded-lg bg-gray-100 p-3">
            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-inter text-lg font-medium text-gray-900">View Order Details</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-2 flex flex-col gap-4 text-balance rounded-lg bg-gray-100 p-3">
            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-inter text-lg font-medium text-gray-900">Transaction Summary</h2>
            </div>

            {/* Top Summary Row */}
            <div className="mb-8 grid grid-cols-4 gap-6 border-b border-gray-100 pb-6">
              <div>
                <p className="mb-1 font-inter text-sm text-gray-500">Buyer</p>
                <p className="font-inter text-sm font-medium text-gray-900">Paul Simeon</p>
              </div>
              <div>
                <p className="mb-1 font-inter text-sm text-gray-500">Seller</p>
                <p className="font-inter text-sm font-medium text-gray-900">Adaeze Nwosu</p>
              </div>
              <div>
                <p className="mb-1 font-inter text-sm text-gray-500">Payment Method</p>
                <p className="font-inter text-sm font-medium text-gray-900">One Time</p>
              </div>
              <div>
                <p className="mb-1 font-inter text-sm text-gray-500">Expected Delivery</p>
                <p className="font-inter text-sm font-medium text-gray-900">November 24, 2023</p>
              </div>
            </div>

            {/* Detailed Transaction Summary */}
            <div className="space-y-6">
              <h3 className="font-inter text-base font-medium text-gray-900">
                Transaction Summary
              </h3>

              <div className="space-y-4">
                {/* Escrow ID */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">Escrow ID:</span>
                  <span className="font-inter text-sm font-medium text-gray-900">#0000749268</span>
                </div>

                {/* Buyer */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">Buyer:</span>
                  <span className="font-inter text-sm font-medium text-gray-900">
                    Paul Simeon (@paul.pfta)
                  </span>
                </div>

                {/* Seller */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">Seller:</span>
                  <span className="font-inter text-sm font-medium text-gray-900">
                    Adaeze Nwosu (@adaeze.pfta)
                  </span>
                </div>

                {/* Item */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">Item:</span>
                  <span className="font-inter text-sm font-medium text-gray-900">
                    HP EliteBook 840 G5 - 8GB RAM
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">Quantity:</span>
                  <span className="font-inter text-sm font-medium text-gray-900">1 Unit</span>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">Amount:</span>
                  <span className="font-inter text-sm font-medium text-gray-900">₦300,000</span>
                </div>
              </div>

              {/* Download Button */}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E6E7FE] px-4 py-3 text-[#03045B]">
                <span className="font-inter text-sm font-medium">
                  View/Download Escrow Agreement (PDF)
                </span>
                <Download className="size-4" />
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
