import { ArrowRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  return (
    <>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-[#E6E7FE] p-2 text-[#041016] hover:bg-[#E6E7FE]">
            Trusted Escrow for Global Commerce
          </Badge>

          <h1 className="mb-6 font-playfair text-5xl font-extrabold leading-tight text-[#03045B] md:text-8xl">
            THE SAFEST WAY TO PAY
          </h1>

          <p className="mx-auto mb-8 max-w-3xl font-inter text-xl leading-relaxed text-[#333333]">
            We offer you the safest way to pay for your online purchases. With PayAfta, your money
            is held securely until you receive your goods or services as promised. Trust is at the
            core of what we do, and your peace of mind is our priority.
          </p>

          <Link
            href="/sign-up"
            className="mb-16 inline-flex items-center justify-center rounded-full bg-[#03045B] px-8 py-4 text-lg font-medium text-white no-underline transition-all hover:bg-[#02034A]"
          >
            Get Started
            <ArrowRight className="ml-2 size-5" />
          </Link>

          {/* Dashboard Mockup */}
          <div className="flex justify-center align-middle">
            <Image
              alt="home image"
              src="/assets/root/home/homeContainer.png"
              width={1280}
              height={521}
            />
          </div>
        </div>
      </section>
    </>
  );
}
