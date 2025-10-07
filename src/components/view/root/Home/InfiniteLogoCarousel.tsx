'use client';

import { Marquee } from '@/components/custom-ui/marquee';
import Image from 'next/image';
import React from 'react';

const brands = [
  { alt: 'remostart', img: '/assets/root/home/remostart.png' },
  { alt: 'datamellon', img: '/assets/root/home/datamellon.png' },
  { alt: 'pila', img: '/assets/root/home/pila.png' },
  { alt: 'firstfounders', img: '/assets/root/home/firstfounders.png' },
  { alt: 'firstfounders', img: '/assets/root/home/pocketLawyers.png' },
];

export const InfiniteLogoCarousel = () => {
  return (
    <section className="mx-auto max-w-9xl">
      <div className="mx-4 px-4 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8 xl:mx-16">
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {brands.map((logo, index) => (
              <Image
                key={index}
                src={logo.img}
                alt={logo.alt}
                width={400}
                height={220}
                className="m-8 w-full max-w-md"
              />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
};
