import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const headingVariants = cva('flex items-center font-inter font-semibold', {
  variants: {
    size: { base: 'text-base', lg: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl' },
  },
  defaultVariants: {
    size: 'xl',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  heading: string;
  img?: string; // Add optional img prop
}

const ReHeading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, heading, img, ...props }, ref) => {
    return (
      <h2 className={cn(headingVariants({ size, className }))} ref={ref} {...props}>
        {img && <Image src={img} alt="heading-img" width={30} height={30} className="mr-3" />}
        <span>{heading}</span>
      </h2>
    );
  }
);
ReHeading.displayName = 'Heading';

export { ReHeading, headingVariants };
