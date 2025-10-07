'use client';

import { CircleArrowLeft, Ellipsis, Link2Icon, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useChats } from '@/context/ChatListProvider';
import { Chat } from '@/types/chat.type';
import { ReButton } from '@/components/re-ui/ReButton';
import RaiseDispute from './RaiseDispute';
import DisputeOverlay from './DisputeOverlay';

type Props = {
  chat: Chat;
};

const Header = ({ chat }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDisputeOverlay, setIsDisputeOverlay] = useState(false);
  const pathUrl = usePathname();
  const { session } = useChats();
  const pathName = pathUrl.split('/')[1];

  const otherParticipant = chat.participants?.find((p) => p.id !== session?.id);

  const handleClosed = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsDisputeOverlay(false); // Reset overlay state when closing
    }
  };

  const handleShowRiseDispute = () => {
    setIsDisputeOverlay(true);
  };

  const handleDone = () => {
    setIsDisputeOverlay(false);
    handleClosed(false);
  };

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
                src="/assets/dashboard/Dashboard/profile-img.png"
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
              </p>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <div className="space-y-4">
                  <div className="">
                    <ReButton className="bg-white text-black hover:bg-white font-inter">
                      <Link2Icon /> Track Link
                    </ReButton>
                  </div>
                  <div className="border-t-2">
                    <ReButton
                      className="text-[#B1201B] font-inter bg-white hover:bg-white"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Package className="text-[#B1201B]" /> Raise a Dispute
                    </ReButton>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleClosed}>
        <DialogContent className="sm:max-w-md">
          {isDisputeOverlay ? (
            <DisputeOverlay handleDone={handleDone} />
          ) : (
            <RaiseDispute
              userRole="user"
              handleClosed={handleClosed}
              handleShowRiseDispute={handleShowRiseDispute}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
