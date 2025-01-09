'use client';

import React, { useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ReDialogProps<T extends object> {
  btnLabel: string | React.ReactElement;
  classNames?: string;
  DialogComponent: React.ComponentType<T> | boolean;
  componentProps?: Partial<T> | boolean;
  buttonVariant?: 'default' | 'custom';
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  onClick?: (item: any) => void;
}

const defaultButtonClasses = 'rounded-full bg-[#03045B] p-2 px-6 font-inter text-white lg:px-14';

export function ReDialog<T extends object>({
  btnLabel,
  classNames,
  DialogComponent,
  componentProps = {} as Partial<T>,
  buttonVariant = 'default',
  onOpenChange,
  defaultOpen = false,
  onClick,
}: ReDialogProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const buttonClasses =
    buttonVariant === 'default' ? cn(defaultButtonClasses, classNames) : classNames;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className={buttonClasses} onClick={onClick}>
          {btnLabel}
        </button>
      </DialogTrigger>
      <DialogContent>
        {DialogComponent && typeof DialogComponent !== 'boolean' && (
          <DialogComponent {...(componentProps as T)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
