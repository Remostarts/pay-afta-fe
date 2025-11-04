'use client';

import { useState } from 'react';

import AddSettlementForm from './AddSettlementForm';
import SuccessModal from './SuccessModal';

import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function SettlementAccount() {
  const [toggleSettlementAcc, setToggleSettlementAcc] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
  }

  function handleCloseSuccess() {
    setShowSuccess(false);
  }

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
          <h3 className="mb-2 font-inter text-xl font-medium">Default Escrow Payout</h3>
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
              className="rounded-full bg-blue-900 px-6 py-2 font-semibold text-white"
              onClick={handleAddNew}
            >
              Add New
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border-2 border-dashed bg-gray-50 p-6"
              >
                <div>
                  <div>Sterling Bank</div>
                  <div className="text-xl font-semibold">0011223344</div>
                  <div>Paul Falade</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="text-gray-400">
                    <span role="img" aria-label="delete">
                      🗑️
                    </span>
                  </button>
                  <span className="text-xs text-gray-500">
                    {i === 1 ? 'Default' : 'Set as Default'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
