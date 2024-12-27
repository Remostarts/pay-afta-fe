import React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingMessageProps {
  type: 'image' | 'video' | 'audio' | 'pdf';
}

export function LoadingMessage({ type }: LoadingMessageProps) {
  return (
    <div className="relative max-w-md overflow-hidden rounded-lg">
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100',
          type === 'image' && 'h-[250px] w-[250px]',
          type === 'video' && 'h-[200px] w-[350px]',
          type === 'audio' && 'h-[100px] w-[350px]',
          type === 'pdf' && 'h-[100px] w-[350px]'
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-white/30 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="text-primary size-8 animate-spin" />
        </div>
        <div className="absolute bottom-2 left-2 text-sm text-gray-600">Uploading...</div>
      </div>
    </div>
  );
}
