import Image from 'next/image';
import { Plus, SendHorizontal } from 'lucide-react';

import FundWallet from './FundWallet';
import WithdrawFund from './WithdrawFund';

import { useGeneral } from '@/context/generalProvider';
import { ReButton } from '@/components/re-ui/ReButton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function StatsSection() {
  const { user } = useGeneral();

  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {/* Wallet Balance Card */}
      <div className="relative ml-2 mt-2 overflow-hidden rounded-xl bg-[#03045B] p-8 shadow-lg">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-auto bg-repeat opacity-10"
            style={{
              backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 items-center justify-between sm:flex">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="font-inter text-sm text-[#FFFFFF]">Wallet Balance</p>
              {/* <div className="rounded-full bg-white/20 p-1">
                <div className="size-2 rounded-full bg-white"></div>
              </div> */}
            </div>
            <p className="font-inter text-2xl font-bold text-white">
              ₦{user?.walletBalance || '0.00'}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-3 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 rounded-full bg-white px-6 py-2 text-center font-inter font-semibold text-[#03045B]">
                  Transfer
                  {/* <Image
                    alt="transfer"
                    src="/assets/dashboard/Dashboard/transfer.svg"
                    width={16}
                    height={16}
                    className="brightness-0 invert"
                  /> */}
                  <SendHorizontal width={20} height={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <WithdrawFund />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 rounded-full bg-[#3A3DF8] px-5 py-2 text-center font-inter font-semibold text-white shadow-lg">
                  Add Fund
                  <Plus width={16} height={16} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <FundWallet />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Escrow Balance Card */}
      <div className="relative ml-2 mt-2 overflow-hidden rounded-xl bg-[#3A3DF8] p-8 shadow-lg">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-auto bg-repeat opacity-10"
            style={{
              backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <p className="font-inter text-sm text-[#FFFFFF]">Escrow Balance</p>
            {/* <div className="rounded-full bg-white/20 p-1">
              <div className="size-2 rounded-full bg-white"></div>
            </div> */}
          </div>
          <p className="font-inter text-2xl font-bold text-white">
            ₦{user?.escrowBalance || '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
}
