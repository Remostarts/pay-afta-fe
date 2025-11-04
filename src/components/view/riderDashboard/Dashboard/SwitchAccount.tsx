import React from 'react';

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
    className={`flex justify-between w-full items-center p-4 mb-2 border rounded-lg transition-colors ${
      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
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
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts[0]?.accountNumber || ''
  );

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
            onSelect={() => handleAccountSelect(account)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full font-inter text-gray-700 "
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmSelection}
          className="flex-1 px-4 py-2 bg-[#03045B] text-white font-inter rounded-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SwitchAccount;
