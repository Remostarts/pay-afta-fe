import Image from 'next/image';

import FundWallet from './FundWallet';
import WithdrawFund from './WithdrawFund';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock data for stats
const stats = [
  {
    title: 'Fund Wallet',
    icon: '/assets/dashboard/Dashboard/Card.svg',
    FormComponent: FundWallet,
  },
  {
    title: 'New Order',
    icon: '/assets/dashboard/Dashboard/track-order.svg',
    FormComponent: null,
  },
  {
    title: 'Withdraw Fund',
    icon: '/assets/dashboard/Dashboard/withdraw-fund.svg',
    FormComponent: WithdrawFund,
  },
];

export default function WalletServices() {
  return (
    <div className="mt-8 rounded-lg bg-white p-2 shadow">
      <h1 className="pl-10 font-inter text-xl font-semibold text-gray-800">Wallet services</h1>
      <div className="mt-5 grid lg:grid-cols-3">
        {stats?.map((stat, index) => {
          const FormComponent = stat.FormComponent; // Fixed component reference
          return (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div className="mt-2 cursor-pointer border-r bg-white p-8 hover:bg-gray-50">
                  <div>
                    <Image src={stat.icon} alt={stat.title} width={40} height={40} />
                  </div>
                  <div>
                    <p className="font-inter text-lg font-semibold text-gray-700">{stat.title}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                {FormComponent && <FormComponent />}
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
