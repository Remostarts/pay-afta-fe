export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string; // ISO timestamp
};

type Meta = {
  page: number;
  limit: number;
  total: number;
};

export type UsersApiResponse = {
  meta: Meta;
  data: TUser[];
};
