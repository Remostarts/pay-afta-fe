import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    title: 'Buyer And Seller Agree To Terms',
    description:
      'When you make a purchase or engage in a transaction, both parties agree to use PayAfta for payment.',
    video: '/path-to-your-video1.png',
    reverse: false,
  },
  {
    title: 'Buyer Submits Payment To PayAfta',
    description:
      'The buyer makes a payment to the seller’s PayAfta wallet. The funds are securely held by PayAfta.',
    video: '/path-to-your-video2.png',
    reverse: true,
  },
  {
    title: 'Seller delivers order to buyer',
    description: 'The seller ships the product or provides the service as agreed.',
    video: '/path-to-your-video1.png',
    reverse: false,
  },
  {
    title: 'Buyer approves goods or services',
    description:
      'Once the buyer receives the goods or services and confirms their satisfaction, PayAfta releases the funds to the seller.',
    video: '/path-to-your-video2.png',
    reverse: true,
  },
  {
    title: 'PayAfta releases payment to seller',
    description:
      'If everything is as expected, the funds are released to the seller. If not, PayAfta can help mediate any disputes.',
    video: '/path-to-your-video1.png',
    reverse: false,
  },
];

export default function WorksSection() {
  return (
    <>
      <div>
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className=" mb-6 font-playfair text-5xl font-bold uppercase leading-tight text-[#03045B] md:text-8xl">
                How it works
              </h1>
              <p className="mx-auto mb-8 font-inter text-xl leading-relaxed text-[#333333]">
                PayAfta uses advanced encryption and security to protect your money, holding funds
                safely until both parties meet their obligations. Your trusted partner for
                worry-free transactions.
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

        {/* Steps  */}
        <section className="w-full px-6 md:px-16 py-12 space-y-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center gap-8 md:gap-16 ${
                step.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              {/* Text Section */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-[#03045B] leading-snug font-playfair">
                  {step.title}
                </h2>
                <p className="text-gray-700 text-sm md:text-base max-w-md mx-auto md:mx-0">
                  {step.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
                  <Link
                    href="/sign-up"
                    className="rounded-full bg-[#03045B] px-8 py-2 font-inter text-sm font-medium text-white"
                  >
                    Sign Up Now
                  </Link>
                  <span className="text-gray-600 text-sm md:text-base">
                    Ready to Trade Securely?
                  </span>
                </div>
              </div>

              {/* Video/Image Placeholder */}
              <div className="flex-1 w-full">
                <div className="bg-[#BCE0F6] aspect-video rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-[#0A0A4F]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Step 1 */}
        {/* <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/buyer-seller.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-[#F8F8F8] p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Buyer and seller agree to terms
              </h3>
              <p className="font-inter text-gray-800">
                When you make a purchase or engage in a transaction, both parties agree to use
                PayAfta for payment.
              </p>
            </div>
          </div> */}

        {/* Step 2 */}
        {/* <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/buyer-submits.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Buyer submits payment to PayAfta
              </h3>
              <p className="font-inter text-gray-800">
                The buyer makes a payment to the seller’s PayAfta wallet. The funds are securely
                held by PayAfta.
              </p>
            </div>
          </div> */}

        {/* Step 3 */}
        {/* <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/seller-delivers.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Seller delivers order to buyer
              </h3>
              <p className="font-inter text-gray-800">
                The seller ships the product or provides the service as agreed.
              </p>
            </div>
          </div>
        </div> */}

        {/* Step 4 */}
        {/* <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/buyer-approves.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Buyer approves goods or services
              </h3>
              <p className="font-inter text-gray-800">
                Once the buyer receives the goods or services and confirms their satisfaction,
                PayAfta releases the funds to the seller.
              </p>
            </div>
          </div> */}

        {/* Step 5 */}
        {/* <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/Payafta-releases.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                PayAfta releases payment to seller
              </h3>
              <p className="font-inter text-gray-800">
                If everything is as expected, the funds are released to the seller. If not, PayAfta
                can help mediate any disputes.
              </p>
            </div>
          </div>
        </div> */}

        {/* <div className="mt-14">
          <Image
            alt="video frame"
            src="/assets/root/home/videoFrame.png"
            width={1280}
            height={400}
          />
        </div> */}

        {/* <div className="mt-14">
          <iframe
            width="1280"
            height="400"
            src="https://www.youtube.com/embed/k-Y1v7Z_V3I?autoplay=0"
            title="PayAfta How It Works"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ maxWidth: '100%' }}
          ></iframe>
        </div> */}
      </div>
    </>
  );
}
