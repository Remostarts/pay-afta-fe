'use client';

import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import Faqs from './Faq';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewsLetter from '@/components/view/root/Home/NewsLetter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ReHeading } from '@/components/re-ui/ReHeading';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'contact' | 'faqs'>('contact');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    agreeToPolicy: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto mt-10 max-w-8xl md:mx-16">
        <div className="mb-8 px-4 md:mb-20">
          <Badge className="mb-6 bg-[#E6E7FE] p-2 text-[#041016]">24/7 Powered Response</Badge>
          <h1 className=" mb-6 font-playfair text-5xl font-bold uppercase leading-tight text-[#03045B] md:text-8xl">
            We are here to help
          </h1>
          <p className="mx-auto mb-8 font-inter text-xl leading-relaxed text-[#333333]">
            We&apos;re eager to hear from you and assist with any inquiries or concerns you may
            have. Please don&apos;t hesitate to reach out to us – our team is here to help!
          </p>
        </div>
      </section>

      {/* contact section  */}
      <div className="m-auto flex min-h-screen max-w-8xl items-center justify-center rounded-3xl bg-[#6B6DFA] p-6">
        <div className="w-full max-w-2xl">
          {/* Toggle Buttons */}
          <div className="mb-8 flex justify-center">
            <div className="flex rounded-full bg-white p-1">
              <Button
                variant={activeTab === 'contact' ? 'default' : 'ghost'}
                className={`rounded-full px-8 py-2 transition-all ${
                  activeTab === 'contact' ? 'bg-[#03045B] text-white' : ' text-[#9C9EFC]'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                Contact
              </Button>
              <Button
                variant={activeTab === 'faqs' ? 'default' : 'ghost'}
                className={`rounded-full px-8 py-2 transition-all ${
                  activeTab === 'faqs' ? 'bg-[#03045B] text-white' : ' text-[#9C9EFC]'
                }`}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs
              </Button>
            </div>
          </div>

          {/* Content Card */}
          <Card className="rounded-3xl bg-white shadow-xl">
            <CardContent className="p-8">
              {activeTab === 'faqs' ? (
                /* FAQ Content */
                <div className="">
                  <Faqs />
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <ReHeading heading="Frist name" size={'base'} />
                      <Input
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="border-gray-200 bg-gray-50"
                      />
                    </div>
                    <div>
                      <ReHeading heading="Last name" size={'base'} />
                      <Input
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="border-gray-200 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <ReHeading heading="Email" size={'base'} />
                    <Input
                      type="email"
                      placeholder="kindness@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-200 bg-gray-50"
                    />
                  </div>

                  <div>
                    <ReHeading heading="Message" size={'base'} />
                    <Textarea
                      placeholder="Leave Us A Message..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="min-h-[120px] resize-none bg-gray-50"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.agreeToPolicy}
                      onCheckedChange={(checked) =>
                        handleInputChange('agreeToPolicy', checked as boolean)
                      }
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      You agree to our friendly{' '}
                      <span className="cursor-pointer underline hover:text-purple-600">
                        privacy policy
                      </span>
                      .
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-slate-900 py-3 font-medium text-white hover:bg-slate-800"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* News Latter  */}
      <NewsLetter />
    </div>
  );
}
