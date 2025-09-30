'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ProfileHeader from '../shared/ProfileHeader';
import AdminProfileHeader from '../../adminDashboard/shared/AdminProfileHeader';
import LogisticProfileHeader from '../../logisticDashboard/shared/LogisticProfileHeader';
import RiderProfileHeader from '../../riderDashboard/shared/RiderProfileHeader';

interface HeaderProps {
  onMenuClick: () => void;
  className: string;
}

export default function Header({ onMenuClick, className }: HeaderProps) {
  const pathName = usePathname();
  const isAdminDashboard = pathName.startsWith('/admin-dashboard');
  const isDashboard = pathName.startsWith('/dashboard');
  const isLogisticDashboard = pathName.startsWith('/logistic-dashboard');
  const isRiderDashboard = pathName.startsWith('/rider');
  return (
    <>
      <header className={`w-full border-b border-gray-200 p-4 lg:px-6 ${className} `}>
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 lg:hidden" onClick={onMenuClick} aria-label="Toggle menu">
              <Image
                src="/assets/dashboard/Dashboard/hamburger-icon.svg"
                alt="Hamburger-icon"
                width={30}
                height={30}
              />
            </button>

            <Link href="/">
              <Image
                src="/Logo.svg"
                alt="Pay Afta logo"
                className="w-32 lg:w-[180.62px]"
                width={180.62}
                height={28}
              />
            </Link>
          </div>
        </nav>
        <div className="mt-5">
          {isDashboard && <ProfileHeader />}
          {isAdminDashboard && <AdminProfileHeader />}
          {isLogisticDashboard && <LogisticProfileHeader />}
          {isRiderDashboard && <RiderProfileHeader />}
        </div>
      </header>
    </>
  );
}
