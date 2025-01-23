'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import ReOtp from '@/components/re-ui/ReOtp';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useOtp } from '@/context/OtpProvider';
import { verifyEmail } from '@/lib/actions/auth/signup.actions';

export default function VerificationCode() {
  const [otp, setOtp] = useState<string>('');
  const { email } = useOtp();
  console.log('🌼 🔥🔥 email🌼', email);
  const [timer, setTimer] = useState<number>(90);
  const route = useRouter();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleOtpChange = (newOtp: string) => {
    // Ensure only numeric input is allowed
    const numericOtp = newOtp.replace(/\D/g, '');
    setOtp(numericOtp);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  function handleClick() {
    route.push('/sign-in');
  }

  // Check if all OTP fields are filled
  const isOtpComplete = otp.length === 4;
  const handleSubmit = async () => {
    // server actions should be here
    try {
      const response = await verifyEmail({ email, emailVerificationCode: otp });
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);
      if (response?.success) {
        console.log('🌼 🔥🔥 onSubmit 🔥🔥 response🌼', response);
      }
    } catch (error) {
      console.log('🌼 🔥🔥 onSubmit 🔥🔥 error🌼', error);
    }
  };

  return (
    <section>
      <div>
        <Image src="/Logo.svg" alt="Pay afta" width={176} height={64} />
      </div>
      <div className="mt-5">
        <h1 className="font-inter text-2xl font-bold">Verification</h1>
        <p className="font-inter text-sm font-semibold text-gray-600">
          Enter the 4 digit sent to +2347011223344.
        </p>
      </div>
      <div className="mt-10 flex w-full flex-col items-start p-4">
        <p className="mb-4 text-sm font-semibold text-gray-600">Enter Verification Code</p>
        <ReOtp count={4} onChange={handleOtpChange} className="mb-4 gap-2 sm:gap-4" />
        {/* <p className="mb-6 text-center text-sm text-gray-600">
          Resend code in <span className="font-bold text-green-500">{formatTime(timer)}</span>
        </p> */}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={handleSubmit}
            className="w-4/5 rounded-full bg-[#03045B] py-5 text-lg font-semibold text-white hover:bg-[#03045B]"
            disabled={!isOtpComplete}
          >
            Verify
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <Image src="/Logo.svg" alt="Payafta Logo" width={176} height={64} />
            </DialogTitle>
          </DialogHeader>
          <h1 className=" mb-5 font-inter text-4xl font-bold text-gray-800">Account Created</h1>
          <DialogFooter>
            <Button
              className="w-full rounded-full bg-[#03045B] py-5 font-inter text-lg font-semibold text-white hover:bg-[#03045B]"
              onClick={handleClick}
            >
              Proceed to dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
