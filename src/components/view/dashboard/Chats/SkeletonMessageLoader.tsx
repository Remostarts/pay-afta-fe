import React from 'react';

import { cn } from '@/lib/utils';

const SkeletonMessageLoader = () => {
  return (
    <>
      {/* header skeleton  */}
      <div className="flex items-center space-x-4 border-b border-gray-100 p-4">
        <div className="animate-pulse">
          <div className="size-10 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="flex space-x-2">
          <div className="size-6 animate-pulse rounded-full bg-gray-200"></div>
          <div className="size-6 animate-pulse rounded-full bg-gray-200"></div>
        </div>
      </div>

      {/* messages skeleton  */}
      <div className="flex-1 space-y-6 overflow-hidden p-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start space-x-3 animate-pulse',
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            <div className="size-10 shrink-0 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div
                className={cn(
                  'h-4 bg-gray-200 rounded mb-2',
                  index % 2 === 0 ? 'w-3/4 mr-auto' : 'w-3/4 ml-auto'
                )}
              ></div>
              <div
                className={cn(
                  'h-4 bg-gray-200 rounded',
                  index % 2 === 0 ? 'w-1/2 mr-auto' : 'w-1/2 ml-auto'
                )}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* input skeleton  */}
      <div className="flex items-center space-x-2 border-t border-gray-100 p-4">
        <div className="size-10 animate-pulse rounded-full bg-gray-200"></div>
        <div className="h-10 flex-1 animate-pulse rounded bg-gray-200"></div>
        <div className="size-10 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </>
  );
};

export default SkeletonMessageLoader;
