'use client';

import Image from 'next/image';
import { ArrowRight, ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { CalendarDialog } from './calendar-dialog';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'contact' | 'faqs' | 'Book a Call'>('contact');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    agreeToPolicy: false,
  });

  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);

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

  const handleScheduleConfirm = (date: Date, time: string) => {
    const dateTime = new Date(date);
    const [timeStr, period] = time.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    dateTime.setHours(hours, minutes);
    console.log('Scheduled call for:', dateTime);
    // TODO: Send to your booking API
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Badge className="mb-6 bg-[#E6E7FE] hover:bg-[#E6E7FE] p-2 text-[#041016]">
              24/7 Powered Response
            </Badge>
            <h1 className=" mb-6 font-playfair text-5xl font-extrabold uppercase leading-tight text-[#03045B] md:text-8xl">
              We are here to help
            </h1>
            <p className="mx-auto mb-8 font-inter text-xl leading-relaxed text-[#333333]">
              We&apos;re eager to hear from you and assist with any inquiries or concerns you may
              have. Please don&apos;t hesitate to reach out to us – our team is here to help!
            </p>
          </div>
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
                variant={activeTab === 'Book a Call' ? 'default' : 'ghost'}
                className={`rounded-full px-8 py-2 transition-all ${
                  activeTab === 'Book a Call' ? 'bg-[#03045B] text-white' : ' text-[#9C9EFC]'
                }`}
                onClick={() => setActiveTab('Book a Call')}
              >
                Book a Call
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
              ) : activeTab === 'Book a Call' ? (
                <>
                  <div className="">
                    <div className="max-w-4xl mx-auto bg-[#03045B] rounded-2xl p-6 sm:p-8 shadow-lg">
                      {/* Logo */}
                      <Link href="/" className="flex items-center space-x-2">
                        <Image
                          src="/Logo.svg"
                          alt="Payafta Logo"
                          width={110.17}
                          height={40}
                          priority
                          className=" text-white"
                        />
                      </Link>

                      {/* Heading */}
                      <h2 className="text-white text-3xl sm:text-4xl font-extrabold font-playfair mb-6 leading-tight">
                        Arrange A Call With Our Representatives
                      </h2>

                      {/* Image */}
                      <div className="mb-6 overflow-hidden rounded-lg">
                        <Image
                          src="/assets/root/Representatives.jpg"
                          alt="Representative on call"
                          className="w-full h-auto object-cover"
                          width={300}
                          height={24}
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-6 py-3 bg-white text-[#03045B] font-medium rounded-md hover:bg-gray-100 transition-colors">
                          Book a 15 Min Consultation
                        </button>
                        <button
                          className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                          onClick={() => setIsCalendarDialogOpen(true)}
                        >
                          Schedule Now
                        </button>
                      </div>
                    </div>
                  </div>
                </>
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
                    <ReHeading heading="Purpose" size={'base'} />
                    <Select>
                      <SelectTrigger className="w-full border-gray-200 bg-gray-50">
                        <SelectValue placeholder="Select a purpose" />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200 bg-gray-50">
                        <SelectGroup>
                          <SelectItem value="Contact Support">Contact Support</SelectItem>
                          <SelectItem value="Contact Sales">Contact Sales</SelectItem>
                          <SelectItem value="Raise a Dispute">Raise a Dispute</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

      <CalendarDialog
        isOpen={isCalendarDialogOpen}
        onClose={() => setIsCalendarDialogOpen(false)}
        onConfirm={handleScheduleConfirm}
      />

      <div className="flex flex-col mx-auto container md:flex-row justify-evenly items-center gap-8 py-10 px-6 bg-white">
        {/* Email */}
        <div className="text-center space-y-4">
          <Mail className="mx-auto w-8 h-8 text-indigo-700" />
          <h3 className="text-lg font-semibold text-gray-900">Email</h3>
          <p className="text-sm text-gray-500">Our friendly team is here to help.</p>
          <a
            href="contact@getpayafta.com"
            className="block text-indigo-800 hover:text-indigo-600 font-medium"
          >
            contact@getpayafta.com
          </a>
        </div>

        {/* Live Chat */}
        <div className="text-center space-y-4">
          <MessageCircle className="mx-auto w-8 h-8 text-indigo-700" />
          <h3 className="text-lg font-semibold text-gray-900">Live chat</h3>
          <p className="text-sm text-gray-500">Our friendly team is here to help.</p>
          <button className="text-indigo-800 hover:text-indigo-600 font-medium">
            Start new chat
          </button>
        </div>

        {/* Phone */}
        <div className="text-center space-y-4">
          <Phone className="mx-auto w-8 h-8 text-indigo-700" />
          <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
          <p className="text-sm text-gray-500">Mon-Fri from 8am to 5pm.</p>
          <a
            href="tel:+2348055121522"
            className="block text-indigo-800 hover:text-indigo-600 font-medium"
          >
            +2348055121522
          </a>
        </div>
      </div>

      {/* News Latter  */}
      <NewsLetter />
    </div>
  );
}
