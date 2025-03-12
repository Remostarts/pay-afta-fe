import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-blue-800 py-8 sm:py-12">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 md:gap-8 lg:gap-16 xl:gap-24">
          {/* Left Section */}
          <div className="flex flex-col space-y-6">
            <Link href="/" className="inline-block w-fit">
              <Image
                src="/Logo.svg"
                alt="Payafta Logo"
                width={130}
                height={45}
                priority
                className="h-auto w-[110px] sm:w-[130px]"
              />
            </Link>
            <p className="max-w-md text-sm text-gray-600 sm:text-base">
              Experience secure, swift, and intelligent transactions with our one-of-a-kind digital
              escrow payment platform across diverse scenarios.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Phone:</span> 08055121522
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Email:</span> hello@getpayafta.com
              </p>
              <p className="text-sm sm:text-base">
                <span className="font-semibold">Address:</span> Plot 3, Block 8 Adeosun Street
                Oluyole Estate lbadan
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="rounded-full bg-sky-100 p-2 text-sky-500 transition-colors hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  aria-label={social.label}
                >
                  <social.icon className="size-5 sm:size-6" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 flex flex-col  border-t border-gray-200 pt-6 text-center text-xs text-gray-600 sm:mt-12 sm:text-sm">
        <span>Copyright © {new Date().getFullYear()} PayAfta</span>
        <span className="mt-3">
          <Link href="terms-and-condition" className="ml-3">
            TERMS & CONDITIONS
          </Link>{' '}
          <Link href="privacy-policy" className="ml-3">
            PRIVACY POLICY
          </Link>{' '}
          <Link href="refund-policy" className="ml-3">
            REFUND POLICY
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
