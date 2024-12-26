import Image from 'next/image';
import { useEffect, useState } from 'react';

import ReOtp from '@/components/re-ui/ReOtp';
import { Button } from '@/components/ui/button';
// import { useOtp } from '@/context/OtpProvider';
import { useSearchParamsHandler } from '@/hooks/useSearchParamsHandler';

export default function VerifyEmailAddress() {
  const handleVerifyEmail = useSearchParamsHandler();
  // const { setOtp } = useOtp();
  const [timer, setTimer] = useState(90); // 1:30 in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (otp: string) => {
    // setOtp(otp);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex  flex-col items-center justify-between px-4 py-8 sm:px-6 md:py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Image
            src="/Logo.svg"
            alt="Pocket Lawyers"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold">Forgot Password</h1>

        <p className="mb-8 text-center text-gray-600">
          A Reset Code was sent a code to <span className="font-semibold">hello@gmail.com</span>
        </p>

        <p className="mb-4 text-center text-sm text-gray-600">Enter Reset Code</p>

        <ReOtp
          count={4}
          onChange={handleOtpChange}
          className="mb-4 justify-center gap-2 sm:gap-4 "
        />

        <p className="mb-6 text-center text-sm text-gray-600">
          Resend code in <span className="font-bold text-green-500">{formatTime(timer)}</span>
        </p>

        <Button
          onClick={() => handleVerifyEmail('step', '3')}
          className="w-full rounded-md bg-[#03045B] py-3 text-lg font-semibold text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
