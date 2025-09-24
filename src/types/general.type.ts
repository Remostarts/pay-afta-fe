type Profile = {
  address: string | null;
  city: string | null;
  state: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  studentCategory: string | null;
  universityAttended: string | null;
  yearOfGraduation: number | null;
  nigeriaLawSchoolCurrentlyAt: string | null;
  onBoardingStatus: boolean;
  personalKycStatus: boolean;
  settlementKycStatus: boolean;
  pinSet: boolean;
};

type WalletItem = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  walletId: string;
  balance: number;
};

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: 'user' | 'admin' | 'logistic';
  profileImage: string | null;
  coverImage: string | null;
  profile: Profile | null;
  escrowBalance: number;
  Wallet: WalletItem[];
};
