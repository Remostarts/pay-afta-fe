type Profile = {
  address: string | null;
  city: string | null;
  state: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  studentCategory: string | null;
  universityAttended: string | null;
  yearOfGraduation: number | null;
  nigeriaLawSchoolCurrentlyAt: string | null;
  onBoardingStatus: boolean;
  identityVerified: boolean;
  personalKycStatus: boolean;
  settlementKycStatus: boolean;
  pinSet: boolean;
};

export type Transaction = {
  id: string;
  type: 'WITHDRAWAL' | 'DEPOSIT' | 'CREDIT' | string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | string;
  reference: string;
  createdAt: string;
};

type WalletItem = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  walletId: string;
  balance: number;
  transactions: Transaction[];
};

type BankItem = {
  id: string;
  accountHolder: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  setAsDefault: boolean;
};

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  emailNotification: boolean;
  textNotification: boolean;
  email: string;
  phone: string | null;
  username: string | null;
  role: 'user' | 'admin' | 'logistic';
  profileImage: string | null;
  profile: Profile | null;
  escrowBalance: number;
  Wallet: WalletItem[];
  Bank: BankItem[];
};
