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
import { useGeneral } from '@/context/generalProvider';
import { sideNavMenu } from '@/constants/rider-dashboard/shared';

interface SidebarProps {
  onClose?: () => void;
}

export default function RiderSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const currPage = pathname?.split('/')[2];
  const { user } = useGeneral();

  const isActive = (navItem: any) => {
    if (navItem.alt === '/') return !currPage;
    if (navItem.isChildrean) {
      const childPages = [navItem.newOrder?.alt, navItem.viewOrder?.alt].filter(Boolean);
      return childPages.includes(currPage);
    }
    return navItem.alt === currPage;
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-white shadow-lg lg:ml-5 lg:mt-6 lg:h-[calc(100vh-100px)] lg:shadow-none">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b p-3 md:p-6 lg:hidden">
        <Link href="/" className="focus:outline-none">
          <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} priority />
        </Link>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="size-6 text-gray-600" />
        </button>
      </div>

      {/* Desktop Logo */}
      <div className="mx-auto hidden pt-6 pb-8 lg:block">
        <Link href="/" className="focus:outline-none">
          <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} priority />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mx-auto flex-1 overflow-y-auto p-4">
        <ul className="space-y-6">
          {sideNavMenu.map((nav) => {
            const active = isActive(nav);

            return (
              <li key={nav.id}>
                <Link
                  href={`/rider-dashboard/${nav.alt}`}
                  className={`flex items-center gap-4 rounded-md p-3 hover:bg-[#E9F5FB] hover:text-[#1F7EAD] transition-colors ${
                    active ? 'bg-[#E9F5FB] text-[#1F7EAD]' : 'text-[#999999]'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose?.();
                  }}
                >
                  <Image
                    src={active ? nav.imgColor : nav.imgBlack}
                    alt={`${nav.name} icon`}
                    width={24}
                    height={24}
                  />
                  <span className="font-inter font-medium tracking-wider">{nav.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile & Logout */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <Image
                src={user?.profileImage || '/assets/admin-dashboard/users/prof-avatar.svg'}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-inter font-medium tracking-wider max-w-[120px] truncate">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Logout"
            >
              <Image
                src="/assets/dashboard/Dashboard/power-button.svg"
                alt="Logout"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
