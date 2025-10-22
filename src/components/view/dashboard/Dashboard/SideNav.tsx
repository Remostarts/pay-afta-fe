'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { sideNavMenu } from '../../../../constants/dashboard/shared';

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

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathName = usePathname();
  const currPage = pathName?.split('/')[2];
  const { user } = useGeneral();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Helper to check if an item or any of its children is active
  const isActive = (navItem: any) => {
    if (navItem.alt === '/') {
      // Dashboard: active when no subpage
      return currPage === '' || currPage === undefined;
    }

    if (navItem.isChildrean) {
      // Parent item: active if any child is active
      const childPages = [navItem.newOrder.alt, navItem.viewOrder.alt];
      return childPages.includes(currPage);
    }

    // Regular item: active if alt matches current page
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
          <div>
            <Link href="/">
              <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
            </Link>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="mx-auto hidden lg:block pt-6 pb-8">
          <Link href="/">
            <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mx-auto flex-1 overflow-y-auto p-4">
          <ul className="space-y-4">
            {sideNavMenu.map((nav) => {
              const isChildren = nav.isChildrean;
              const active = isActive(nav);

              return (
                <li key={nav.id}>
                  {isChildren ? (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${nav.id}`} className="border-none">
                        <AccordionTrigger
                          className={`flex items-center gap-4 rounded-md p-3 hover:bg-[#E9F5FB] hover:text-[#1F7EAD] transition-colors hover:no-underline [&[data-state=open]>svg]:rotate-180 ${
                            active ? 'bg-[#E9F5FB] text-[#1F7EAD]' : 'text-[#999999]'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <Image
                              src={active ? nav.imgColor : nav.imgBlack}
                              alt={`${nav.alt}-icon`}
                              width={24}
                              height={24}
                            />
                            <span className="font-inter font-medium tracking-wider">
                              {nav.name}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-0 pt-2">
                          <div className="pl-11 space-y-2">
                            {[nav.newOrder, nav.viewOrder].map((subNav) => {
                              const subIsActive = subNav.alt === currPage;
                              return (
                                <Link
                                  key={subNav.id}
                                  href={`/dashboard/${subNav.alt}`}
                                  className={`flex items-center rounded-md py-2 px-3 hover:bg-[#E9F5FB] hover:text-[#1F7EAD] transition-colors ${
                                    subIsActive ? 'bg-[#E9F5FB] text-[#1F7EAD]' : 'text-[#999999]'
                                  }`}
                                  onClick={() => {
                                    if (onClose && window.innerWidth < 1024) {
                                      onClose();
                                    }
                                  }}
                                >
                                  <span className="font-inter tracking-wider text-sm">
                                    {subNav.name}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      href={`/dashboard/${nav.alt}`}
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
                  )}
                </li>
              );
            })}

            {/* User Profile Section */}
            <li className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-4">
                  <Image
                    src={user?.profileImage || '/assets/admin-dashboard/users/prof-avatar.svg'}
                    alt="profile-img"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-inter font-medium tracking-wider">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Logout"
                >
                  <Image
                    src="/assets/dashboard/Dashboard/power-button.svg"
                    alt="logout"
                    width={25}
                    height={25}
                  />
                </button>
              </div>
            </li>
          </ul>
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
