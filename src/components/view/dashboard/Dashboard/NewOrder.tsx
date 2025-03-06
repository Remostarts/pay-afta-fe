'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import PaymentBuyer from './PaymentBuyer';
import PaymentSeller from './PaymentSeller';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewOrder({ onBack }: any) {
  const [activeTab, setActiveTab] = useState('buyer');
  return (
    <section className="bg-white p-5">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900"
      >
        <ChevronLeft className="size-5" />
        <span className="text-lg">Create Payment Order</span>
      </button>
      <Tabs defaultValue="buyer" className="bg-white" onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full max-w-xl grid-cols-2 rounded-full bg-gray-100 pb-12">
          <TabsTrigger
            value="buyer"
            className={`
              rounded-full px-6 py-3 text-base font-medium transition-all
              ${activeTab === 'buyer' ? 'bg-[#03045B] text-white' : 'bg-transparent text-gray-500'}
            `}
          >
            Buyer
          </TabsTrigger>
          <TabsTrigger
            value="seller"
            className={`
              rounded-full px-6 py-3 text-base font-medium transition-all
              ${activeTab === 'seller' ? 'bg-[#03045B] text-white' : 'bg-transparent text-gray-500'}
            `}
          >
            Seller
          </TabsTrigger>
        </TabsList>
        <TabsContent value="buyer">
          <PaymentBuyer />
        </TabsContent>
        <TabsContent value="seller">
          <PaymentSeller />
        </TabsContent>
      </Tabs>
    </section>
  );
}
