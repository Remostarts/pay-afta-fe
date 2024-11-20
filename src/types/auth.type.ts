export type ResetPasswordParams = {
  email: string;
  emailVerificationCode: string;
  newPassword: string;
};

export type EmailVerificationParams = {
  email: string;
  emailVerificationCode: string;
};

export type LawyerInfoParams = {
  email: string;
  address: string;
  city: string;
  state: string;
  dateOfBirth: Date;
  gender: string;
};

export type LawStudentInfo = {
  email: string;
  address: string;
  city: string;
  state: string;
  dateOfBirth: Date;
  gender: string;
  studentCategory?: string;
  universityAttended?: string;
  yearOfGraduation?: string;
  nigeriaLawSchoolCurrentlyAt?: string;
  level?: string;
};
