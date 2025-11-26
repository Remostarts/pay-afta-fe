import React from 'react';
import { useRouter } from 'next/navigation';

interface AccountProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

interface SwitchAccountProps {
  accounts: AccountProps[];
  onClose: () => void;
  onAccountSelect: (account: AccountProps) => void;
}

const AccountItem: React.FC<AccountProps> = ({
  bankName,
  accountNumber,
  accountName,
  isSelected,
  onSelect,
}) => (
  <button
    onClick={onSelect}
    disabled={!onSelect}
    className={`flex justify-between w-full items-center p-4 mb-2 border rounded-lg transition-colors ${
      isSelected
        ? 'border-green-500 bg-green-50'
        : onSelect
          ? 'border-gray-200 hover:bg-gray-50'
          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
    }`}
  >
    <div className="space-y-1">
      <p className="text-sm text-gray-500">{bankName}</p>
      <p className="text-lg font-semibold">{accountNumber}</p>
      <p className="text-sm text-gray-500">{accountName}</p>
    </div>
    <div className="relative">
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
        }`}
      >
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  </button>
);

const SwitchAccount: React.FC<SwitchAccountProps> = ({ accounts, onClose, onAccountSelect }) => {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0]?.accountNumber || ''
  );

  // Check if no accounts are present
  const hasNoAccounts = accounts.length === 0;
  // Check if only one account is present (disable switch in this case)
  const hasSingleAccount = accounts.length === 1;

  const handleAccountSelect = (account: AccountProps) => {
    setSelectedAccount(account.accountNumber);
    // Don't immediately call onAccountSelect - just update local state
  };

  const handleConfirmSelection = () => {
    const selectedAccountData = accounts.find(
      (account) => account.accountNumber === selectedAccount
    );
    if (selectedAccountData) {
      onAccountSelect(selectedAccountData);
    }
  };

  const handleNavigateToSettings = () => {
    router.push('/dashboard/settings');
  };

  // If no accounts are present, show navigation UI to settings
  if (hasNoAccounts) {
    return (
      <div className="w-full max-w-md bg-white py-5 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Switch Account</h2>
        </div>

        <div className="text-center py-8">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">No Settlement Account Found</h3>
          <p className="text-sm text-gray-500 mb-6">
            You need to set up a settlement account before you can proceed with withdrawals.
          </p>

          <button
            onClick={handleNavigateToSettings}
            className="w-full px-4 py-2 bg-[#03045B] text-white font-inter rounded-full hover:bg-blue-900 transition-colors"
          >
            Set Up Settlement Account
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-full font-inter text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white py-5 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Switch Account</h2>
        {/* <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          ✕
        </button> */}
      </div>

      <h3 className="text-base font-medium text-gray-700 mb-4">Saved Accounts</h3>

      <div className="space-y-2 mb-6">
        {accounts.map((account) => (
          <AccountItem
            key={account.accountNumber}
            {...account}
            isSelected={selectedAccount === account.accountNumber}
            onSelect={hasSingleAccount ? undefined : () => handleAccountSelect(account)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full font-inter text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmSelection}
          disabled={hasSingleAccount}
          className={`flex-1 px-4 py-2 font-inter rounded-full transition-colors ${
            hasSingleAccount
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#03045B] text-white hover:bg-blue-900'
          }`}
        >
          {hasSingleAccount ? 'Only One Account' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default SwitchAccount;
