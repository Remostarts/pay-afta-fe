import React from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const SkeletonMessageLoader = () => {
  return (
    <>
      {/* header skeleton */}
      <div className="flex items-center space-x-4 border-b border-gray-100 p-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="size-6 rounded-full" />
        </div>
      </div>

      {/* messages skeleton */}
      <div className="flex-1 space-y-6 overflow-hidden p-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start space-x-3',
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1">
              <div className={cn('mb-2', index % 2 === 0 ? 'w-3/4 mr-auto' : 'w-3/4 ml-auto')}>
                <Skeleton className="h-4 w-full" />
              </div>
              <div className={cn('', index % 2 === 0 ? 'w-1/2 mr-auto' : 'w-1/2 ml-auto')}>
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* input skeleton */}
      <div className="flex items-center space-x-2 border-t border-gray-100 p-4">
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="size-10 rounded-full" />
      </div>
    </>
  );
};

export default SkeletonMessageLoader;
