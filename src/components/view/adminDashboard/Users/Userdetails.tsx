'use client';

import Image from 'next/image';

import UserWallet from './UserWallet';
import UserPaymentOrder from './UserPaymentOrder';
import UserVirtualCard from './UserVirtualCard';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReHeading } from '@/components/re-ui/ReHeading';
import { ReButton } from '@/components/re-ui/ReButton';

export default function UserDetails() {
  return (
    <section className="grid w-full gap-5 md:grid-cols-5">
      <div className=" rounded-md bg-white p-5 md:col-span-2">
        <div>
          <Image
            src="/assets/admin-dashboard/users/user-avatar.png"
            alt="user profile"
            width={120}
            height={120}
          />
        </div>
        <div>
          <ReHeading heading="Details" size={'lg'} />
          <p className="mt-2 border-t-2 border-gray-200 text-sm text-gray-500">First Name:</p>
          <p className="text-xl font-semibold">Jaxson</p>
          <p className="mt-2 text-sm text-gray-500">Last Name:</p>
          <p className="text-xl font-semibold">Jaxson</p>
          <p className="mt-2 text-sm text-gray-500">Emal Address:</p>
          <p className="text-xl font-semibold">Sethhalla2gmail.com</p>
          <p className="mt-2 text-sm text-gray-500">Phone:</p>
          <p className="text-xl font-semibold">07012345678</p>
          <p className="mt-2 text-sm text-gray-500">Date Of Birth:</p>
          <p className="text-xl font-semibold">Not set</p>
          <p className="mt-2 text-sm text-gray-500">Gender:</p>
          <p className="text-xl font-semibold">Not set</p>
          <p className="mt-2 text-sm text-gray-500">Instagram:</p>
          <p className="text-xl font-semibold">Not set</p>
          <p className="mt-2 text-sm text-gray-500">Facebook:</p>
          <p className="text-xl font-semibold">Not set</p>
        </div>
        <div className="mt-3">
          <ReHeading heading="Settlement Account" size={'lg'} />
          <p className="mt-2 border-t-2 border-gray-200 text-sm text-gray-500">Bank Name:</p>
          <p className="text-xl font-semibold">Lorum Ipsum</p>
          <p className="mt-2 text-sm text-gray-500">Account Number:</p>
          <p className="text-xl font-semibold">0011223344</p>
          <p className="mt-2 text-sm text-gray-500">Account Name:</p>
          <p className="text-xl font-semibold">Lorum Ipsum</p>
        </div>
        <div className="mt-3">
          <ReHeading heading="Verification" size={'lg'} />
          <div className="mt-2 flex gap-2 border-t-2 border-gray-200 text-sm text-gray-500">
            <p className="mt-2 text-sm text-gray-500">NIN Verification:</p>
            <p className="bg-[#E8FDEF] p-2 text-sm font-semibold text-[#0F973C]">Verified</p>
          </div>
          <div className="flex gap-2">
            <p className="mt-2 text-sm text-gray-500">Status:</p>
            <p className="bg-[#E8FDEF] p-2 text-sm font-semibold text-[#0F973C]">Active</p>
          </div>
        </div>
        <div>
          <div className="mt-5 flex justify-between gap-3">
            <ReButton className="hover:bg-[#1A1A1A]] bg-[#1A1A1A] p-2 text-white">
              Change status
            </ReButton>
            <ReButton className="bg-[#159F00] p-2 text-white hover:bg-[#159F00]">
              Edit Profile
            </ReButton>
          </div>
        </div>
      </div>

      <div className=" rounded-md bg-white p-5 md:col-span-3">
        <Tabs defaultValue="Wallet" className="w-full">
          <TabsList className="flex w-full items-center justify-between bg-transparent">
            <TabsTrigger
              value="Wallet"
              className="relative px-4 py-2 data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
            >
              Wallet
            </TabsTrigger>
            <TabsTrigger
              value="Payment Order"
              className="relative px-4 py-2 data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
            >
              Payment Order
            </TabsTrigger>
            <TabsTrigger
              value="Virtual Card"
              className="relative px-4 py-2 data-[state=active]:font-bold data-[state=active]:text-black data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-black data-[state=active]:after:content-['']"
            >
              Virtual Card
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Wallet">
            <UserWallet />
          </TabsContent>
          <TabsContent value="Payment Order">
            <UserPaymentOrder />
          </TabsContent>
          <TabsContent value="Virtual Card">
            <UserVirtualCard />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
