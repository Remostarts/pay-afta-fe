'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ServiceFee {
  transactionName: string;
  feeType: string;
  minimumAmount: string;
  maximumAmount: string;
  amount: string;
  currency: string;
}

interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: string;
  effectiveDate: string;
  autoUpdateRate: boolean;
}

interface StampDuty {
  threshold: string;
  dutyAmount: string;
  currency: string;
  appliedTo: string;
}

interface VAT {
  taxType: string;
  rate: string;
  appliedTo: string;
}

export default function FeeAndRate() {
  const [serviceFee, setServiceFee] = useState<ServiceFee>({
    transactionName: '',
    feeType: '',
    minimumAmount: '0.00',
    maximumAmount: '',
    amount: '',
    currency: '',
  });

  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    fromCurrency: 'NGN',
    toCurrency: 'USD',
    exchangeRate: '1 USD = 1530 NGN',
    effectiveDate: '02/09/2025',
    autoUpdateRate: true,
  });

  const [stampDuty, setStampDuty] = useState<StampDuty>({
    threshold: '₦10,000+',
    dutyAmount: '₦50',
    currency: 'NGN',
    appliedTo: 'Transfer',
  });

  const [vat, setVAT] = useState<VAT>({
    taxType: 'VAT',
    rate: '7.5%',
    appliedTo: 'Specific Service',
  });

  const handleSaveServiceFee = () => {
    console.log('Saving Service Fee:', serviceFee);
  };

  const handleSaveExchangeRate = () => {
    console.log('Saving Exchange Rate:', exchangeRate);
  };

  const handleSaveStampDuty = () => {
    console.log('Saving Stamp Duty:', stampDuty);
  };

  const handleSaveVAT = () => {
    console.log('Saving VAT:', vat);
  };

  return (
    <div className="space-y-6">
      {/* Service Fee Section */}
      <Card className="w-full bg-white">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-800">Service Fee</CardTitle>
            <Button className="bg-[#1F7EAD] text-white" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Service Fee
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                TRANSACTION NAME
              </Label>
              <Select
                value={serviceFee.transactionName}
                onValueChange={(value) =>
                  setServiceFee((prev) => ({ ...prev, transactionName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Name" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="airtime">AirTime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                FEE TYPE
              </Label>
              <Select
                value={serviceFee.feeType}
                onValueChange={(value) => setServiceFee((prev) => ({ ...prev, feeType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Flat / Percentage" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                MINIMUM AMOUNT
              </Label>
              <Input
                value={serviceFee.minimumAmount}
                onChange={(e) =>
                  setServiceFee((prev) => ({ ...prev, minimumAmount: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                MAXIMUM AMOUNT
              </Label>
              <Input
                value={serviceFee.maximumAmount}
                onChange={(e) =>
                  setServiceFee((prev) => ({ ...prev, maximumAmount: e.target.value }))
                }
                placeholder="-------"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                AMOUNT
              </Label>
              <Input
                value={serviceFee.amount}
                onChange={(e) => setServiceFee((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="₦500 or 1.5%"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                CURRENCY
              </Label>
              <Select
                value={serviceFee.currency}
                onValueChange={(value) => setServiceFee((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveServiceFee}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8 rounded-full"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FX Exchange Rate Section */}
      <Card className="w-full bg-white">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-800">FX Exchange Rate</CardTitle>
            <Button className="bg-[#1F7EAD] text-white" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Exchange Rate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                FROM CURRENCY
              </Label>
              <Select
                value={exchangeRate.fromCurrency}
                onValueChange={(value) =>
                  setExchangeRate((prev) => ({ ...prev, fromCurrency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                TO CURRENCY
              </Label>
              <Select
                value={exchangeRate.toCurrency}
                onValueChange={(value) =>
                  setExchangeRate((prev) => ({ ...prev, toCurrency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                EXCHANGE RATE
              </Label>
              <Input
                value={exchangeRate.exchangeRate}
                onChange={(e) =>
                  setExchangeRate((prev) => ({ ...prev, exchangeRate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                EFFECTIVE DATE
              </Label>
              <Input
                type="date"
                value={exchangeRate.effectiveDate}
                onChange={(e) =>
                  setExchangeRate((prev) => ({ ...prev, effectiveDate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                AUTO-UPDATE RATE
              </Label>
              <div className="flex items-center pt-2">
                <Switch
                  checked={exchangeRate.autoUpdateRate}
                  onCheckedChange={(checked) =>
                    setExchangeRate((prev) => ({ ...prev, autoUpdateRate: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveExchangeRate}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8 rounded-full"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stamp Duty Section */}
      <Card className="w-full bg-white">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-800">Stamp Duty</CardTitle>
            <Button className="bg-[#1F7EAD] text-white" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Stamp Duty
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                THRESHOLD
              </Label>
              <Input
                value={stampDuty.threshold}
                onChange={(e) => setStampDuty((prev) => ({ ...prev, threshold: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                DUTY AMOUNT
              </Label>
              <Input
                value={stampDuty.dutyAmount}
                onChange={(e) => setStampDuty((prev) => ({ ...prev, dutyAmount: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                CURRENCY
              </Label>
              <Select
                value={stampDuty.currency}
                onValueChange={(value) => setStampDuty((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                APPLIED TO
              </Label>
              <Select
                value={stampDuty.appliedTo}
                onValueChange={(value) => setStampDuty((prev) => ({ ...prev, appliedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveStampDuty}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8 rounded-full"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Value Added Tax (VAT) Section */}
      <Card className="w-full bg-white">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-800">
              Value Added Tax (VAT)
            </CardTitle>
            <Button className="bg-[#1F7EAD] text-white" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add (VAT)
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                TAX TYPE
              </Label>
              <Input
                value={vat.taxType}
                onChange={(e) => setVAT((prev) => ({ ...prev, taxType: e.target.value }))}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                RATE (%)
              </Label>
              <Input
                value={vat.rate}
                onChange={(e) => setVAT((prev) => ({ ...prev, rate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                APPLIED TO
              </Label>
              <Select
                value={vat.appliedTo}
                onValueChange={(value) => setVAT((prev) => ({ ...prev, appliedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Specific Service">Specific Service</SelectItem>
                  <SelectItem value="All Services">All Services</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveVAT}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8 rounded-full"
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
