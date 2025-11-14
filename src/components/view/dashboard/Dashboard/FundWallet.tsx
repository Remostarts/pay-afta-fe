  'use client';

  import { useState } from 'react';
  import { Copy, Check } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { useGeneral } from '@/context/generalProvider';

  export default function FundWallet() {
    const { user } = useGeneral();
    const [copied, setCopied] = useState(false);

    const accountDetails = {
      bankName: user?.Wallet?.[0]?.bankName || 'N/A',
      accountNumber: user?.Wallet?.[0]?.accountNumber || 'N/A',
      accountName: user?.Wallet?.[0]?.accountName || 'N/A',
    };

    const copyToClipboard = (text: string): void => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);  
    };

    return (
      <section className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h1 className="font-inter text-xl font-bold text-gray-900">Add Funds to Wallet</h1>
        </div>

        {/* Subtext */}
        <p className="mt-1 font-inter text-sm text-gray-600 leading-relaxed">
          This works like a regular bank account number. You can transfer to the account below and the
          funds will be credited to your wallet.
        </p>

        {/* Account Info Card */}
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-inter text-sm text-gray-500">Bank Name:</p>
            <p className="font-inter text-sm font-semibold text-gray-800">
              {accountDetails.bankName}
            </p>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <p className="font-inter text-sm text-gray-500">Account Number:</p>
            <div className="flex items-center space-x-2">
              <p className="font-inter text-sm font-semibold text-gray-800">
                {accountDetails.accountNumber}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(accountDetails.accountNumber)}
                className="h-6 w-6 text-[#03045B] hover:bg-transparent"
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                <span className="sr-only">Copy account number</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-inter text-sm text-gray-500">Account Name:</p>
            <p className="font-inter text-sm font-semibold text-gray-900">
              {accountDetails.accountName}
            </p>
          </div>
        </div>
      </section>
    );
  }
