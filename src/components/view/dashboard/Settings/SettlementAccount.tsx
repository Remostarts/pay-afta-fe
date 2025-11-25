'use client';

import { useEffect, useState } from 'react';

import AddSettlementForm from './AddSettlementForm';
import SuccessModal from './SuccessModal';

import { ReToggle } from '@/components/re-ui/re-toggle/ReToggle';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGeneral } from '@/context/generalProvider';
import {
  setDefaultBankAccount,
  deleteBankAccount,
} from '@/lib/actions/onboarding/onboarding.actions';
import { toast } from 'sonner';

export default function SettlementAccount() {
  const { user, loadUserData } = useGeneral();

  const [toggleSettlementAcc, setToggleSettlementAcc] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Delete functionality states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default account functionality states
  const [showDefaultDialog, setShowDefaultDialog] = useState(false);
  const [accountToSetDefault, setAccountToSetDefault] = useState<string | null>(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

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

  // Delete functionality handlers
  const handleDeleteClick = (accountId: string) => {
    setAccountToDelete(accountId);
    setShowDeleteDialog(true);
  };

  const handleDeleteCancel = () => {
    setAccountToDelete(null);
    setShowDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteBankAccount(accountToDelete);
      if (result.success) {
        toast.success('Bank account deleted successfully!');
        loadUserData(); // Refresh user data after deletion
        setShowDeleteDialog(false);
        setAccountToDelete(null);
      }
    } catch (error: any) {
      console.error('🔥 Delete Account Error:', error);
      toast.error(error.message || 'Failed to delete bank account');
    } finally {
      setIsDeleting(false);
    }
  };

  // Default account functionality handlers
  const handleSetDefaultClick = (accountId: string) => {
    setAccountToSetDefault(accountId);
    setShowDefaultDialog(true);
  };

  const handleSetDefaultCancel = () => {
    setAccountToSetDefault(null);
    setShowDefaultDialog(false);
  };

  const handleSetDefaultConfirm = async () => {
    if (!accountToSetDefault) return;

    setIsSettingDefault(true);
    try {
      const result = await setDefaultBankAccount(accountToSetDefault);
      if (result.success) {
        toast.success('Default account updated successfully!');
        loadUserData(); // Refresh user data after update
        setShowDefaultDialog(false);
        setAccountToSetDefault(null);
      }
    } catch (error: any) {
      console.error('🔥 Default Account Error:', error);
      toast.error(error.message || 'Failed to set default account');
    } finally {
      setIsSettingDefault(false);
    }
  };

  // Sort: default first
  const sortedBanks = user?.Bank
    ? [...user.Bank].sort((a, b) => (b.setAsDefault ? 1 : 0) - (a.setAsDefault ? 1 : 0))
    : [];

  return (
    <div className="md:p-8">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Account Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this settlement account? This action cannot be undone.
              Any pending transactions to this account will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Set Default Confirmation Dialog */}
      <AlertDialog open={showDefaultDialog} onOpenChange={setShowDefaultDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Set Default Settlement Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to set this account as your default settlement account? All
              future escrow payments will be directed to this account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSetDefaultCancel} disabled={isSettingDefault}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSetDefaultConfirm}
              disabled={isSettingDefault}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            >
              {isSettingDefault ? 'Setting Default...' : 'Set as Default'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="">
        <div className="mb-8">
          <h3 className="mb-2 text-xl font-semibold font-inter">Default Escrow Payout</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border bg-white p-4 sm:p-6 gap-4 sm:gap-0">
            <div className="flex-1">
              <h1 className="font-semibold font-inter text-base sm:text-lg">Settlement Account</h1>
              <span className="text-xs sm:text-sm text-gray-500 font-inter block mt-1">
                When turned on, all escrow released payments will be sent to your settlement account
              </span>
            </div>
            <div className="self-start sm:self-auto">
              <ReToggle checked={toggleSettlementAcc} onChange={handleSettlementAcc} />
            </div>
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
                className={`relative flex items-center justify-between rounded-lg border-2 p-6 transition-all ${
                  info.setAsDefault
                    ? 'border-green-200 bg-green-50 shadow-md'
                    : 'border-dashed bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {/* Default Account Badge */}
                {info.setAsDefault && (
                  <div className="absolute -top-2 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    DEFAULT
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{info.bankName}</h3>
                    {info.setAsDefault && (
                      <span className="text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-bold text-gray-800 mt-1">{info.accountNumber}</div>
                  <div className="text-sm text-gray-600">{info.accountHolder}</div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(info.id)}
                      disabled={isDeleting || isSettingDefault}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded"
                      title="Delete account"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    {/* Set Default Button or Status */}
                    {!info.setAsDefault ? (
                      <button
                        onClick={() => handleSetDefaultClick(info.id)}
                        disabled={isDeleting || isSettingDefault}
                        className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded-full transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Set as Default
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Default Account
                      </div>
                    )}
                  </div>

                  {/* Account Status Info */}
                  <div className="text-right">
                    {info.setAsDefault ? (
                      <p className="text-xs text-green-600 font-medium">
                        This account receives all escrow payments
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Click "Set as Default" to make this your primary account
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {sortedBanks?.length === 0 && (
              <h1 className="text-center text-2xl border border-gray-400 rounded-md p-6">
                You don't have settlement account, please create one.
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
