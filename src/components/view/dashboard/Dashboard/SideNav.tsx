'use client';
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
import { useGeneral } from '@/context/generalProvider';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathName = usePathname();
  const currPage = pathName?.split('/')[2];
  const { user } = useGeneral();
  const rootPathName = '/dashboard';
  console.log(rootPathName);

  const handleLogout = () => {
    signOut();
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-white shadow-lg lg:ml-5 lg:mt-6 lg:h-[calc(100vh-100px)] lg:shadow-none">
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

      <div className="mx-auto hidden lg:block">
        <Link href="/">
          <Image src="/Logo.svg" alt="Pay Afta logo" width={150} height={28} />
        </Link>
      </div>
      <nav className="mx-auto flex overflow-y-auto p-4">
        <ul>
          {sideNavMenu.map((nav) => {
            const isChildren = nav.isChildrean;
            return (
              <li className="my-4" key={nav.id}>
                {isChildren ? (
                  <div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <div className="flex justify-around">
                          <Image
                            src={nav.imgBlack}
                            alt={`${nav.alt}-icon`}
                            width={24}
                            height={24}
                          />
                          <AccordionTrigger className="font-inter font-medium tracking-wider [&>svg]:hidden text-[#999999]">
                            {nav.name}
                          </AccordionTrigger>
                        </div>
                        <AccordionContent className="flex flex-col items-center gap-4 text-balance">
                          {[nav.newOrder, nav.viewOrder].map((subNav) => {
                            return (
                              <div key={subNav.id} className="flex items-center gap-2">
                                <Link
                                  href={`/dashboard/${subNav.alt}`}
                                  onClick={() => {
                                    if (onClose && window.innerWidth < 1024) {
                                      onClose();
                                    }
                                  }}
                                >
                                  <span className="font-inter tracking-wider">{subNav.name}</span>
                                </Link>
                              </div>
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/${nav.alt}`}
                    className={`flex items-center gap-4 rounded-md p-3 hover:bg-[#E9F5FB] hover:text-[#1F7EAD] md:p-4 ${
                      nav.alt === currPage && 'bg-[#E9F5FB] text-[#1F7EAD]'
                    } ${nav.root === '/dashboard' && 'bg-[#E9F5FB] text-[#1F7EAD]'}
                    `}
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
                    <span
                      className={`font-inter font-medium tracking-wider ${nav.alt === currPage ? 'text-[#1F7EAD]' : 'text-[#999999]'}`}
                    >
                      {nav.name}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
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
            <Image
              onClick={handleLogout}
              src="/assets/dashboard/Dashboard/power-button.svg"
              alt="profile-img"
              width={25}
              height={25}
              className=" cursor-pointer rounded-full"
            />
          </li>
        </ul>
      </nav>
    </aside>
  );
}
