'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Logo from '../../../../../../public/Logo.svg';

import { Waitlist } from './Waitlist';

export default function Navbar() {
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWaitlist(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={Logo} alt="Payafta Logo" width={110.17} height={40} priority />
        </Link>

        <nav className="hidden items-center space-x-8 md:flex">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="how-it-works" className="text-gray-600 hover:text-gray-900">
            How It Works
          </Link>
          <Link href="/delivery" className="text-gray-600 hover:text-gray-900">
            Delivery
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="/support" className="text-gray-600 hover:text-gray-900">
            Support
          </Link>
          {/* <Link href="#" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link> */}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="/sign-in"
            className="rounded-full border border-black px-4 py-2 font-inter text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="hidden rounded-full bg-[#03045B] px-5 py-2 font-inter text-sm font-medium text-white transition-colors md:block"
          >
            Get Started
          </Link>
          <div>
            <Waitlist open={showWaitlist} onOpenChange={setShowWaitlist} />
          </div>
        </div>
      </div>
    </header>
  );
}
