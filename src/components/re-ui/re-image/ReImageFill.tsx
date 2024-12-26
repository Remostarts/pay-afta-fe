import Image from 'next/image';
import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
type TImageProps = {
  src: string;
  alt: string;
  parentClasses?: string;
  sizes?: string;
} & ComponentProps<typeof Image>;
export const ReImageFill = ({
  src,
  alt,
  parentClasses,
  sizes = '(max-width: 1200px) 100vw 60vw',
  ...props
}: TImageProps) => {
  return (
    <div className={cn('relative aspect-video h-64  ', parentClasses)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority
        style={{
          objectFit: 'cover',
        }}
        {...props}
      />
    </div>
  );
};

export default ReImageFill;
//
