'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Lock, CheckCircle, Plus, SendHorizontal } from 'lucide-react';
import { getUserProfileSummary } from '@/lib/actions/root/user.action';
import { useGeneral } from '@/context/generalProvider';
import WithdrawFund from '../Dashboard/WithdrawFund';
import FundWallet from '../Dashboard/FundWallet';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface SummaryRowProps {
  label: string;
  value: string | number;
}

const WalletTopcard: React.FC = () => {
  const { user } = useGeneral();
  const [data, setData] = useState<any>(null);
  console.log('🌼 🔥🔥 WalletTopcard 🔥🔥 data🌼', data);

  const [loading, setLoading] = useState(true);

  async function handleProfileSummary() {
    try {
      setLoading(true);
      const res = await getUserProfileSummary();
      setData(res.data);
    } catch (error) {
      console.error('Error loading profile summary:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleProfileSummary();
  }, []);

  if (loading) return <p className="text-center py-10">Loading wallet summary...</p>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BalanceCard variant="wallet">
          <p className="text-white text-sm">Wallet Balance</p>
          <p className="text-2xl font-semibold text-white">₦{user?.Wallet[0].balance}</p>
        </BalanceCard>

        <BalanceCard variant="escrow">
          <p className="text-white text-sm">Escrow Balance</p>
          <p className="text-2xl font-semibold text-white">₦{user?.escrowBalance}</p>
        </BalanceCard>
      </div>

      {/* Summary + Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Wallet Summary */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Wallet Summary</h3>
          <SummaryRow
            label="Total Money In (30d)"
            value={`₦${data?.walletSummary?.totalMoneyIn ?? 0}`}
          />
          <SummaryRow
            label="Total Money Out (30d)"
            value={`₦${data?.walletSummary?.totalMoneyOut ?? 0}`}
          />
          <SummaryRow
            label="Pending Escrow Releases"
            value={`₦${data?.walletSummary?.pendingEscrowReleases ?? 0}`}
          />
          <SummaryRow
            label="Pending Withdrawals"
            value={`₦${data?.walletSummary?.pendingWithdrawals ?? 0}`}
          />
        </Card>

        {/* Actions */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-3">
            <ActionDialogButton
              label="Transfer"
              outline
              disabled={!((user?.Wallet?.[0]?.balance ?? 0) > 0)}
            >
              <WithdrawFund />
            </ActionDialogButton>

            <ActionDialogButton label="Add Money">
              <FundWallet />
            </ActionDialogButton>
          </div>
        </Card>
      </div>

      {/* Recent Activity + Wallet Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
          {data?.recentActivity?.length ? (
            <div className="space-y-3">
              {data.recentActivity.map((item: any, idx: number) => (
                <ActivityItem
                  key={idx}
                  icon={
                    item.type === 'success' ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : item.type === 'fund' ? (
                      <ArrowUpRight size={18} className="text-green-500" />
                    ) : (
                      <Lock size={18} className="text-gray-600" />
                    )
                  }
                  text={item.text}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </Card>

        {/* Wallet Health */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Wallet Health & Status</h3>
          <SummaryRow
            label="Account Status"
            value={data?.walletHealth?.accountStatus ?? 'Unknown'}
          />
          <SummaryRow label="Wallet Tier" value={data?.walletHealth?.walletTier ?? 'Unknown'} />
          <SummaryRow label="Limits" value={data?.walletHealth?.limits ?? '₦0 / ₦0 daily'} />
          <SummaryRow
            label="Last Activity"
            value={data?.walletHealth?.lastActivity ?? 'None yet'}
          />
        </Card>
      </div>
    </div>
  );
};

export default WalletTopcard;

/* ---- Card Wrapper ---- */
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border rounded-xl p-5 bg-white shadow-sm">{children}</div>
);

/* ---- Balance Card ---- */
const BalanceCard: React.FC<{ children: React.ReactNode; variant: 'wallet' | 'escrow' }> = ({
  children,
  variant,
}) => {
  const bgColor = variant === 'wallet' ? 'bg-[#03045B]' : 'bg-[#3A3DF8]';

  return (
    <div className={`relative overflow-hidden rounded-xl ${bgColor} p-5 sm:p-8 shadow-lg`}>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-auto bg-repeat opacity-10"
          style={{ backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ---- Summary Row ---- */
const SummaryRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

/* ---- Action Button ---- */
interface ActionButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  subtitle?: string;
}
/* ---- Action Dialog Button ---- */
const ActionDialogButton: React.FC<{
  label: string;
  outline?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ label, outline, disabled, children }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        disabled={disabled}
        className={`w-full rounded-lg p-3 text-sm font-medium border transition
        ${
          disabled
            ? 'opacity-40 cursor-not-allowed'
            : outline
              ? 'border border-gray-400 hover:bg-gray-50'
              : 'bg-[#03045B] text-white'
        }`}
      >
        {label}
      </button>
    </DialogTrigger>

    <DialogContent className="sm:max-w-[425px]">{children}</DialogContent>
  </Dialog>
);

/* ---- Activity Item ---- */
const ActivityItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm">
    {icon}
    <span className="text-gray-700">{text}</span>
  </div>
);
