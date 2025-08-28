'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Delivery from './Delivery';
import Transaction from './Transaction';

import React, { useState } from 'react';
import Link from 'next/link';

export function PersonalInformation() {
  const [tabValue, setTabValue] = useState('ProfileInfo');
  const availabilityData = [
    { day: 'Sunday', hours: 'No' },
    { day: 'Monday', hours: '9:30 - 6:30PM' },
    { day: 'Tuesday', hours: '9:30 - 6:30PM' },
    { day: 'Wednesday', hours: '9:30 - 6:30PM' },
    { day: 'Thursday', hours: '9:30 - 6:30PM' },
    { day: 'Friday', hours: '9:30 - 6:30PM' },
    { day: 'Saturday', hours: '9:30 - 6:30PM' },
  ];

  const serviceZones = ['Lekki', 'Ajah', 'Ikorodu'];

  return (
    <div className="w-full bg-white min-h-screen rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200">
        <Link href="/admin-dashboard/delivery-partners">
          <Button variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Nipost EMS</h1>
          <p className="text-sm text-gray-500">Users / US-123456789</p>
        </div>
      </div>
      {/* Navigation Tabs */}
      <Tabs value={tabValue} onValueChange={setTabValue} defaultValue="ProfileInfo">
        <TabsList>
          <div className="border-b border-gray-200">
            <nav className="flex px-4">
              <TabsTrigger
                value="ProfileInfo"
                className={`px-4 py-3 text-sm font-inter font-medium ${tabValue === 'ProfileInfo' ? 'text-[#03045B] border-[#03045B]' : 'text-[#666666] border-[#666666]'} border-b-2`}
              >
                Profile Information
              </TabsTrigger>
              <TabsTrigger
                value="delivery"
                className={`px-4 py-3 text-sm font-inter font-medium ${tabValue === 'delivery' ? 'text-[#03045B] border-[#03045B]' : 'text-[#666666] border-[#666666]'} border-b-2`}
              >
                Delivery
              </TabsTrigger>
              <TabsTrigger
                value="transaction"
                className={`px-4 py-3 text-sm font-inter font-medium ${tabValue === 'transaction' ? 'text-[#03045B] border-[#03045B]' : 'text-[#666666] border-[#666666]'} border-b-2`}
              >
                Transaction
              </TabsTrigger>
            </nav>
          </div>
        </TabsList>

        <TabsContent value="ProfileInfo">
          <div className="p-4 md:p-6 space-y-8">
            {/* Profile Information */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Business Name:</label>
                  <p className="text-base text-gray-900 font-medium">Nipost EMS</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone:</label>
                  <p className="text-base text-gray-900 font-medium">07012345678</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500 mb-1">Email Address:</label>
                  <p className="text-base text-gray-900 font-medium">support@nipost.ems</p>
                </div>
              </div>
            </section>

            {/* Service Zones */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Zones</h2>
              <div>
                <label className="block text-sm text-gray-500 mb-2">City/Regions:</label>
                <div className="flex flex-wrap gap-2">
                  {serviceZones.map((zone, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-900 text-sm font-medium rounded-md"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Availability */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availabilityData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <label className="block text-sm text-gray-500">{item.day}:</label>
                    <p className="text-base text-gray-900 font-medium">{item.hours}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Preference */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Preference</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Pick Up:</label>
                  <p className="text-base text-gray-900 font-medium">Yes</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Drop Off:</label>
                  <p className="text-base text-gray-900 font-medium">No</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Pay on delivery:</label>
                  <p className="text-base text-gray-900 font-medium">Yes</p>
                </div>
              </div>
            </section>
          </div>
        </TabsContent>
        <TabsContent value="delivery">
          <Delivery />
        </TabsContent>
        <TabsContent value="transaction">
          <Transaction />
        </TabsContent>
      </Tabs>
    </div>
  );
}
