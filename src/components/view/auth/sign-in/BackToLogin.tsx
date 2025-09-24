'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ReButton } from '@/components/re-ui/ReButton';

export default function BackToLogin() {
  const pathName = usePathname();
  return (
    <section className=" container mx-auto">
      <div className="mb-10">
        <Link href="/">
          <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} />
        </Link>
      </div>
      <div className="mb-4 flex items-center justify-center">
        <Image
          src="/assets/auth/reset-password.svg"
          alt="reset password"
          width={120}
          height={120}
        />
      </div>
      <div className="mt-5">
        <h1 className="font-inter text-2xl font-semibold md:text-3xl">
          Password Change Successful
        </h1>
        <p className="font-inter font-semibold text-[#666666] sm:text-sm">
          Please return to the login page to sign in with your new password.
        </p>
      </div>{' '}
      <div>
        <Link href={pathName === '/forget-pass/admin' ? '/sign-in/admin' : 'sign-in'}>
          <ReButton className="mt-5 w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-6 sm:text-lg">
            Back to Login
          </ReButton>
        </Link>
      </div>
    </section>
  );
}
