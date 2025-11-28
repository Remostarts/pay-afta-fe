'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ReInput from '@/components/re-ui/re-input/ReInput';
import { ReHeading } from '@/components/re-ui/ReHeading';
import ReSelect from '@/components/re-ui/ReSelect';
import { Form } from '@/components/ui/form';
import {
  identityVerificationSchema,
  TidentityVerification,
} from '@/lib/validations/onboarding.validation';
import { ReButton } from '@/components/re-ui/ReButton';
import { useGeneral } from '@/context/generalProvider';
import { kycIdentityVerification } from '@/lib/actions/onboarding/onboarding.actions';
import { toast } from 'sonner';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type defaultVal = {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  phone: string;
  bvn: string;
};

const defaultValues: defaultVal = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: new Date(),
  phone: '',
  bvn: '',
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

interface IdentityVerificationProps {
  onComplete?: () => void;
}

export default function IdentityVerification({ onComplete }: IdentityVerificationProps = {}) {
  const router = useRouter();
  const form = useForm<TidentityVerification>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, formState, watch } = form;
  const { isSubmitting, isValid } = formState;
  const { onboardingStatus, user, loadUserData } = useGeneral();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [kycResult, setKycResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // if completed identityVerification
  useEffect(() => {
    if (onboardingStatus === true && user?.profile?.identityVerified === true) {
      // Verification completed successfully - the modal will be closed by the parent component
      toast.success('Identity verification completed successfully!');
    }
  }, [onboardingStatus, user]);

  const onSubmit = async (data: TidentityVerification) => {
    try {
      const result = await kycIdentityVerification(data);

      if (result.success) {
        toast.success(result.message || 'Identity verified successfully!');
        setKycResult({ success: true, message: result.message });
        loadUserData();

        // Call the completion callback if provided
        if (onComplete) {
          setTimeout(() => {
            onComplete();
          }, 1500); // Give time for the success message to be visible
        }
      } else {
        toast.error(result.message || 'Identity verification failed.');
        setKycResult({ success: false, message: result.message });
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || 'Something went wrong';
      toast.error(msg);
      setKycResult({ success: false, message: msg });
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    signOut({
      redirect: true,
      callbackUrl: '/',
    });
    setShowLogoutDialog(false);
    toast.success('Successfully logged out');
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <section className="bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center mb-5">
          <h1 className="font-inter text-2xl font-bold text-zinc-700">Identity verification</h1>
          <button
            onClick={handleLogoutClick}
            className="flex-shrink-0 rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <Image
              src="/assets/dashboard/Dashboard/power-button.svg"
              alt="Logout"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </button>
        </div>
        <p className="mb-5 font-inter text-zinc-500">
          Identity verification is required to access your dashboard. Please provide your personal
          information as it appears on your bank verification documents for accurate account
          matching and processing.
        </p>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 items-center gap-3">
              <div>
                <ReHeading heading="First Name" size={'base'} />
                <ReInput name="firstName" />
              </div>
              <div>
                <ReHeading heading="Last Name" size={'base'} />
                <ReInput name="lastName" />
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-3">
              <div>
                <ReHeading heading="Gender" size={'base'} />
                <ReSelect name="gender" placeholder="Select" options={genderOptions} />
              </div>
              <div>
                <ReHeading heading="Date of Birth" size={'base'} />
                <ReInput type="date" name="dateOfBirth" />
              </div>
            </div>
            <div>
              <ReHeading heading="Enter Phone Number" size={'base'} />
              <ReInput name="phone" />
            </div>
            <div>
              <ReHeading heading="Enter BVN" size={'base'} />
              <ReInput name="bvn" />
            </div>
            <div>
              {kycResult && (
                <p
                  className={`mt-3 font-medium ${
                    kycResult.success ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {kycResult.message}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end">
              {/* <DialogClose asChild> */}
              <ReButton
                className=" rounded-full bg-[#03045B] py-10 font-inter text-white sm:py-4"
                type="submit"
                isSubmitting={isSubmitting}
              >
                Verify Identity
              </ReButton>
              {/* </DialogClose> */}
            </div>
          </form>
        </Form>
      </section>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
