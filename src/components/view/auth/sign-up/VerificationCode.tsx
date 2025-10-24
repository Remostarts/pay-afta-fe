'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import ReOtp from '@/components/re-ui/ReOtp';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOtp } from '@/context/OtpProvider';
import { verifyEmail } from '@/lib/actions/auth/signup.actions';
import { toast } from '@/components/ui/use-toast';
import { Loader } from 'lucide-react';

export default function VerificationCode() {
  const [otp, setOtp] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { email } = useOtp();
  const [isLoading, setIsLoading] = useState(false);
  const [displayTime, setDisplayTime] = useState(60);
  const timeRef = useRef(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (timeRef.current > 0) {
        timeRef.current -= 1;
        setDisplayTime(timeRef.current);
      }
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp.replace(/\D/g, '')); // allow only digits
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (otp.length !== 4) return;

    setIsLoading(true); // ✅ start loader before request
    try {
      const response = await verifyEmail({ email, emailVerificationCode: otp });

      if (response?.success) {
        setIsError(false);
        setIsDialogOpen(true);
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      setIsError(true);
      toast({
        title: 'Error',
        description: 'OTP is not valid',
      });
    } finally {
      setIsLoading(false); // ✅ always stop loader
    }
  };

  return (
    <section>
      {/* Logo */}
      <div>
        <Link href="/">
          <Image src="/Logo.svg" alt="Payafta Logo" width={176} height={64} />
        </Link>
      </div>

      {/* Heading */}
      <div className="mt-5">
        <h1 className="font-inter text-2xl font-bold">Verification</h1>
        <p className="font-inter text-sm font-semibold text-gray-600">
          Enter the 4 digit code sent to {email}
        </p>
      </div>

      {/* OTP Section */}
      <div className="mt-10 flex w-full flex-col items-start p-4">
        <p className="mb-4 text-sm font-semibold text-gray-600">Enter Verification Code</p>
        <ReOtp count={4} onChange={handleOtpChange} className="mb-4 gap-2 sm:gap-4" />

        {timeRef.current > 0 ? (
          <p className="mb-6 text-center text-sm text-gray-600">
            Resend code in{' '}
            <span className="font-bold text-green-500">{formatTime(displayTime)}</span>
          </p>
        ) : (
          <p className="mb-6 text-center text-sm text-green-500 cursor-pointer hover:underline">
            Resend OTP
          </p>
        )}
      </div>

      {/* Verify Button */}
      <Button
        onClick={handleSubmit}
        className="w-4/5 rounded-full bg-[#03045B] py-5 text-lg font-semibold text-white hover:bg-[#03045B]/90 transition-all"
        disabled={isLoading || otp.length !== 4}
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <Loader className="size-5 animate-spin" />
            <span className="animate-pulse">Verifying...</span>
          </span>
        ) : (
          'Verify'
        )}
      </Button>

      {/* Success Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex flex-col items-center justify-center text-center sm:max-w-[425px]">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex justify-center">
              <Image src="/Logo.svg" alt="Payafta Logo" width={176} height={64} />
            </DialogTitle>
          </DialogHeader>

          <h1 className="mb-2 font-inter text-3xl font-bold text-gray-800">Welcome to PayAfta!</h1>
          <p className="mb-8 font-inter text-base text-gray-600">
            Your gateway to secure, worry-free transactions.
          </p>

          <DialogFooter className="w-full">
            <Link
              href="/dashboard"
              className="w-full rounded-full bg-[#03045B] py-2 font-inter text-lg font-semibold text-white hover:bg-[#03045B]/90"
            >
              Start Exploring
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
