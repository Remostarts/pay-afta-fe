import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import FundWallet from './FundWallet';
import WithdrawFund from './WithdrawFund';
import NewOrder from './NewOrder';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface WalletServicesProps {
  setShowNewOrder: Dispatch<SetStateAction<boolean>>;
}

const stats = [
  {
    title: 'Fund Wallet',
    icon: '/assets/dashboard/Dashboard/Card.svg',
    FormComponent: FundWallet,
    useDialog: true,
  },
  {
    title: 'New Order',
    icon: '/assets/dashboard/Dashboard/track-order.svg',
    FormComponent: NewOrder,
    useDialog: false,
  },
  {
    title: 'Withdraw Fund',
    icon: '/assets/dashboard/Dashboard/withdraw-fund.svg',
    FormComponent: WithdrawFund,
    useDialog: true,
  },
];

export default function WalletServices({ setShowNewOrder }: WalletServicesProps) {
  const handleClick = (stat: any) => {
    if (!stat?.useDialog && stat?.title === 'New Order') {
      setShowNewOrder(true);
    }
  };

  return (
    <div className="mt-8 rounded-lg bg-white p-2 shadow">
      <h1 className="pl-10 font-inter text-xl font-semibold text-gray-800">Wallet services</h1>
      <div className="mt-5 grid lg:grid-cols-3">
        {stats?.map((stat, index) => {
          const FormComponent = stat.FormComponent;

          if (!stat.useDialog) {
            return (
              <button
                key={index}
                onClick={() => handleClick(stat)}
                className="relative cursor-pointer border-r bg-white p-8 hover:bg-gray-50"
              >
                <div>
                  <Image src={stat.icon} alt={stat.title} width={40} height={40} />
                </div>
                {/* <div> */}
                <p className="absolute left-8 font-inter text-lg font-semibold text-gray-700">
                  {stat.title}
                </p>
                {/* </div> */}
              </button>
            );
          }

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
