'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Header from '@/components/view/dashboard/Dashboard/Header';
import { TChildrenProps } from '@/types';
import Sidebar from '@/components/view/dashboard/Dashboard/SideNav';
import ProfileHeader from '@/components/view/dashboard/shared/ProfileHeader';
import AdminSidebar from '@/components/view/adminDashboard/Dashboard/SideNav';
import AdminProfileHeader from '@/components/view/adminDashboard/shared/AdminProfileHeader';

export default function Layout({ children }: TChildrenProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathName = usePathname();

  // Check if path starts with either /dashboard or /admin-dashboard
  const isAdminDashboard = pathName.startsWith('/admin-dashboard');
  const isDashboard = pathName.startsWith('/dashboard');

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} className="block lg:hidden" />

      {isSidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`
            fixed left-0 top-0 z-50 h-full shadow-md transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            lg:relative lg:block
          `}
        >
          {isAdminDashboard && <AdminSidebar onClose={() => setIsSidebarOpen(false)} />}
          {isDashboard && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
        </div>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="hidden p-4 lg:block lg:p-6">
            {isDashboard && <ProfileHeader />}
            {isAdminDashboard && <AdminProfileHeader />}
          </div>
          <div className="w-full p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
