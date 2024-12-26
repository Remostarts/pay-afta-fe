'use client';

import { CircleArrowLeft, MoreVertical, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// import { DialogProvider } from '../../shared/Dialog';
// import GenerateInvoice from '../../lawyers-dashboard/chats/GenerateInvoice';
// import ReportBusiness from '../../lawyers-dashboard/chats/ReportBusiness';
// import LawyerEndService from '../../lawyers-dashboard/chats/LawyerEndService';
// import SuccessMessage from '../../shared/SuccessMessage';

// import DisputeService from './DisputeService';
// import BusinessEndService from './BusinessEndService';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Chat } from '@/types/chat.type';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useChats } from '@/context/ChatListProvider';
import { getErrorMessage } from '@/lib/responseError';
// import { useSocket } from '@/context/socketProvider';
import { ScrollArea } from '@/components/ui/scroll-area';

type Props = {
  chat: Chat;
};

type File = {
  id: string;
  createdAt: string;
  url: string;
  type: string;
  name: string;
};

const Header = ({ chat }: Props) => {
  // const { close } = useDialog();

  const [files, setFiles] = React.useState<File[]>([]);
  const pathUrl = usePathname();
  const { onlineUsers, session } = useChats();
  // const { socket } = useSocket();
  const pathName = pathUrl.split('/')[1];

  const loadFiles = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/get-file?chatId=${chat.id}&type=image`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: session?.accessToken,
          },
          cache: 'no-store',
        }
      );

      const data = await response.json();
      setFiles(data?.data);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  useEffect(() => {
    // loadFiles();
  }, [session]);

  const otherParticipant = chat.participants?.find((p) => p.id !== session?.id);
  // const isParticipantOnline = socket?.connected && onlineUsers[otherParticipant?.email as string];

  return (
    <>
      <div className="w-full border-b p-4">
        <div className="flex items-center justify-between">
          {/* Chat Info Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Back Button - Only on mobile */}
            <Link href={`/${pathName}/chats`} className="mr-2 block lg:hidden">
              <CircleArrowLeft className="size-6 text-gray-600 hover:text-gray-800" />
            </Link>

            {/* User Avatar - Added for smaller screens */}
            <Avatar className="size-10 md:hidden">
              <AvatarImage
                src="/assets/dashboard/business-dashboard/chats/receiver-img.png"
                alt={otherParticipant?.fullName || 'Chat Participant'}
              />
            </Avatar>

            {/* Chat Name and Status */}
            <div>
              <h1 className="max-w-[200px] truncate text-base font-semibold sm:max-w-[300px] md:text-lg">
                {chat.name}
              </h1>
              <p className="text-muted-foreground flex items-center space-x-1 text-xs md:text-sm">
                <span className="max-w-[150px] truncate sm:max-w-[250px]">
                  {otherParticipant?.fullName}
                </span>
                <span
                // className={`ml-2 text-[10px] md:text-xs ${
                //   isParticipantOnline ? 'text-green-500' : 'text-gray-500'
                // }`}
                >
                  {/* • {isParticipantOnline ? 'Online' : 'Offline'} */}
                </span>
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Generate Invoice Button */}
            {/* {session?.role === 'lawyer' && (
              <DialogProvider.Open opens="generateInvoice">
                <Button variant="outline" className="hidden items-center md:flex">
                  <Sparkles className="mr-2 size-4 md:size-5" />
                  <span className="text-xs md:text-sm">Generate Invoice</span>
                </Button>
              </DialogProvider.Open>
            )} */}

            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-screen max-w-[400px] bg-white md:w-[400px]"
              >
                <div className="space-y-4 p-4">
                  {/* Profile Header */}
                  <div className="rounded-lg bg-[#F8F8F8] px-4 py-3">
                    <div className="mb-4 flex items-center space-x-3">
                      <Avatar className="size-10 md:size-12">
                        <AvatarImage
                          src="/assets/dashboard/business-dashboard/chats/receiver-img.png"
                          alt={otherParticipant?.fullName || 'Chat Participant'}
                        />
                      </Avatar>
                      <div>
                        <h3 className="text-sm font-semibold md:text-base">
                          {otherParticipant?.fullName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                          // className={`size-2 rounded-full ${
                          //   isParticipantOnline ? 'bg-green-500' : 'bg-gray-500'
                          // }`}
                          />
                          <span className="text-muted-foreground text-xs">
                            {/* {isParticipantOnline ? 'Online' : 'Offline'} */}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="rounded-lg bg-white p-4">
                      <h4 className="text-muted-foreground mb-1 text-xs uppercase">Service</h4>
                      <p className="text-sm font-medium">{chat.name}</p>
                    </div>
                  </div>

                  {/* Mobile Generate Invoice Button */}
                  <div className="block md:hidden">
                    {/* {session?.role === 'lawyer' && (
                      <DialogProvider.Open opens="generateInvoice">
                        <Button variant="outline" className="w-full">
                          <Sparkles className="mr-2 size-5" />
                          Generate Invoice
                        </Button>
                      </DialogProvider.Open>
                    )} */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* {session?.role === 'business' && (
                      <>
                        <DisputeService />
                        <BusinessEndService />
                      </>
                    )} */}

                    {/* {session?.role === 'lawyer' && (
                      <>
                        <ReportBusiness />
                        <LawyerEndService />
                      </>
                    )} */}
                  </div>

                  {/* Tabs for Additional Content */}
                  <Tabs defaultValue="images" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      {['invoice', 'images', 'videos', 'files'].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="bg-transparent text-xs data-[state=active]:border-b-2 
                            data-[state=active]:border-primary-500 
                            data-[state=active]:text-primary-500 
                            data-[state=active]:transition 
                            data-[state=active]:duration-300 
                            md:text-sm"
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Images Tab */}
                    <TabsContent value="images" className="mt-4 p-3">
                      <ScrollArea className="h-64">
                        <div className="grid grid-cols-3 gap-2">
                          {files?.map((item) => (
                            <div key={item.id} className="aspect-square overflow-hidden rounded-lg">
                              <Image
                                src={item.url}
                                alt={item.name}
                                className="size-full object-cover"
                                width={100}
                                height={100}
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {/* Other Tabs */}
                    <TabsContent value="invoice">Invoice content</TabsContent>
                    <TabsContent value="videos">No videos available</TabsContent>
                    <TabsContent value="files">No files available</TabsContent>
                  </Tabs>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Dialogs Remain the Same */}
      {/* <DialogProvider.Window name="generateInvoice" title="Generate Invoice">
        <GenerateInvoice />
      </DialogProvider.Window> */}

      {/* <DialogProvider.Window name="invoiceGenerated" title="" className="w-[380px]">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <p className="text-center font-bold">Invoice Generated and Sent!</p>

          <Image src="/assets/dashboard/success.gif" alt="success" width={140} height={140} />

          <div className="my-4 flex w-full items-center gap-4">
            <Button variant="ghost" className="flex-1 hover:bg-primary-100">
              View
            </Button>
            <Button className="flex-1 text-white" onClick={() => close('invoiceGenerated')}>
              Done
            </Button>
          </div>
        </div>
        <SuccessMessage dialogWindowName="invoiceGenerated" />
      </DialogProvider.Window> */}
    </>
  );
};

export default Header;
