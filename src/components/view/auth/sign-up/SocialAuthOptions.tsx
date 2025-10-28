'use client';

import { ReButton } from '@/components/re-ui/ReButton';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SocialAuthOptionsProps {
  onContinueWithEmail: () => void;
}

export function SocialAuthOptions({ onContinueWithEmail }: SocialAuthOptionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <ReButton
        onClick={onContinueWithEmail}
        className="w-full rounded-full bg-[#03045B] py-6 font-inter font-semibold text-white sm:py-7 sm:text-lg"
      >
        Continue with email
      </ReButton>

      <div className="relative flex items-center justify-center py-4">
        <div className="w-full border-t border-gray-300" />
        <span className="absolute bg-white px-3 text-gray-500">or</span>
      </div>

      <Button className="flex w-full items-center justify-evenly gap-2 rounded-full border border-gray-300 bg-white font-inter font-semibold text-gray-700 sm:py-7 sm:text-lg">
        <Image
          src="/assets/auth/google-icons.svg"
          alt="Google"
          className="h-5 w-5"
          width={20}
          height={20}
        />
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="flex w-full items-center justify-evenly gap-2 rounded-full border border-gray-300 bg-white py-6 font-inter font-semibold text-gray-700 sm:py-7 sm:text-lg"
      >
        <Image
          src="/assets/auth/apple-icons.svg"
          alt="Apple"
          className="h-5 w-5"
          width={20}
          height={20}
        />
        Continue with Apple
      </Button>

      <Button
        variant="outline"
        className="flex w-full items-center justify-evenly gap-2 rounded-full border border-gray-300 bg-white py-6 font-inter font-semibold text-gray-700 sm:py-7 sm:text-lg"
      >
        <Image
          src="/assets/auth/facebook-icons.svg"
          alt="Facebook"
          className="h-5 w-5"
          width={20}
          height={20}
        />
        Continue with Facebook
      </Button>
    </div>
  );
}
