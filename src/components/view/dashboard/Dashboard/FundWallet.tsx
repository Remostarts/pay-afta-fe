'use client';

import { ChevronRight, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGeneral } from '@/context/generalProvider';

export default function FundWallet() {
  const { user } = useGeneral();
  const accountDetails = {
    bankName: 'STERLING BANK',
    accountNumber: '0099881122',
    accountName: 'Paul Simeon/STERLING BANK',
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
  };
  return (
    <section className="mx-auto w-full max-w-md">
      <div className="flex flex-row items-center justify-between space-y-0 pb-3">
        <h1 className="font-inter text-2xl font-bold text-gray-800">Add Funds to Wallet</h1>
      </div>
      <div className="space-y-2">
        <p className="text-muted-foreground font-inter text-gray-600">
          This works like a regular bank account number. You can transfer to the account below and
          the funds will be credited to your wallet.
        </p>

        <div className="mt-5 flex flex-col items-center justify-center space-y-6">
          <div className="">
            <p className="text-muted-foreground text-center font-inter text-sm">Bank Name:</p>
            <p className="font-inter font-semibold">{user?.Wallet[0]?.bankName}</p>
          </div>

          <div className="">
            <p className="text-muted-foreground text-center font-inter text-sm">Account Number:</p>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 p-1">
              <div className="bg-muted rounded-md px-4 py-2 font-inter font-semibold">
                {user?.Wallet[0]?.accountNumber}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(user?.Wallet[0]?.accountNumber as string)}
                className="shrink-0"
              >
                <Copy className="size-4" />
                <span className="sr-only font-inter">Copy account number</span>
              </Button>
            </div>
          </div>

          <div className="">
            <p className="text-muted-foreground text-center font-inter text-sm">Account Name:</p>
            <p className="font-inter font-semibold">{user?.Wallet[0]?.accountName}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
