import React from 'react';

export interface AccountProps {
  bankName: string;
  bankCode: string;
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
    className={`flex justify-between items-center p-4 mb-2 border rounded-lg w-full transition-colors ${
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
        className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}
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
  const [selectedAccountNumber, setSelectedAccountNumber] = React.useState(
    accounts[0]?.accountNumber || ''
  );

  const handleAccountSelect = (account: AccountProps) => {
    setSelectedAccountNumber(account.accountNumber);
  };

  const handleConfirmSelection = () => {
    const account = accounts.find((acc) => acc.accountNumber === selectedAccountNumber);
    if (account) onAccountSelect(account);
  };

  return (
    <div className="w-full max-w-md bg-white py-5 rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Switch Account</h2>
      {accounts.map((account) => (
        <AccountItem
          key={account.accountNumber}
          {...account}
          isSelected={selectedAccountNumber === account.accountNumber}
          onSelect={() => handleAccountSelect(account)}
        />
      ))}
      <div className="flex gap-3 mt-4">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full font-inter text-gray-700"
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
