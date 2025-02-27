'use client';

import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import PaymentBuyer from './PaymentBuyer';
import PaymentSeller from './PaymentSeller';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NewOrder({ onBack }: any) {
  const [activeTab, setActiveTab] = useState('buyer');
  return (
    <section className=" bg-white p-5">
      <button onClick={onBack} className="mb-4 flex items-center text-gray-600 hover:text-gray-800">
        <span>
          <ChevronLeft />
        </span>
      </button>
      <Tabs defaultValue="buyer" className="bg-white" onValueChange={setActiveTab}>
        <TabsList className="mb-10 grid grid-cols-2 lg:w-[50%]">
          <TabsTrigger
            value="buyer"
            className={`${
              activeTab === 'buyer' ? 'bg-[#03045B] text-white' : 'bg-gray-200 text-gray-700'
            } rounded-full px-6 py-3 text-base transition-colors`}
          >
            Buyer
          </TabsTrigger>
          <TabsTrigger
            value="seller"
            className={`${
              activeTab === 'seller' ? 'bg-[#03045B] text-white' : 'bg-gray-200 text-gray-700'
            } rounded-full px-6 py-3 text-base transition-colors`}
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
