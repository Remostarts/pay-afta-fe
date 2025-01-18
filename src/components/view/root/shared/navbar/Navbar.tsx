import Image from 'next/image';
import Link from 'next/link';

import Logo from '../../../../../../public/Logo.svg';

import { Waitlist } from './Waitlist';

export default function Navbar() {
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-5">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={Logo} alt="Payafta Logo" width={110.17} height={40} priority />
        </Link>

        <nav className="flex items-center space-x-4">
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
            <Waitlist />
          </div>
        </nav>
      </div>
    </header>
  );
}
