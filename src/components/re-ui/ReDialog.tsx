'use client';
import React, { useState } from 'react';

import { ReButton } from '@/components/re-ui/ReButton';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReDialogProps {
  btnLable: string;
  classNames?: string;
  DialogComponent: React.ComponentType<any>;
}

export function ReDialog({ btnLable, classNames, DialogComponent }: ReDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // console.log(isOpen);
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className={`w-full rounded-full bg-[#03045B] p-2 px-6 font-inter lg:px-14 ${classNames}`}
          >
            {btnLable}
          </button>
        </DialogTrigger>
        {isOpen && (
          <DialogContent>
            <DialogComponent />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
