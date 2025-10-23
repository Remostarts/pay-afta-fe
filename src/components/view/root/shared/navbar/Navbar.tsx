'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Waitlist } from './Waitlist';
import Logo from '../../../../../../public/Logo.svg';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation'; // for active route highlighting

export default function Navbar() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
        <nav className="hidden items-center space-x-6 md:flex">
          {[
            { name: 'Home', href: '/' },
            { name: 'How It Works', href: '/how-it-works' },
            { name: 'Delivery', href: '/delivery' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Support', href: '/support' },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative font-inter text-[15px] font-medium transition-all duration-300 group ${
                  isActive ? 'text-[#03045B]' : 'text-gray-700 hover:text-[#03045B]'
                }`}
              >
                {item.name}
                <span
                  className={`absolute left-0 bottom-[-6px] h-[2px] bg-[#03045B] transition-all duration-300 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/sign-in"
            className="rounded-full border border-black px-4 py-2 font-inter text-sm font-medium text-gray-700 transition-all duration-200 hover:text-gray-900 hover:shadow-sm"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="hidden rounded-full bg-[#03045B] px-5 py-2 font-inter text-sm font-medium text-white transition-transform duration-300 hover:scale-105 md:block"
          >
            Get Started
          </Link>

          {/* Waitlist Popup */}
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
          {[
            { name: 'Home', href: '/' },
            { name: 'How It Works', href: '/how-it-works' },
            { name: 'Delivery', href: '/delivery' },
            { name: 'Pricing', href: '/pricing' },
            { name: 'Support', href: '/support' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-700 hover:text-[#03045B] transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link
            href="/sign-up"
            onClick={() => setIsMenuOpen(false)}
            className="mt-4 w-full rounded-full bg-[#03045B] px-5 py-2 text-center font-inter text-sm font-medium text-white transition-transform duration-300 hover:scale-105"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
