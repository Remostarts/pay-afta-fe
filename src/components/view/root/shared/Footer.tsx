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
    <footer className="border-t border-blue-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-[45%]">
          {/* Left Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image src="/Logo.svg" alt="Payafta Logo" width={130} height={45} priority />
            </Link>
            <p className="max-w-md text-gray-600">
              Experience secure, swift, and intelligent transactions with our one-of-a-kind digital
              escrow payment platform across diverse scenarios.
            </p>
          </div>

          {/* Right Section */}
          <div className="space-x-4 md:w-96">
            <div className="space-y-2">
              <p className="font-medium">
                <span className="font-semibold">Contact:</span> Lorem ipsum dolor
              </p>
              <p className="space-y-1">
                <span className="font-semibold">Nigeria:</span> Lorem ipsum dolor sit amet
                conctetur. In dui magna convallis congue quis sed cras arcu nibh.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="rounded-full bg-sky-100 p-2 text-sky-500 transition-colors hover:bg-sky-200"
                  aria-label={social.label}
                >
                  <social.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
        Copyright © {new Date().getFullYear()} PayAfta
      </div>
    </footer>
  );
};

export default Footer;
