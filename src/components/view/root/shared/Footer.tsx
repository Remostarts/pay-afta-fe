import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const productLinks = [
    { href: '/how-it-works', label: 'How it works' },
    { href: '/delivery', label: 'Delivery' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/support', label: 'Support' },
  ];

  const companyLinks = [
    { href: '/home', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' },
    { href: '/blog', label: 'Blog' },
  ];

  const legalLinks = [
    { href: '/terms-and-condition', label: 'Terms' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/refund-policy', label: 'Refund Policy' },
    { href: '#', label: 'Cookies' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/PayAftaHQ', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/PayAftaHQ', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/payaftahq', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/payaftahq/', label: 'LinkedIn' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          {/* Company Info */}
          <div className="flex flex-col space-y-6 md:w-[250px]">
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
            <p className="max-w-md text-sm text-gray-600">
              Experience secure, swift, and intelligent transactions with our one-of-a-kind digital
              escrow payment platform across diverse scenarios.
            </p>
          </div>

          <div className="mt-3 flex gap-20 md:mt-0 md:items-center md:justify-between">
            {/* Product Links */}
            <div>
              <h3 className="mb-6 font-semibold text-gray-900">Product</h3>
              <ul className="space-y-4">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* legal Links */}
            <div>
              <h3 className="mb-6 font-semibold text-gray-900">legal</h3>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          {/* <div>
            <h3 className="mb-6 font-semibold text-gray-900">Contact</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Plot 3, Block 8 Adeosun Street Oluyole Estate lbadan
              </p>
              <p className="text-sm text-gray-600">hello@getpayafta.com</p>
              <p className="text-sm text-gray-600">08055121522</p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label={social.label}
                  >
                    <social.icon className="size-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div> */}
        </div>

        {/* Copyright and Legal */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} PayAfta. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label={social.label}
                  target={'_blank'}
                >
                  <social.icon className="size-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
