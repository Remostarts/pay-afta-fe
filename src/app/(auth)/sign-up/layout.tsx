import Image from 'next/image';

import { TChildrenProps } from '@/types';

export default function Layout({ children }: TChildrenProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="relative  hidden items-center justify-center md:flex md:w-[45%]">
        <Image
          src="/assets/auth/pay-afta-sign-up.png"
          alt="sign-in-hero"
          width={700}
          height={700}
        />
      </div>

      <div className="mt-10 px-4 md:mx-auto md:w-1/2 lg:px-8 xl:px-20">{children}</div>
    </div>
  );
}
