export type Transaction = {
  id: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED'; // Expand based on all possible values
  createdAt: string; // ISO date string
  amount: number;
  type: 'CREDIT' | 'WITHDRAWAL' | 'TRACK_LINK' | 'CARD_FUNDED';
  buyerId: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerProfileImage: string;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  pending: number;
};

export type TransactionResponse = {
  meta: Meta;
  data: Transaction[];
};
