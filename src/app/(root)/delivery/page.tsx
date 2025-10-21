'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Menu } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NewsLetter from '@/components/view/root/Home/NewsLetter';
import Link from 'next/link';

const deliverySteps = [
  {
    id: 'order-placed',
    title: 'Order is Placed',
    description:
      'Once the buyer completes checkout and funds are held in escrow, delivery can begin.',
    image: '/assets/root/delivery/orderPlace.png',
  },
  {
    id: 'partner-chosen',
    title: 'Delivery Partner is Chosen',
    description:
      'If the buyer chooses the order, they select a delivery partner at checkout.\nIf the seller chooses the order, they can use a preferred logistics provider.',
    image: '/assets/root/delivery/chooseDelivery.png',
  },
  {
    id: 'delivery-support',
    title: 'Optional Delivery Support',
    description:
      'Using our integrated delivery partners is optional. Sellers may use their own trusted logistics.',
    image: '/assets/root/delivery/deliverySupport.png',
  },
  {
    id: 'tracking',
    title: 'Delivery & Tracking',
    description:
      'The delivery partner handles pickup. Both parties can monitor progress from their smartphones.',
    image: '/assets/root/delivery/deliveryTracking.png',
  },
  {
    id: 'receipt',
    title: 'Buyer Confirms Receipt',
    description:
      'Once delivery is confirmed by the buyer, escrow funds are released to the seller.',
    image: '/assets/root/delivery/deliveryReceipt.png',
  },
];

export default function PayAftaLanding() {
  const [activeStep, setActiveStep] = useState('order-placed');

  const currentStep = deliverySteps.find((step) => step.id === activeStep) || deliverySteps[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Badge className="mb-6 bg-[#E6E7FE] p-2 text-[#041016] hover:bg-[#E6E7FE]">
              Flexible Delivery by Trusted Logistics Partners
            </Badge>
            <h1 className=" mb-6 font-playfair text-5xl font-extrabold uppercase leading-tight text-[#03045B] md:text-8xl">
              DELIVER WITH PAYAFTA
            </h1>
            <p className="mx-auto mb-8 font-inter text-xl leading-relaxed text-[#333333]">
              PayAfta makes it easy to handle product deliveries after a secure transaction. Whether
              you&apos;re buying or selling, our system works seamlessly with third-party delivery
              providers, giving both parties the flexibility to choose the most convenient option.
            </p>
          </div>

          <div>
            <Image
              src="/assets/root/delivery/heroImg.png"
              alt="PayAfta delivery service"
              width={1280}
              height={620}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* How Delivery Works */}
      <section className=" py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 font-playfair text-3xl font-extrabold text-[#03045B] lg:text-7xl">
            How Delivery Works
          </h2>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              {deliverySteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`cursor-pointer border-l-4 p-5 transition-all duration-300 ${
                    activeStep === step.id
                      ? 'border-[#03045B] bg-white'
                      : 'border-gray-300 hover:bg-white hover:shadow-sm'
                  }`}
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  <h3 className="mb-2 text-lg font-bold text-[#1A1A1A]">{step.title}</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#333333]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={`flex min-h-[400px] items-center justify-center rounded-lg p-8 transition-all duration-500`}
            >
              <div className="text-center">
                <Image
                  src={currentStep.image || '/placeholder.svg'}
                  alt={currentStep.title}
                  width={608}
                  height={560}
                  className="mx-auto mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Payments Section */}
      <section className=" py-16">
        <div className="container mx-auto px-4 ">
          <div className="grid items-center rounded-lg bg-[#D4EBF7] p-3 md:gap-12 md:p-10 lg:grid-cols-2">
            <div className="rounded-lg p-8">
              <h2 className="mb-6 font-playfair text-3xl font-extrabold text-[#03045B] md:text-6xl">
                Split Payments, Unified Checkout
              </h2>
              <p className="mb-6 text-gray-700">
                Delivery fees are handled separately from escrow, but both appear on the same
                invoice—so checkout feels unified and transparent.
              </p>
              <p className="mb-6 text-gray-700">
                Each logistics provider has their own virtual account so buyers may receive two
                account numbers during checkout:
              </p>
            </div>

            <div className="space-y-4">
              <Image
                alt="splitPayment"
                src="/assets/root/delivery/splitPayment.png"
                width={534}
                height={377}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nationwide Delivery Coverage */}
      <section className="">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-6 font-playfair text-5xl font-extrabold leading-tight text-[#03045B] md:text-7xl">
              Nationwide Delivery Coverage
            </h1>
            <p className="mx-auto mb-8 max-w-3xl font-inter text-xl leading-relaxed text-[#333333]">
              Our network of logistics partners supports both local and inter-city deliveries,
              giving buyers more reach and sellers more options.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-evenly w-full gap-6">
            {/* Card 1 */}
            <div className="rounded-md bg-[#F8F8F8] p-6 w-full md:w-2/5 text-center">
              <Image
                src="/assets/root/delivery/transparentDelivery.png"
                alt="Transparent, Trackable Shipments"
                width={510}
                height={341}
                className="mx-auto mb-6"
              />
              <h3 className="mb-4 font-playfair text-2xl font-extrabold">
                Transparent, Trackable Shipments
              </h3>
              <p className="text-gray-700">
                All deliveries can be tracked directly from the seller’s dashboard, providing both
                sellers and buyers with real-time updates throughout the entire delivery process.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-md bg-[#F8F8F8] p-6 w-full md:w-2/5 text-center">
              <Image
                src="/assets/root/delivery/flexiableDelivery.png"
                alt="Flexible for the Future"
                width={510}
                height={341}
                className="mx-auto mb-6"
              />
              <h3 className="mb-4 font-playfair text-2xl font-extrabold">
                Flexible for the Future
              </h3>
              <p className="text-gray-700">
                As PayAfta evolves, users will enjoy access to more delivery options, empowering
                sellers to choose logistics partners that match their product type, delivery speed,
                and customer preferences.
              </p>
            </div>
          </div>
        </div>
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
          <h2 className="mb-6 font-playfair text-4xl font-extrabold text-white opacity-90 md:text-5xl">
            Get Started Today
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-inter text-xl text-white opacity-90">
            Ready to experience these features in action? Start optimizing your team&apos;s
            collaboration today.
          </p>
          <Link
            href="/sign-up"
            className="mb-16 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-medium text-[#02034A] no-underline transition-all opacity-90"
          >
            Get Started for free
            <ArrowRight className="ml-2 size-5" />
          </Link>
        </div>
      </section>

      {/* News Latter  */}
      <NewsLetter />
    </div>
  );
}
