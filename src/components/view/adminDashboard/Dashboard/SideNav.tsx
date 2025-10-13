'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import { signOut } from 'next-auth/react';

import { sideNavMenu } from '@/constants/admin-dashboard/shared';
import { useGeneral } from '@/context/generalProvider';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const pathName = usePathname();
  const currPage = pathName?.split('/')[2];
  const { user } = useGeneral();

  const isActive = (navItem: any) => {
    if (navItem.alt === '/') {
      return currPage === '' || currPage === undefined;
    }

    if (navItem.isChildrean) {
      const childPages = [navItem.newOrder?.alt, navItem.viewOrder?.alt].filter(Boolean);
      return childPages.includes(currPage);
    }

    return navItem.alt === currPage;
  };

  const handleLogout = () => {
    signOut();
  };

  return (
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
      <div className="mx-auto hidden pt-6 pb-8 lg:block">
        <Link href="/">
          <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mx-auto flex-1 overflow-y-auto p-4">
        <ul className="space-y-4">
          {sideNavMenu.map((nav) => {
            const active = isActive(nav);

            return (
              <li key={nav.id}>
                <Link
                  href={`/admin-dashboard/${nav.alt}`}
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

          {/* User Profile & Logout */}
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
                onClick={handleLogout}
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
  );
}
