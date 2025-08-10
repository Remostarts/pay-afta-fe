import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewsLetter from '@/components/view/root/Home/NewsLetter';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Pricing',
};

export default function Page() {
  const feeStructure = [
    {
      range: '₦1,000 – ₦99,999',
      fee: 'Flat fee: ₦500',
    },
    {
      range: '₦100,000 – ₦499,999',
      fee: 'Flat fee: ₦1,000',
    },
    {
      range: '₦500,000 – ₦1,000,000',
      fee: 'Flat fee: ₦2,500',
    },
    {
      range: '₦1,000,000 and above',
      fee: 'Contact our marketing team',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 md:mb-20">
            <Badge className="mb-6 bg-[#E6E7FE] p-2 text-[#041016]">Flexible Pricing</Badge>
            <h1 className=" mb-6 font-playfair text-5xl font-bold uppercase leading-tight text-[#03045B] md:text-8xl">
              Flexible pricing plan
            </h1>
            <p className="mx-auto mb-8 font-inter text-xl leading-relaxed text-[#333333]">
              Only pay when you transact. No subscriptions, no hidden fees. Just simple,
              escrow-protected payments.
            </p>
          </div>

          <div>
            <Image
              src="/assets/root/pricing/pricingCalculator.png"
              alt="PayAfta Prising Calculator"
              width={1280}
              height={620}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="mt-5 grid md:mt-20 md:grid-cols-3">
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
        </div>
      </section>

      {/* Fees Works  */}
      <section>
        <h1 className=" mb-6 text-center font-playfair text-5xl font-bold leading-tight text-[#03045B] md:text-8xl">
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
                  <span className="rounded-full bg-[#E8FDEF] p-2 font-medium text-green-600">
                    {item.fee}
                  </span>
                </div>
              </div>
            ))}

            <div className=" p-4 text-sm text-[#03045B]">
              Fees are automatically calculated and shown before you pay.
            </div>
          </CardContent>
        </Card>
      </section>

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
          <Button
            size="lg"
            className=" rounded-full bg-white px-8 py-4 text-lg text-[#03045B] opacity-90"
          >
            Get Started For Free
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>

      {/* News Latter  */}
      <NewsLetter />
    </div>
  );
}
