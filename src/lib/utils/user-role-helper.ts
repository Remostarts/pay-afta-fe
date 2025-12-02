/**
 * User Role Helper Utility
 *
 * This utility demonstrates how to use the local storage user ID functions
 * to identify if the current user is the initiator or counterparty in a transaction.
 */

import { getCurrentUserIdFromLocalStorage } from './auth-local-storage';

interface Transaction {
  id: string;
  initiatorId: string;
  counterpartyId: string;
  initiatorRole: 'Buyer' | 'Seller';
  amount: number;
  status: string;
  // ... other transaction fields
}

/**
 * Determine the current user's role in a transaction
 * @param transaction - The transaction object containing initiator and counterparty IDs
 * @returns The role of the current user in the transaction, or null if not a participant
 */
export const getCurrentUserRoleInTransaction = (
  transaction: Transaction
): 'initiator' | 'counterparty' | null => {
  const currentUserId = getCurrentUserIdFromLocalStorage();

  if (!currentUserId) {
    console.log('No user ID found in local storage');
    return null;
  }

  if (transaction.initiatorId === currentUserId) {
    return 'initiator';
  }

  if (transaction.counterpartyId === currentUserId) {
    return 'counterparty';
  }

  return null;
};

/**
 * Check if current user is the initiator of a transaction
 * @param transaction - The transaction object
 * @returns true if current user is the initiator, false otherwise
 */
export const isCurrentUserInitiator = (transaction: Transaction): boolean => {
  const currentUserId = getCurrentUserIdFromLocalStorage();
  return currentUserId === transaction.initiatorId;
};

/**
 * Check if current user is the counterparty in a transaction
 * @param transaction - The transaction object
 * @returns true if current user is the counterparty, false otherwise
 */
export const isCurrentUserCounterparty = (transaction: Transaction): boolean => {
  const currentUserId = getCurrentUserIdFromLocalStorage();
  return currentUserId === transaction.counterpartyId;
};

/**
 * Get transaction participants with current user highlighted
 * @param transaction - The transaction object
 * @returns Object with participant information and current user role
 */
export const getTransactionParticipants = (transaction: Transaction) => {
  const currentUserId = getCurrentUserIdFromLocalStorage();
  const currentUserRole = getCurrentUserRoleInTransaction(transaction);

  return {
    initiator: {
      userId: transaction.initiatorId,
      role: transaction.initiatorRole,
      isCurrentUser: currentUserId === transaction.initiatorId,
    },
    counterparty: {
      userId: transaction.counterpartyId,
      role: transaction.initiatorRole === 'Buyer' ? 'Seller' : 'Buyer',
      isCurrentUser: currentUserId === transaction.counterpartyId,
    },
    currentUser: {
      role: currentUserRole,
      isParticipant: currentUserRole !== null,
    },
  };
};

/**
 * Filter transactions where current user is a participant
 * @param transactions - Array of transactions
 * @returns Filtered array of transactions where current user is either initiator or counterparty
 */
export const getTransactionsForCurrentUser = (transactions: Transaction[]): Transaction[] => {
  const currentUserId = getCurrentUserIdFromLocalStorage();

  if (!currentUserId) {
    return [];
  }

  return transactions.filter(
    (transaction) =>
      transaction.initiatorId === currentUserId || transaction.counterpartyId === currentUserId
  );
};

/**
 * Get count of transactions by role for current user
 * @param transactions - Array of transactions
 * @returns Object with counts for different transaction roles
 */
export const getTransactionCountsForCurrentUser = (transactions: Transaction[]) => {
  const userTransactions = getTransactionsForCurrentUser(transactions);

  return {
    total: userTransactions.length,
    asInitiator: userTransactions.filter(
      (t) => t.initiatorId === getCurrentUserIdFromLocalStorage()
    ).length,
    asCounterparty: userTransactions.filter(
      (t) => t.counterpartyId === getCurrentUserIdFromLocalStorage()
    ).length,
  };
};
