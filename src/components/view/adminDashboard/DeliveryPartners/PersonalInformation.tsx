'use client';

import { ArrowLeft, CheckCircle, Pencil, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Delivery from './Delivery';
import Transaction from './Transaction';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { TUserDetails } from '@/types/admin/user.type';

export function PersonalInformation() {
  const [tabValue, setTabValue] = useState('ProfileInfo');
  const [status, setStatus] = useState<'verified' | 'unverified'>('unverified');
  const [profileImage, setProfileImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
    const { id } = useParams();
    console.log('🌼 🔥🔥 UserDetails 🔥🔥 userId🌼', id);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<TUserDetails>({} as TUserDetails);

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

  const handleStatusChange = (newStatus: 'verified' | 'unverified') => {
    setStatus(newStatus);
    toast.success(`Status changed to ${newStatus}`);
    // Here you would make an API call to update the status
    console.log('Status changed to:', newStatus);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // Here you would upload the image to your server
      console.log('Selected image file:', file);
    }
  };

    const handleLoadUserData = async (userId: string) => {
      // Optional: Handle filter change
      setIsLoading(true);
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // authorization: session?.accessToken as string,
          },
          cache: 'no-store',
        });
        const data = await response.json();
  
        console.log('🌼 🔥🔥 handleTransactionFilterChange 🔥🔥 data🌼', data);
  
        if (data?.success) {
          setUser(data?.data);
        } else {
          toast.error(data?.errorName || 'Failed to load users');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      handleLoadUserData(id as string);
    }, [id]);

    // change logistic verification status
      const handleLogisticVerification = async (status: boolean) => {
      console.log('🌼 🔥🔥 handleLogisticVerification 🔥🔥 status🌼', status);

      // Optional: Handle filter change
      setIsLoading(true);
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/verify/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // authorization: session?.accessToken as string,
          },
          cache: 'no-store',
          body: JSON.stringify({ isVerified: status }),
        });
        const data = await response.json();
  
        console.log('🌼 🔥🔥 handleTransactionFilterChange 🔥🔥 data🌼', data);
  
        if (data?.success) {
          toast.success(`User has been ${status ? 'verified' : 'unverified'}`);
        } else {
          toast.error(data?.errorName || 'Failed to update verification status');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to update verification status');
      } finally {
        setIsLoading(false);
      }
    };

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
          <p className="text-sm text-gray-500">Users / {id}</p>
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

        <div className="flex items-center justify-between p-4 bg-background">
          {/* Profile Avatar with Verification Badge */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <Avatar className="h-16 w-16 cursor-pointer rounded-full" onClick={handleImageClick}>
              <AvatarImage
                src={profileImage || '/assets/admin-dashboard/dashboard/dummyUserImage.jpg'}
                alt="Profile picture"
                className="rounded-full object-cover"
                width={150}
                height={150}
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {/* Verification Badge */}
            <div
              className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 cursor-pointer"
              onClick={handleImageClick}
            >
              <Pencil className="h-3 w-3 text-white fill-current" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-2 text-sm"
                >
                  CHANGE STATUS
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleLogisticVerification(true)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogisticVerification(false)}>
                  <span className="mr-2">❌</span>
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 text-sm">
              EDIT PROFILE
            </Button>
          </div>
        </div>

        <TabsContent value="ProfileInfo">
          <div className="p-4 md:p-6 space-y-8">
            {/* Profile Information */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Business Name:</label>
                  <p className="text-base text-gray-900 font-medium">No available</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone:</label>
                  <p className="text-base text-gray-900 font-medium">{user?.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-500 mb-1">Email Address:</label>
                  <p className="text-base text-gray-900 font-medium">{user?.email}</p>
                </div>
              </div>
            </section>

            {/* Service Zones */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Zones</h2>
              <div>
                <label className="block text-sm text-gray-500 mb-2">City/Regions:</label>
                <div className="flex flex-wrap gap-2">
                  {/* {serviceZones.map((zone, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-900 text-sm font-medium rounded-md"
                    >
                      {zone}
                    </span>
                  ))} */}
                  Not Available
                </div>
              </div>
            </section>

            {/* Availability */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* {availabilityData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <label className="block text-sm text-gray-500">{item.day}:</label>
                    <p className="text-base text-gray-900 font-medium">{item.hours}</p>
                  </div>
                ))} */}

              </div>
            </section>

            {/* Delivery Preference */}
            <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Preference</h2>
              {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
              </div> */}
              Not Available
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
