import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <>
      <section className="bg-navy-blue py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Left: Content */}
            <div className="space-y-6">
              <span className="rounded-full bg-sky-300 p-3 font-inter text-white">
                BEST ESCROW PAYMENT IN NIGERIA
              </span>
              <h1 className="font-playfair text-6xl font-bold leading-tight text-[#03045B] md:text-8xl">
                THE SAFEST WAY TO PAY
              </h1>
              <p className="font-inter text-lg">
                We offer you the safest way to pay for your online purchases. With Payafta, your
                money is held securely until you receive your goods or services as promised. Trust
                is at the core of what we do, and your peace of mind is our priority.
              </p>
              <Link
                href="/sign-up"
                className="inline-block rounded-full bg-[#03045B] px-6 py-3 text-base font-medium text-white"
              >
                Get Started
              </Link>
            </div>

            {/* Right: Image */}
            <div className="relative justify-self-end">
              <Image
                src="/assets/root/home/dashboard.png"
                alt="Payafta Dashboard"
                width={600}
                height={375}
                priority
                className="relative h-auto w-full md:w-[600px]"
              />
              <Image
                src="/assets/root/home/Lock.svg"
                alt=""
                width={160}
                height={160}
                priority
                className="absolute top-48 h-auto w-20 md:top-80 md:w-40"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
