/**
 * Local storage utility functions for user authentication
 * This helps track which user is logged in for transaction initiator/counterparty identification
 */

// Local storage key for storing user ID
const USER_ID_KEY = 'pay_afta_user_id';

/**
 * Store user ID in local storage after successful login/signup
 * @param userId - The authenticated user's ID
 */
export const setUserIdInLocalStorage = (userId: string): void => {
  if (typeof window !== 'undefined' && userId) {
    try {
      localStorage.setItem(USER_ID_KEY, userId);
      console.log('✅ User ID stored in local storage:', userId);
    } catch (error) {
      console.error('❌ Failed to store user ID in local storage:', error);
    }
  }
};

/**
 * Remove user ID from local storage on logout
 */
// export const removeUserIdFromLocalStorage = (): void => {
//   if (typeof window !== 'undefined') {
//     try {
//       localStorage.removeItem(USER_ID_KEY);
//       console.log('✅ User ID removed from local storage');
//     } catch (error) {
//       console.error('❌ Failed to remove user ID from local storage:', error);
//     }
//   }
// };

/**
 * Get current user ID from local storage
 * @returns Current user ID or null if not found
 */
export const getCurrentUserIdFromLocalStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const userId = localStorage.getItem(USER_ID_KEY);
      return userId;
    } catch (error) {
      console.error('❌ Failed to get user ID from local storage:', error);
      return null;
    }
  }
  return null;
};

/**
 * Check if a user is logged in by checking local storage
 * @returns boolean indicating if user is logged in
 */
export const isUserLoggedIn = (): boolean => {
  const userId = getCurrentUserIdFromLocalStorage();
  return !!userId;
};

/**
 * Clear all authentication-related data from local storage
 */
// export const clearAuthDataFromLocalStorage = (): void => {
//   removeUserIdFromLocalStorage();
//   // Note: NextAuth also manages its own session tokens in local storage
//   // We don't clear those as they are handled by NextAuth
// };
