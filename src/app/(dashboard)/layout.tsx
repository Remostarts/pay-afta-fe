'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useGeneral } from '@/context/generalProvider';
import Header from '@/components/view/dashboard/Dashboard/Header';
import { TChildrenProps } from '@/types';
import Sidebar from '@/components/view/dashboard/Dashboard/SideNav';
import ProfileHeader from '@/components/view/dashboard/shared/ProfileHeader';
import AdminSidebar from '@/components/view/adminDashboard/Dashboard/SideNav';
import AdminProfileHeader from '@/components/view/adminDashboard/shared/AdminProfileHeader';
import LogisticSidebar from '@/components/view/logisticDashboard/Dashboard/SideNav';
import LogisticProfileHeader from '@/components/view/logisticDashboard/shared/LogisticProfileHeader';
import RiderSidebar from '@/components/view/riderDashboard/Dashboard/SideNav';
import RiderProfileHeader from '@/components/view/riderDashboard/shared/RiderProfileHeader';
import { MessageNotificationManager } from '@/components/view/dashboard/shared/message-notification-manager';
import DashboardSkeleton from '@/components/view/logisticDashboard/Dashboard/DashboardSkeleton';
import DashboardLoader from './DashboardLoader';

export default function Layout({ children }: TChildrenProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { user, loadingUser } = useGeneral();
  // console.log('🌼 🔥🔥 Layout 🔥🔥 user🌼', user);

  // console.log('🌼 🔥🔥 Layout 🔥🔥 onboardingStatus🌼', onboardingStatus);

  // Onboarding redirect removed - identity verification is now handled within the dashboard

  // Show loading state in the layout while user data is being fetched
  // DashboardLoader
  if (loadingUser) {
    return (
      // <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      //   <div className="flex flex-col items-center space-y-6 rounded-xl shadow-lg p-8 bg-white border border-gray-200">
      //     <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      //     <div className="flex flex-col items-center">
      //       <p className="text-lg font-semibold text-blue-800 font-inter">
      //         Loading your dashboard...
      //       </p>
      //       <p className="text-sm text-gray-500 mt-1">
      //         Please wait while we get things ready for you.
      //       </p>
      //     </div>
      //   </div>
      // </div>
      <div>
        <DashboardLoader />
      </div>
    );
  }

  // Check if path starts with either /dashboard or /admin-dashboard
  const isAdminDashboard = pathName.startsWith('/admin-dashboard');
  const isDashboard = pathName.startsWith('/dashboard');
  const isLogisticDashboard = pathName.startsWith('/logistic-dashboard');
  const isRiderDashboard = pathName.startsWith('/rider-dashboard');

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

      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={`
            fixed left-0 top-0 z-50 h-full overflow-hidden shadow-md transition-transform duration-300 ease-in-out scroll-smooth no-scrollbar
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            lg:relative lg:block
          `}
        >
          {isAdminDashboard && <AdminSidebar onClose={() => setIsSidebarOpen(false)} />}
          {isDashboard && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
          {isLogisticDashboard && <LogisticSidebar onClose={() => setIsSidebarOpen(false)} />}
          {isRiderDashboard && <RiderSidebar onClose={() => setIsSidebarOpen(false)} />}
        </div>

        <main className="flex flex-1 flex-col bg-gray-50 overflow-hidden">
          <div className="hidden p-4 lg:block lg:p-6">
            {isDashboard && <ProfileHeader />}
            {isAdminDashboard && <AdminProfileHeader />}
            {isLogisticDashboard && <LogisticProfileHeader />}
            {isRiderDashboard && <RiderProfileHeader />}
          </div>
          <div className="flex-1 overflow-y-auto scroll-smooth p-4">{children}</div>
          <MessageNotificationManager />
        </main>
      </div>
    </div>
  );
}
