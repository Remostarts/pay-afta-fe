'use client';
import { useState } from 'react';

import Header from '@/components/view/dashboard/Header';
import { TChildrenProps } from '@/types';
import Sidebar from '@/components/view/dashboard/SideNav';

export default function Layout({ children }: TChildrenProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="container mx-auto min-h-screen">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} className={'block lg:hidden'} />

      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar - visible on large screens by default, controlled by state on smaller screens */}
        <div
          className={`
            fixed left-0 top-0 lg:relative lg:block 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            z-50 min-h-screen transition-transform duration-300 ease-in-out
          `}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
