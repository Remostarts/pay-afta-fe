'use client';

import { ArrowLeft, CheckCircle, Pencil, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function RiderProfileInfo() {
  const [tabValue, setTabValue] = useState('ProfileInfo');
  const [status, setStatus] = useState<'verified' | 'unverified'>('unverified');
  const [profileImage, setProfileImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="w-full bg-white min-h-screen rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200">
        <Link href="/admin-dashboard/rider">
          <Button variant="ghost" size="sm" className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Nipost EMS</h1>
          <p className="text-sm text-gray-500">Users / US-123456789</p>
        </div>
      </div>

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
          <Button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 text-sm">
            Add Rider
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {/* Profile Information */}
        <section className=" border-2 border-[#f1f1f1] rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Customer Name:</label>
              <p className="text-base text-gray-900 font-medium">Nipost EMS</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Phone:</label>
              <p className="text-base text-gray-900 font-medium">07012345678</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Pickup Address:</label>
              <p className="text-base text-gray-900 font-medium">Warehouse B</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Drop-off Address:</label>
              <p className="text-base text-gray-900 font-medium">Warehouse B</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Package Info:</label>
              <p className="text-base text-gray-900 font-medium">HP EliteBook 840 G5 - 8GB RAM</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Date / Time</label>
              <p className="text-base text-gray-900 font-medium">September 16, 2025 11:05 am</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Order ID:</label>
              <p className="text-base text-gray-900 font-medium">1424445</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Tracking Code:</label>
              <p className="text-base text-gray-900 font-medium">1424445</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Payment Mode:</label>
              <p className="text-base text-gray-900 font-medium"> Pay on Delivery</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Status</label>
              <span className="bg-[#FCE9E9] text-[#D42620] text-center p-2 rounded-md text-sm font-medium font-inter">
                Panding
              </span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1">Email Address:</label>
              <p className="text-base text-gray-900 font-medium">support@nipost.ems</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
