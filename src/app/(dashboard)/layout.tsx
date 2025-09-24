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

export default function Layout({ children }: TChildrenProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { onboardingStatus, user } = useGeneral();
  console.log('🌼 🔥🔥 Layout 🔥🔥 user🌼', user);

  console.log('🌼 🔥🔥 Layout 🔥🔥 onboardingStatus🌼', onboardingStatus);

  useEffect(() => {
    console.log('🌼 🔥🔥 Layout 🔥🔥 onboardingStatus🌼', onboardingStatus);

    if (onboardingStatus === false && user?.role !== 'admin' && user?.role !== 'logistic') {
      router.push('/onboarding');
    }
  }, [onboardingStatus, router]);

  // Check if path starts with either /dashboard or /admin-dashboard
  const isAdminDashboard = pathName.startsWith('/admin-dashboard');
  const isDashboard = pathName.startsWith('/dashboard');
  const isLogisticDashboard = pathName.startsWith('/logistic-dashboard');

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
        </div>

        <main className="flex flex-1 flex-col bg-gray-50 overflow-hidden">
          <div className="hidden p-4 lg:block lg:p-6">
            {isDashboard && <ProfileHeader />}
            {isAdminDashboard && <AdminProfileHeader />}
            {isLogisticDashboard && <LogisticProfileHeader />}
          </div>
          <div className="flex-1 overflow-y-auto scroll-smooth p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
