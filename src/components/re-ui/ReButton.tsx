'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Loader } from 'lucide-react';

import { Button } from '../ui/button';

import { cn } from '@/lib/utils';

type TButton = {
  type?: 'button' | 'submit' | 'reset' | undefined;
  isSubmitting?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
} & ComponentProps<typeof Button>;

export function ReButton({
  isSubmitting = false,
  type = 'button',
  className,
  disabled = false,
  children,
  ...props
}: TButton) {
  const defaultClasses =
    'bg-[#03045B] hover:bg-[#03045B] text-white font-spaceGrotesk w-full text-base';

  // Merge class names using `cn` and allow the passed className to override defaults
  const mergedClassName = cn(defaultClasses, className);
  return (
    <Button disabled={disabled} type={type} className={mergedClassName} {...props}>
      {isSubmitting ? (
        <span className="flex items-center justify-center space-x-2">
          <Loader className="size-5 animate-spin" />
          <span className="animate-pulse">Loading...</span>
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
