'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

import { ReHeading } from '@/components/re-ui/ReHeading';

type IRegistrationComplete = {
  handleRegistrationComplete: Dispatch<SetStateAction<boolean>>;
};

export default function RegistrationCompleted({
  handleRegistrationComplete,
}: IRegistrationComplete) {
  function handleRegistration() {
    setTimeout(() => {
      handleRegistrationComplete(false);
    }, 300);
  }

  return (
    <section>
      <div>
        <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} />
      </div>
      <div className=" mt-10 flex flex-col items-center justify-center">
        <Image
          alt="registration complete"
          src="/assets/auth/registrationComplete.svg"
          width={317}
          height={196}
        />
        <div className="mb-5 text-center">
          <h1 className=" mt-10 text-2xl font-semibold md:text-4xl">Thank You for Registering!</h1>
          <p className=" text-center">
            Your request to join as a Logistics Partner has been received.Our team will review your
            submission and get in touch within 48 hours.
          </p>
        </div>
        <div className="mt-4">
          <Link
            href="/"
            className="rounded-full bg-[#03045B] p-4 font-inter font-semibold text-white"
            onClick={handleRegistration}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
