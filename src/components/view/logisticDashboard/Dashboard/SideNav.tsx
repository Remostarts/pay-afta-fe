'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { signOut } from 'next-auth/react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { sideNavMenu } from '@/constants/logistic-dashboard/shared';
import { useState } from 'react';

interface SidebarProps {
  onClose?: () => void;
}

export default function LogisticSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const currPage = pathname?.split('/')[2];
  const { user } = useGeneral();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isActive = (navItem: any) => {
    if (navItem.alt === '/') {
      return !currPage; // root dashboard
    }

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
    signOut();
    setShowLogoutDialog(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <aside className="flex min-h-screen w-64 flex-col bg-white shadow-lg lg:ml-5 lg:mt-6 lg:h-[calc(100vh-100px)] lg:shadow-none">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b p-3 md:p-6 lg:hidden">
          <Link href="/">
            <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
          </Link>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="size-6 text-gray-600" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="mx-auto hidden pt-6 pb-8 lg:block">
          <Link href="/">
            <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="mx-auto flex-1 overflow-y-auto p-4">
          <ul className="space-y-6">
            {sideNavMenu.map((nav) => {
              const active = isActive(nav);

              return (
                <li key={nav.id}>
                  <Link
                    href={`/logistic-dashboard/${nav.alt}`}
                    className={`flex items-center gap-4 rounded-md p-3 hover:bg-[#E9F5FB] hover:text-[#1F7EAD] transition-colors ${
                      active ? 'bg-[#E9F5FB] text-[#1F7EAD]' : 'text-[#999999]'
                    }`}
                    onClick={() => {
                      if (onClose && window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <Image
                      src={active ? nav.imgColor : nav.imgBlack}
                      alt={`${nav.alt}-icon`}
                      width={24}
                      height={24}
                    />
                    <span className="font-inter font-medium tracking-wider">{nav.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User Profile & Actions */}
          <li className="mt-8 pt-4 border-t border-gray-200 mb-8">
            <div className="flex items-center justify-between px-3 gap-6">
              <div className="flex items-center gap-4 mb-8">
                <Image
                  src={user?.profileImage || '/assets/admin-dashboard/users/prof-avatar.svg'}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <span className="font-inter font-medium tracking-wider">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>

              <button
                onClick={handleLogoutClick}
                className="p-1 hover:bg-gray-100 rounded-full mb-8"
                aria-label="Logout"
              >
                <Image
                  src="/assets/dashboard/Dashboard/power-button.svg"
                  alt="Logout"
                  width={25}
                  height={25}
                />
              </button>
            </div>
          </li>
        </nav>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
