import React, { ReactNode } from 'react';
import Link from 'next/link';

interface ReLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ReLink({ href, children, className = '' }: ReLinkProps) {
  return (
    <Link
      className={`rounded-full bg-primary-500 px-6 py-3 font-spaceGrotesk font-semibold text-white transition duration-300 hover:bg-primary-600 sm:text-lg md:px-8 md:py-4 ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}
