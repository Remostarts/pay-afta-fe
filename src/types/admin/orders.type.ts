export type TOrder = {
  id: string;
  status: 'AGREEMENT' | 'PAYMENT' | 'SHIPPING' | 'DELIVERY' | 'CLOSED' | 'DISPUTED';
  createdAt: string; // or Date if you plan to convert it
  transactionType: string;
  amount: number;
  sellerId: string;
  sellerFirstName: string;
  sellerLastName: string;
};

export type TOrderResponse = {
  meta: {
    page: number;
    limit: number;
    total: number;
    pending: number;
  };
  data: TOrder[];
};
