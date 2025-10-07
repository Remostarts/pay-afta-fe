'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsLetter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Subscribe email:', email);
    setEmail('');
  };

  return (
    <section className="mt-10 bg-[#E6E7FE] py-5 md:p-8">
      <div className=" px-4">
        <div className="container mx-auto grid gap-5 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-inter text-2xl font-bold text-black">Join our newsletter</h2>
            <p className="text-lg text-gray-600">
              Get exclusive insights and escrow best practices - straight to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 rounded-md border-2 px-6 border-gray-400"
            />
            <Button
              type="submit"
              className="h-12 rounded-full bg-[#03045B] px-8 font-semibold text-white hover:bg-[#03045B]/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
