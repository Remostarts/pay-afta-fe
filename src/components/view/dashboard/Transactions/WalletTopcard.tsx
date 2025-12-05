'use client';

import React from 'react';
import { ArrowUpRight, Lock, CheckCircle } from 'lucide-react';

interface SummaryRowProps {
  label: string;
  value: string;
}

const WalletTopcard: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BalanceCard variant="wallet">
          <p className="text-white text-sm">Wallet Balance</p>
          <p className="text-2xl font-semibold text-white">₦0</p>
        </BalanceCard>

        <BalanceCard variant="escrow">
          <p className="text-white text-sm">Escrow Balance</p>
          <p className="text-2xl font-semibold text-white">₦0</p>
        </BalanceCard>
      </div>

      {/* Summary + Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Wallet Summary */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Wallet Summary</h3>
          <SummaryRow label="Total Money In (30d)" value="₦0" />
          <SummaryRow label="Total Money Out (30d)" value="₦0" />
          <SummaryRow label="Pending Escrow Releases" value="₦0" />
          <SummaryRow label="Pending Withdrawals" value="₦0" />
        </Card>

        {/* Actions */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton label="Add Money" />
            <ActionButton label="Transcation" outline />
          </div>
        </Card>
      </div>

      {/* Recent Activity + Status Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem
              icon={<ArrowUpRight size={18} className="text-green-500" />}
              text="You funded your wallet ₦0"
            />
            <ActivityItem
              icon={<Lock size={18} className="text-gray-600" />}
              text="Escrow Hold Created for Order #1168 - ₦0"
            />
            <ActivityItem
              icon={<Lock size={18} className="text-gray-600" />}
              text="Escrow Fee Deducted - ₦0"
            />
            <ActivityItem
              icon={<CheckCircle size={18} className="text-green-600" />}
              text="Escrow Release Received - ₦0"
            />
          </div>
        </Card>

        {/* Wallet Health */}
        <Card>
          <h3 className="font-semibold text-lg mb-3">Wallet Health & Status</h3>
          <SummaryRow label="Account Status" value="Verified" />
          <SummaryRow label="Wallet Tier" value="Basic" />
          <SummaryRow label="Limits" value="₦0 / ₦1,000,000 daily" />
          <SummaryRow label="Last Activity" value="None yet" />
        </Card>
      </div>
    </div>
  );
};

export default WalletTopcard;

/* ---- Card Wrapper (for non-balance cards) ---- */
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border rounded-xl p-5 bg-white shadow-sm">{children}</div>
);

/* ---- Special Balance Card with Background Overlay ---- */
const BalanceCard: React.FC<{
  children: React.ReactNode;
  variant: 'wallet' | 'escrow';
}> = ({ children, variant }) => {
  const bgColor = variant === 'wallet' ? 'bg-[#03045B]' : 'bg-[#3A3DF8]';

  return (
    <div className={`relative overflow-hidden rounded-xl ${bgColor} p-5 sm:p-8 shadow-lg`}>
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-auto bg-repeat opacity-10"
          style={{
            backgroundImage: "url('/assets/dashboard/Dashboard/background-image.svg')",
          }}
        ></div>
      </div>

      {/* Content above background */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ---- Summary Row ---- */
const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
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
const ActionButton: React.FC<ActionButtonProps> = ({ label, disabled, outline, subtitle }) => (
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
    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
  </button>
);

/* ---- Activity Item ---- */
const ActivityItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm">
    {icon}
    <span className="text-gray-700">{text}</span>
  </div>
);
