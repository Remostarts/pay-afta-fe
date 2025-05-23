export type TUserDetails = {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  email: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  profile: {
    dateOfBirth: string; // ISO date string format
    gender: 'male' | 'female' | string; // extend if needed
  };
};
