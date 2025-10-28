'use client';

import { useState } from 'react';
import { SocialAuthOptions } from '@/components/view/auth/sign-up/SocialAuthOptions';
import SignupForm from '@/components/view/auth/sign-up/SignupForm';
import Link from 'next/link';
import Image from 'next/image';

export default function SignupEmailOrSocialAuth() {
  const [showEmailSignup, setShowEmailSignup] = useState(false);

  return (
    <section>
      <div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} priority />
        </Link>
      </div>
      <div className="mb-10">
        <h1 className="mt-3 font-inter text-2xl font-bold">Sign up</h1>
        <p className="font-inter text-gray-500">
          Already registered?{' '}
          <Link href="/sign-in" className="font-inter font-semibold text-[#03045B]">
            Sign in
          </Link>
        </p>
      </div>
      {showEmailSignup ? (
        <SignupForm />
      ) : (
        <SocialAuthOptions onContinueWithEmail={() => setShowEmailSignup(true)} />
      )}
    </section>
  );
}
