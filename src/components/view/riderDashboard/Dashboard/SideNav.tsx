'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { signOut } from 'next-auth/react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGeneral } from '@/context/generalProvider';
import { sideNavMenu } from '@/constants/rider-dashboard/shared';

interface SidebarProps {
  onClose?: () => void;
}

export default function RiderSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const currPage = pathname?.split('/')[2];
  const { user } = useGeneral();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isActive = (navItem: any) => {
    if (navItem.alt === '/') return !currPage;
    if (navItem.isChildrean) {
      const childPages = [navItem.newOrder?.alt, navItem.viewOrder?.alt].filter(Boolean);
      return childPages.includes(currPage);
    }
    return navItem.alt === currPage;
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    signOut({ callbackUrl: '/' });
    setShowLogoutDialog(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <aside className="flex h-full w-64 flex-col bg-white shadow-xl lg:rounded-lg lg:shadow-md">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden">
          <Link
            href="/"
            onClick={onClose}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <Image
              src="/Logo.svg"
              alt="Pay Afta logo"
              width={130}
              height={26}
              className="h-auto"
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden items-center justify-center border-b border-gray-100 py-6 lg:flex">
          <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
            <Image
              src="/Logo.svg"
              alt="Pay Afta logo"
              width={140}
              height={28}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation - Scrollable Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:px-4">
          <ul className="space-y-1.5">
            {sideNavMenu.map((nav) => {
              const active = isActive(nav);

              return (
                <li key={nav.id}>
                  <Link
                    href={`/rider-dashboard/${nav.alt}`}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[#E9F5FB] text-[#1F7EAD] shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      if (onClose && window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center">
                      <Image
                        src={active ? nav.imgColor : nav.imgBlack}
                        alt={`${nav.name} icon`}
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                    </div>
                    <span className="font-inter tracking-wide">{nav.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile & Logout - Fixed at Bottom */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={user?.profileImage || '/assets/admin-dashboard/users/prof-avatar.svg'}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover ring-2 ring-gray-100"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-gray-500">Rider</p>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <Image
                src="/assets/dashboard/Dashboard/power-button.svg"
                alt="Logout"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
