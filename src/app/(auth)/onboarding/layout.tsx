import Image from 'next/image';

import { TChildrenProps } from '@/types';
import Link from 'next/link';

export const metadata = {
  title: 'Onboarding',
};

export default function OnboardingLayout({ children }: TChildrenProps) {
  return (
    <div className="min-h-screen w-full items-center bg-[#F9F9F9]">
      {/* Logo section */}
      <div className="flex items-center justify-center p-6">
        <Link href="/">
          <Image src="/Logo.svg" alt="pay-afta-logo" width={110} height={40} priority />
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="mt-10 px-4 md:mx-auto md:w-1/2 lg:px-8 xl:px-20">{children}</div>
      </div>
    </div>
  );
}
