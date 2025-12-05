'use client';

import { useEffect, useState } from 'react';
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
import { Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { TCreateFeeRate } from '@/lib/validations/fee.validation';
import { useChats } from '@/context/ChatListProvider';

interface ServiceFee {
  transactionType: string;
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
  const { session } = useChats();
  const [serviceFee, setServiceFee] = useState<ServiceFee>({
    transactionType: '',
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

  const [serviceFeeList, setServiceFeeList] = useState<ServiceFee[]>([]);

  // Fetch service fee list from backend
  const fetchServiceFees = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fee/list`, {
        headers: {
          authorization: session?.accessToken as string,
        },
      });
      const result = await res.json();
      if (result.success && result.data?.data) {
        setServiceFeeList(result.data.data);
      } else {
        toast.error(result.message || 'Failed to fetch service fees');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch service fees');
    }
  };

  useEffect(() => {
    fetchServiceFees();
  }, []);

  const handleSaveServiceFee = async () => {
    try {
      if (!serviceFee.transactionType) {
        toast.error('Please select a transaction type');
        return;
      }
      if (!serviceFee.feeType) {
        toast.error('Please select a fee type');
        return;
      }
      if (!serviceFee.amount || Number(serviceFee.amount) <= 0) {
        toast.error('Amount must be greater than 0');
        return;
      }
      if (!serviceFee.currency) {
        toast.error('Amount must be greater than 0');
        return;
      }
      const payload: TCreateFeeRate = {
        title: `${serviceFee.transactionType} fee`,
        transactionType: serviceFee.transactionType as
          | 'invoice'
          | 'transfer'
          | 'payment'
          | 'withdrawal'
          | 'airtime',
        feeType: serviceFee.feeType as 'flat' | 'percentage',
        value: Number(serviceFee.amount),
        minAmount: Number(serviceFee.minimumAmount) || 0,
        maxAmount: serviceFee.maximumAmount ? Number(serviceFee.maximumAmount) : undefined,
        isActive: true,
        country: undefined,
        currencyCode: serviceFee.currency || 'NGN',
        currencySymbol: serviceFee.currency || '₦',
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fee/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: session?.accessToken as string,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      console.log('🌼 🔥🔥 handleSaveServiceFee 🔥🔥 result🌼', result);

      if (result.success) {
        toast.success(result.message || 'Fee created successfully!');
        // Reset form
        setServiceFee({
          transactionType: '',
          feeType: '',
          minimumAmount: '0.00',
          maximumAmount: '',
          amount: '',
          currency: '',
        });
        fetchServiceFees(); 
      } else {
        toast.error(result.message || 'Failed to create fee!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create fee!');
    }
  };
  const handleDeleteFee = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this fee?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fee/${id}`, {
        method: 'DELETE',
        headers: {
          authorization: session?.accessToken as string,
        },
      });
      const result = await res.json();

      if (result.success) {
        toast.success('Fee deleted successfully!');
        fetchServiceFees();  
      } else {
        toast.error(result.message || 'Failed to delete fee');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete fee');
    }
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
                value={serviceFee.transactionType}
                onValueChange={(value) =>
                  setServiceFee((prev) => ({ ...prev, transactionType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Name" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="invoice">Invoice</SelectItem>
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
          <div className="space-y-2">
            {serviceFeeList.map((fee: any) => (
              <Card key={fee.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{fee.title}</p>
                  <p className="text-sm text-gray-500">
                    {fee.transactionType} | {fee.feeType} | {fee.currency} {fee.value}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => fee.id && handleDeleteFee(fee.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </Card>
            ))}
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
