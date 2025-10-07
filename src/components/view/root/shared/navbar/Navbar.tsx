'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Waitlist } from './Waitlist';
import Logo from '../../../../../../public/Logo.svg';
import { Menu, X } from 'lucide-react'; // <- lightweight icons

export default function Navbar() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWaitlist(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src={Logo} alt="Payafta Logo" width={110.17} height={40} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-8 md:flex">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
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
        </nav>

        {/* Right Buttons */}
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

          {/* Waitlist (existing) */}
          <Waitlist open={showWaitlist} onOpenChange={setShowWaitlist} />

          {/* Mobile Hamburger */}
          <button
            className="block md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={28} className="text-[#03045B]" />
            ) : (
              <Menu size={28} className="text-[#03045B]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <div
        className={`absolute left-0 right-0 top-[64px] z-40 overflow-hidden bg-white shadow-md transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        } md:hidden`}
      >
        <nav className="flex flex-col items-start space-y-4 px-6 py-6">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-[#03045B] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-[#03045B]"
          >
            How It Works
          </Link>
          <Link
            href="/delivery"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-[#03045B]"
          >
            Delivery
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-[#03045B]"
          >
            Pricing
          </Link>
          <Link
            href="/support"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-[#03045B]"
          >
            Support
          </Link>

          {/* Mobile CTA */}
          <Link
            href="/sign-up"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 w-full rounded-full bg-[#03045B] px-5 py-2 text-center font-inter text-sm font-medium text-white"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
