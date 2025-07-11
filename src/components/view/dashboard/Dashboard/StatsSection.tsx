// import { stat } from 'fs';

import Image from 'next/image';
import { Plus } from 'lucide-react';

import FundWallet from './FundWallet';
import WithdrawFund from './WithdrawFund';

import { useGeneral } from '@/context/generalProvider';
import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

// Mock data for stats
const stats = [
  {
    title: 'Wallet Balance',
    value: '9,000,000.00',
    //   backgroundColor: 'bg-[#03045B]',
  },
  {
    title: 'Escrow Balance',
    value: '10,000',
    //   backgroundColor: 'bg-[#3A3DF8]',
  },
  {
    title: 'Card Balance',
    value: '10,000',
    //   backgroundColor: 'bg-[white]',
  },
];
export default function StatsSection() {
  const { user } = useGeneral();
  return (
    <div className="mt-5 grid lg:grid-cols-2">
      <div className={`ml-2 mt-2 rounded-lg border bg-white p-8`}>
        {/* <div><Image src={stat?.icon} alt={stat?.title} width={40} height={40} /></div> */}
        <div className="items-center justify-between sm:flex">
          <div>
            <p className="font-inter text-sm text-gray-600">Wallet Balance</p>
            <p className="font-inter text-lg font-semibold">₦ {user?.walletBalance}</p>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 rounded-full bg-slate-500 px-9 py-1 text-center font-inter text-[#03045B]">
                  Transfer
                  <Image
                    alt="transfer"
                    src="/assets/dashboard/Dashboard/transfer.svg"
                    width={20}
                    height={20}
                  />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <WithdrawFund />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 rounded-full bg-[#3A3DF8] px-5 py-1 text-center font-inter text-white">
                  Add Fund
                  <Plus width={20} height={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <FundWallet />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className={`ml-2 mt-2 rounded-lg border bg-white p-8`}>
        {/* <div><Image src={stat?.icon} alt={stat?.title} width={40} height={40} /></div> */}
        <div>
          <p className="font-inter text-sm text-gray-600">Escrow Balance</p>
          <p className="font-inter text-lg font-semibold">₦ {user?.escrowBalance}</p>
        </div>
      </div>
    </div>
  );
}
