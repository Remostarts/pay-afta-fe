'use client';

import { useEffect, useState } from 'react';

import AddSettlementForm from './AddSettlementForm';
import SuccessModal from './SuccessModal';

import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGeneral } from '@/context/generalProvider';
import { setDefaultBankAccount } from '@/lib/actions/onboarding/onboarding.actions';
import { toast } from 'sonner';

export default function SettlementAccount() {
  const { user, loadUserData } = useGeneral();

  const [toggleSettlementAcc, setToggleSettlementAcc] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  function handleSettlementAcc() {
    setToggleSettlementAcc(!toggleSettlementAcc);
  }

  function handleAddNew() {
    setShowAddDialog(true);
  }

  function handleCloseAddDialog() {
    setShowAddDialog(false);
  }

  function handleSuccess() {
    setShowAddDialog(false);
    setShowSuccess(true);
    loadUserData(); // refresh user data after adding
  }

  function handleCloseSuccess() {
    setShowSuccess(false);
  }

  const handleSetDefault = async (bankId: string) => {
    const confirm = window.confirm('Are you sure you want to set this account as default?');
    if (!confirm) return;

    try {
      const result = await setDefaultBankAccount(bankId);
      if (result.success) {
        toast.success('Default account updated successfully!');
        loadUserData();
      }
    } catch (error: any) {
      console.error('🔥 Default Account Error:', error);
      toast.error(error.message || 'Failed to set default account');
    }
  };

  // Sort: default first
  const sortedBanks = user?.Bank
    ? [...user.Bank].sort((a, b) => (b.setAsDefault ? 1 : 0) - (a.setAsDefault ? 1 : 0))
    : [];

  return (
    <div className="p-8">
      {/* Add Settlement Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="border-none bg-transparent p-0 shadow-none">
          <AddSettlementForm onClose={handleCloseAddDialog} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="border-none bg-transparent p-0 shadow-none">
          <SuccessModal onClose={handleCloseSuccess} />
        </DialogContent>
      </Dialog>

      <div className="">
        <div className="mb-8">
          <h3 className="mb-2 text-xl font-semibold">Default Escrow Payout</h3>
          <div className="flex items-center justify-between rounded-lg border bg-white p-6">
            <div>
              <div className="font-semibold">Settlement Account</div>
              <div className="text-sm text-gray-500">
                When turn on all escrow released payment will be sent to your settlement account
              </div>
            </div>
            <ReToggle checked={toggleSettlementAcc} onChange={handleSettlementAcc} />
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold">Saved Settlement Accounts</h4>
            <button
              disabled={!user}
              className="rounded-full bg-blue-900 px-6 py-2 font-semibold text-white"
              onClick={handleAddNew}
            >
              Add New
            </button>
          </div>

          <div className="space-y-4">
            {sortedBanks.map((info) => (
              <div
                key={info.id}
                className="flex items-center justify-between rounded-lg border-2 border-dashed bg-gray-50 p-6"
              >
                <div>
                  <div>{info.bankName}</div>
                  <div className="text-xl font-semibold">{info.accountNumber}</div>
                  <div>{info.accountHolder}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="text-gray-400">
                    <span role="img" aria-label="delete">
                      🗑️
                    </span>
                  </button>
                  {!info.setAsDefault && (
                    <button
                      className="text-xs text-blue-600 underline"
                      onClick={() => handleSetDefault(info.id)}
                    >
                      Set as Default
                    </button>
                  )}
                  {info.setAsDefault && (
                    <span className="text-xs text-gray-500">Default Account</span>
                  )}
                </div>
              </div>
            ))}
            {sortedBanks?.length===0&&<h1 className='text-center text-2xl border border-gray-400 rounded-md p-6'>You don't have settlement account, please create one.</h1>}
          </div>
        </div>
      </div>
    </div>
  );
}
