'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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

export default function VerificationCode() {
  const [otp, setOtp] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // Track dialog state
  const { email } = useOtp();
  const timeRef = useRef(60); // Timer starts at 60 seconds
  const [displayTime, setDisplayTime] = useState(60);
  // eslint-disable-next-line no-undef
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Start the timer
    intervalRef.current = setInterval(() => {
      if (timeRef.current > 0) {
        timeRef.current -= 1;
        setDisplayTime(timeRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleOtpChange = (newOtp: string) => {
    const numericOtp = newOtp.replace(/\D/g, '');
    setOtp(numericOtp);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    // Stop the timer
    // if (intervalRef.current !== null) {
    //   clearInterval(intervalRef.current);
    // }

    try {
      const response = await verifyEmail({ email, emailVerificationCode: otp });
      if (response?.success) {
        setIsError(false);
        setIsDialogOpen(true); // Open the dialog if OTP is valid
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      setIsError(true);
      toast({
        title: 'Error',
        description: 'OTP is not valid',
      });
    }
  };

  const handleProceed = () => {
    router.push('/sign-in'); // Navigate to the next page
  };

  return (
    <section>
      <div>
        <Image src="/Logo.svg" alt="Payafta Logo" width={176} height={64} />
      </div>
      <div className="mt-5">
        <h1 className="font-inter text-2xl font-bold">Verification</h1>
        <p className="font-inter text-sm font-semibold text-gray-600">
          Enter the 4 digit code sent to +2347011223344.
        </p>
      </div>
      <div className="mt-10 flex w-full flex-col items-start p-4">
        <p className="mb-4 text-sm font-semibold text-gray-600">Enter Verification Code</p>
        <ReOtp count={4} onChange={handleOtpChange} className="mb-4 gap-2 sm:gap-4" />
        {timeRef.current > 0 ? (
          <p className="mb-6 text-center text-sm text-gray-600">
            Resend code in{' '}
            <span className="font-bold text-green-500">{formatTime(displayTime)}</span>
          </p>
        ) : (
          <p className="mb-6 text-center text-sm text-green-500">Resend OTP</p>
        )}
      </div>
      <Button
        onClick={handleSubmit}
        className="w-4/5 rounded-full bg-[#03045B] py-5 text-lg font-semibold text-white hover:bg-[#03045B]"
        disabled={otp.length !== 4}
      >
        Verify
      </Button>
      {/* Dialog for success */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <Image src="/Logo.svg" alt="Payafta Logo" width={176} height={64} />
            </DialogTitle>
          </DialogHeader>
          <h1 className="mb-5 font-inter text-4xl font-bold text-gray-800">Account Created</h1>
          <DialogFooter>
            <Button
              className="w-full rounded-full bg-[#03045B] py-5 font-inter text-lg font-semibold text-white hover:bg-[#03045B]"
              onClick={handleProceed}
            >
              Proceed to dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
