'use client';

import { ChevronRight, Copy } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FundWallet() {
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
      <div className="flex flex-row items-center justify-between space-y-0 pb-7">
        <h1 className="font-inter text-2xl font-bold">Add Funds to Wallet</h1>
      </div>
      <div className="space-y-6">
        <p className="text-muted-foreground font-inter">
          This works like a regular bank account number. You can transfer to the account below and
          the funds will be credited to your wallet.
        </p>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-center font-inter text-sm">Bank Name:</p>
            <p className="font-inter font-semibold">{accountDetails.bankName}</p>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-center font-inter text-sm">Account Number:</p>
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded-md px-4 py-2 font-inter font-semibold">
                {accountDetails.accountNumber}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(accountDetails.accountNumber)}
                className="shrink-0"
              >
                <Copy className="size-4" />
                <span className="sr-only font-inter">Copy account number</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-center font-inter text-sm">Account Name:</p>
            <p className="font-inter font-semibold">{accountDetails.accountName}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
