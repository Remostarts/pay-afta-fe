/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface LazyMediaProps {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function LazyMedia({ type, src, alt = '', className = '', onClick }: LazyMediaProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (type === 'image') {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className={`aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover/image:scale-105 ${
            isLoading ? 'scale-110 blur-2xl' : 'scale-100 blur-0'
          } ${className}`}
          onLoadingComplete={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 22vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QOQvhwAAAABJRU5ErkJggg=="
          onClick={onClick}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}
      <video
        src={src}
        controls
        className={`aspect-video w-full max-w-md transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoadedData={() => setIsLoading(false)}
        preload="metadata"
      />
    </div>
  );
}
