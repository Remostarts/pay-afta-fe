'use client';

import Link from 'next/link';
import Image from 'next/image';

import RecentTrackLink from './RecentTrackLink';
import RecentTransactions from './RecentTransactions';
import StatsSection from './StatsSection';
import OnboardingModal from './OnboardingModal';

import { ReHeading } from '@/components/re-ui/ReHeading';
import { useGeneral } from '@/context/generalProvider';
import { useState } from 'react';
import { ReButton } from '@/components/re-ui/ReButton';

export default function Dashboard() {
  const { user, loadUserData } = useGeneral();
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Check if user needs to complete onboarding
  const needsOnboarding =
    !user?.profile?.onBoardingStatus ||
    !user?.profile?.personalKycStatus ||
    !user?.username ||
    !user?.profile?.pinSet ||
    !user?.profile?.settlementKycStatus;

  const handleCompleteProfile = () => {
    setIsOnboardingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOnboardingModalOpen(false);
  };

  return (
    <div className="min-h-full w-full">
      <div className="flex items-center justify-between lg:mx-4">
        <ReHeading heading="Dashboard" className="font-inter font-semibold text-[#333333]" />
        <Link
          href="/dashboard/new-order"
          className="flex items-center gap-1 rounded-md border-2 border-[#E6E6E6] bg-white p-4 font-inter font-medium text-[#333333]"
        >
          <Image
            alt="new order"
            src="assets/dashboard/Dashboard/newOrderIcon.svg"
            width={25}
            height={25}
          />
          New Order
        </Link>
      </div>

      <div className="lg:m-4">
        <StatsSection />
      </div>

      {needsOnboarding && (
        <div className="flex mt-5 flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            {/* Warning Icon */}
            <Image
              alt="incompleteVerification"
              src="/assets/dashboard/Dashboard/incompleteVerification.svg"
              width={62}
              height={64}
              className="flex-shrink-0"
            />

            {/* Text Content */}
            <div>
              <strong className="font-medium text-gray-900">Action Needed</strong>
              <p className="mt-1 text-sm text-gray-600 font-inter">
                Complete your profile to unlock all features and enhance your experience.
              </p>
            </div>
          </div>

          <ReButton
            onClick={handleCompleteProfile}
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Complete your profile
          </ReButton>
        </div>
      )}

      <div className="grid lg:m-6 lg:grid-cols-2 lg:gap-2">
        <RecentTrackLink />
        <RecentTransactions transactions={user?.Wallet[0]?.transactions} />
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={isOnboardingModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
