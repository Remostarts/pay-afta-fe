import Image from 'next/image';
import { ArrowRight, Headset } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewsLetter from '@/components/view/root/Home/NewsLetter';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PricingFaq from '@/components/view/root/Home/PricingFaq';

export const metadata = {
  title: 'Pricing',
};

export default function Page() {
  const feeStructure = [
    {
      range: '₦1,000 – ₦99,999',
      fee: '₦150',
    },
    {
      range: '₦1,000 – ₦24,999',
      fee: '₦250',
    },
    {
      range: '₦25,000 – ₦49,999',
      fee: '₦500',
    },
    {
      range: '₦50,000 – ₦99,999',
      fee: '₦1,000',
    },
    {
      range: '₦100,000 – ₦249,999',
      fee: '₦2,500',
    },
    {
      range: '₦250,000+',
      fee: 'Custome-Start at: 1.5%',
    },
    {
      range: 'Secure Release Fee',
      fee: '₦50',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 md:mb-20">
            <Badge className="mb-6 bg-[#E6E7FE] hover:bg-[#E6E7FE] p-2 text-[#041016]">
              Flexible Pricing
            </Badge>
            <h1 className=" mb-6 font-playfair text-5xl font-extrabold uppercase leading-tight text-[#03045B] md:text-8xl">
              Flexible pricing plan
            </h1>
            <p className="mx-auto mb-8 font-inter text-xl leading-relaxed text-[#333333]">
              Only pay when you transact. No subscriptions, no hidden fees. Just simple,
              escrow-protected payments.
            </p>
          </div>

          {/* <div>
            <Image
              src="/assets/root/pricing/pricingCalculator.png"
              alt="PayAfta Prising Calculator"
              width={1280}
              height={620}
              className="w-full rounded-lg shadow-lg"
            />
          </div> */}
        </div>

        {/* <div className="mt-5 grid md:mt-20 md:grid-cols-3">
          <div className="mb-4 flex flex-col items-center">
            <Image src="/assets/root/home/check.svg" alt="check" width={24} height={24} />
            <p className="font-inter font-semibold">Funds held securely in escrow</p>
          </div>
          <div className="mb-4 flex flex-col items-center">
            <Image src="/assets/root/home/check.svg" alt="check" width={24} height={24} />
            <p className="font-inter font-semibold">
              Released only after buyer confirms satisfaction
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Image src="/assets/root/home/check.svg" alt="check" width={24} height={24} />
            <p className="font-inter font-semibold">Transparent, dispute-protected process</p>
          </div>
        </div> */}
      </section>

      {/* Fees Works  */}
      <section>
        <h1 className=" mb-6 text-center font-playfair text-5xl font-extrabold leading-tight text-[#03045B] md:text-8xl">
          How Our Fees Work
        </h1>
        <Card className="mx-auto w-full max-w-6xl">
          <CardContent className="p-0">
            <div className="grid grid-cols-2">
              <div className=" border-r bg-gray-50 p-4">
                <h3 className="font-inter font-semibold text-[#1A1A1A]">Transaction Amount</h3>
              </div>
              <div className=" bg-gray-50 p-4 text-center">
                <h3 className="font-inter font-semibold text-[#1A1A1A]">Escrow Fees</h3>
              </div>
            </div>

            {feeStructure.map((item, index) => (
              <div key={index} className="grid grid-cols-2 border-b last:border-b-0">
                <div className=" p-4">
                  <span className="font-inter text-[#1A1A1A]">{item.range}</span>
                </div>
                <div className="p-4 text-center font-inter">
                  <span className="rounded-full p-2 font-inter">{item.fee}</span>
                </div>
              </div>
            ))}

            <div className=" p-4 text-sm text-[#03045B]">"100% refund if escrow fails"</div>
          </CardContent>
        </Card>

        <Card className="mx-auto w-full max-w-6xl mt-4">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 rounded-md">
              <div className=" border-r bg-gray-50 p-4">
                <h3 className="font-inter font-semibold text-[#1A1A1A]">Feature</h3>
              </div>
              <div className=" bg-gray-50 border-r p-4 text-center">
                <h3 className="font-inter font-semibold text-[#1A1A1A]">PayAfta</h3>
              </div>
              <div className=" bg-gray-50 p-4 text-center">
                <h3 className="font-inter font-semibold text-[#1A1A1A]">Competitor X</h3>
              </div>
            </div>

            <div className="grid grid-cols-3 border-b last:border-b-0">
              <div className=" p-4">
                <span className="font-inter text-[#1A1A1A]">Flat Fees</span>
              </div>
              <div className="p-4 text-center font-inter">
                <span className="rounded-full p-2 font-inter">✅</span>
              </div>
              <div className="p-4 text-center font-inter">
                <span className="rounded-full p-2 font-inter">❌ (% only)</span>
              </div>
            </div>

            <div className=" p-4 text-sm text-[#03045B]">
              "PayAfta fees are up to 60% lower than losing money to failed transactions."
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Pricing Chart Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-[#F6F4FF] rounded-2xl p-8">
            {/* Left Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-playfair font-extrabold text-[#03045B] mb-4 leading-tight">
                High-Volume Or <br className="hidden md:block" /> Custom Needs?
              </h2>
              <p className="text-[#333333] font-inter text-base md:text-lg mb-6 max-w-md">
                Get discounted rates for transactions above ₦250,000.
              </p>
              <Link
                href="/support"
                className="bg-[#03045B] text-white font-semibold font-inter px-6 py-3 rounded-full inline-flex items-center gap-2 transition hover:bg-[#020345]"
              >
                Talk to Our Sales Team <Headset />
              </Link>
            </div>

            {/* Right Image Chart Section */}
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <Image
                  src="/assets/root/pricing/money chart.png"
                  alt="Transaction Chart"
                  width={667}
                  height={438}
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Faqs  */}
      <PricingFaq />

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

      {/* News Latter  */}
      <NewsLetter />
    </div>
  );
}
