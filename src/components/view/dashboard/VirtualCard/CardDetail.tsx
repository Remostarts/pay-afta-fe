'use client';

import { useState } from 'react';

import FundWallet from './FundWallet';
import WithdrawalModal from './WithdrawalModal';
import TransactionPinModal from './TransactionPinModal';
import SuccessConfirmation from './SuccessConfirmation';

import { useDialog } from '@/hooks/useDialog';
import { ReButton } from '@/components/re-ui/ReButton';
import { ReSwitch } from '@/components/re-ui/ReSwitch';
import { ReDialog } from '@/components/re-ui/ReDialog';

export default function CardDetail() {
  const { currentStep, nextStep } = useDialog(1, 3);

  const renderDialogContent = () => {
    switch (currentStep) {
      case 1:
        return <WithdrawalModal handleCurrentDialogStep={nextStep} />;
      case 2:
        return <TransactionPinModal handleCurrentDialogStep={nextStep} />;
      case 3:
        return (
          <SuccessConfirmation
            handleCurrentDialogStep={nextStep}
            lable={'Withdrawal Successful'}
            description={'Fund now available on your wallet balance.'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 p-4">
      <h2 className="mb-2 text-center font-inter text-xl font-bold">Card Balance</h2>
      <p className="mb-4 text-center font-inter text-2xl text-gray-600">₦24,543.00</p>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-[#666666]">Name</p>
        <p className="text-xl text-[#1A1A1A]">Paul Simeon</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-[#666666]">Card Number</p>
        <p className="text-xl text-[#1A1A1A]">0000 0000 0000 0000</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-[#666666]">Valid Thru</p>
        <p className="text-xl text-[#1A1A1A]">16/26</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-[#666666]">CVV</p>
        <p className="text-xl text-[#1A1A1A]">1626</p>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-inter font-medium text-[#666666]">Block Card</p>
        <ReSwitch name="blockCard" className="text-[#03045B]" />
      </div>
      <div className="mt-5 flex w-full justify-center space-x-2">
        <ReDialog
          btnLable={'Fund Card'}
          DialogComponent={FundWallet}
          classNames={'w-full text-white'}
        />
        <ReDialog
          btnLable={'Withdrawal'}
          DialogComponent={renderDialogContent}
          classNames={
            'w-[50%] rounded-full border border-[#03045B] bg-white font-inter text-[#03045B] hover:bg-white'
          }
        />
      </div>
    </div>
  );
}
