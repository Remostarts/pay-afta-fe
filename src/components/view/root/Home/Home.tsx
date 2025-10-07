import { ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

import { Waitlist } from '../shared/navbar/Waitlist';

import Faqs from './Faq';
import HeroSection from './HeroSection';
import WorksSection from './WorkSection';
import BuyAndSellSection from './BuyAndSellSection';
import EscrowPaymentsSection from './EscrowPaymentsSection';
import NewsLetter from './NewsLetter';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Marquee } from '@/components/custom-ui/marquee';
import { InfiniteLogoCarousel } from './InfiniteLogoCarousel';
import { Testimonials } from './Testimonials';
import Link from 'next/link';

const brands = [
  { alt: 'remostart', img: '/assets/root/home/remostart.png' },
  { alt: 'datamellon', img: '/assets/root/home/datamellon.png' },
  { alt: 'pila', img: '/assets/root/home/pila.png' },
  { alt: 'firstfounders', img: '/assets/root/home/firstfounders.png' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Brands Section  */}
      <InfiniteLogoCarousel />

      {/* Worried Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 font-playfair text-4xl font-bold text-[#03045B] md:text-5xl">
                Worried You Might Get Scammed On Your Next Online Purchase ?
              </h2>
            </div>

            <div className="relative">
              <p className="font-inter">
                That’s where{' '}
                <span className="font-inter font-semibold text-[#03045B] text-lg">
                  PayAfta’s secure escrow payment
                </span>{' '}
                system steps in. Your funds are held safely until you confirm receipt and
                satisfaction. If anything goes wrong, our team is right here to help so you shop and
                sell online with complete confidence.
              </p>
              <div className="mt-4 flex items-center gap-5 font-inter">
                <p className="flex items-center font-inter font-semibold text-[#1A1A1A]">
                  <Image
                    alt="protection"
                    src="assets/root/home/shildGIF.svg"
                    width={32}
                    height={32}
                  />{' '}
                  Buyer Protection
                </p>
                <p className="flex items-center font-inter font-semibold text-[#1A1A1A]">
                  <Image
                    alt="protection"
                    src="assets/root/home/shildGIF.svg"
                    width={32}
                    height={32}
                  />{' '}
                  Seller Protection
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Protection Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-40">
            <div>
              <h2 className="mb-6 font-playfair text-4xl font-bold text-[#03045B] md:text-6xl">
                Buyer Protection With PayAfta
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                PayAfta takes buyer protection seriously. We&apos;re here to ensure that you receive
                what you paid for. Our process guarantees that your money is held securely until you
                confirm your satisfaction. If you encounter any issues with your purchase, our team
                is ready to assist and, if necessary, facilitate refunds. Your peace of mind is our
                top priority.
              </p>
            </div>

            <div>
              <Image
                src="/assets/root/home/buyerProtection.png"
                alt="Buyer Protection Image"
                width={576}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seller Protection Section */}
      <section className="bg-white py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-40">
            <div className="order-2 lg:order-1">
              <Image
                src="/assets/root/home/sellerProtection.png"
                alt="Seller Protection Image"
                width={576}
                height={400}
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="mb-6 font-playfair text-4xl font-bold text-[#03045B] md:text-6xl">
                Seller Protection With PayAfta
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                Sellers, we&apos;ve got your back too. PayAfta provides seller protection by
                ensuring that you receive payment once you fulfill your part of the deal. You can
                trust us to hold the buyer&apos;s funds securely until the transaction is complete.
                We&apos;re committed to making your online sales as smooth and secure as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials sections */}
      <Testimonials />

      {/* How It Works Section */}
      {/* <WorksSection /> */}

      {/* What Can You Buy Section */}
      <BuyAndSellSection />

      {/* Mobile App Section */}
      <EscrowPaymentsSection />

      {/* CTA Section */}
      <section className="relative ml-2 mt-14 overflow-hidden rounded-xl bg-[#03045B] p-8 shadow-lg md:mt-32">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-auto bg-repeat opacity-25"
            style={{
              backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 font-playfair text-4xl font-bold text-white opacity-90 md:text-5xl">
            Get Started Today
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-inter text-xl text-white opacity-90">
            Ready to experience these features in action? Start optimizing your team&apos;s
            collaboration today.
          </p>
          <Link
            href="/sign-up"
            className="mb-16 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-medium text-[#02034A] no-underline transition-all opacity-80"
          >
            Get Started
            <ArrowRight className="ml-2 size-5" />
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <Faqs />

      {/* Join NewsLetter  */}
      <NewsLetter />
    </div>
  );
}
