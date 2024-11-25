'use client';
import { Bell, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import ProfileHeader from '../shared/ProfileHeader';

interface HeaderProps {
  onMenuClick: () => void;
  className: string;
}

export default function Header({ onMenuClick, className }: HeaderProps) {
  return (
    <>
      <header className={`w-full border-b border-gray-200 p-4 lg:px-6 ${className} `}>
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 lg:hidden" onClick={onMenuClick} aria-label="Toggle menu">
              <Image
                src="/assets/Dashboard/dashboard/hamburger-icon.svg"
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
        <div>
          <ProfileHeader />
        </div>
      </header>
    </>
  );
}
