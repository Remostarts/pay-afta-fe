'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';

import { sideNavMenu } from '@/constants/admin-dashboard/shared';
import { useGeneral } from '@/context/generalProvider';

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const pathName = usePathname();
  const currPage = pathName?.split('/')[2];
  console.log(currPage);
  const rootPath = pathName.startsWith('/admin-dashboard');
  const { user } = useGeneral();
  console.log(rootPath);

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-white shadow-lg lg:ml-5 lg:mt-6 lg:h-[calc(100vh-100px)] lg:shadow-none">
      <div className="flex items-center justify-between border-b p-3 md:p-6 lg:hidden">
        <div>
          <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100"
          aria-label="Close menu"
        >
          <X className="size-6" />
        </button>
      </div>

      <div className="mx-auto hidden lg:block">
        <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
      </div>
      <nav className="mx-auto flex overflow-y-auto p-4">
        <ul>
          {sideNavMenu.map((nav) => (
            <li className="my-4" key={nav.id}>
              <Link
                href={`/admin-dashboard/${nav.alt}`}
                className={`flex items-center gap-4 rounded-r-md p-3 hover:bg-[#E9F5FB] hover:text-[#1F7EAD] md:p-4 ${
                  nav.alt === currPage &&
                  'border-l-4 border-l-[#1F7EAD] bg-[#E9F5FB] text-[#1F7EAD]'
                }`}
                onClick={() => {
                  if (onClose && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
              >
                {nav.alt === currPage ? (
                  <Image src={nav.imgColor} alt={`${nav.alt}-icon`} width={24} height={24} />
                ) : (
                  <Image src={nav.imgBlack} alt={`${nav.alt}-icon`} width={24} height={24} />
                )}
                <span className="font-inter font-medium tracking-wider">{nav.name}</span>
              </Link>
            </li>
          ))}
          <li className="mt-8 flex items-center gap-4">
            <Image
              src="/assets/admin-dashboard/users/prof-avatar.svg"
              alt="profile-img"
              width={40}
              height={40}
              className=" rounded-full"
            />
            <span className="font-inter font-medium tracking-wider">
              {user?.firstName} {user?.lastName}
            </span>
            <Link href="/admin-dashboard/setting">
              <Image
                src="/assets/admin-dashboard/dashboard/setting-icon.svg"
                alt="setting icon"
                width={25}
                height={25}
                className=" cursor-pointer rounded-full"
              />
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
