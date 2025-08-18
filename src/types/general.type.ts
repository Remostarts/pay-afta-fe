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

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  coverImage: string | null;
  profile: Profile | null;
  walletBalance: number;
  escrowBalance: number;
};
