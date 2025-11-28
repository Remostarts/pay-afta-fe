export type TOrder = {
  id: string;
  status:
    | 'PENDING'
    | 'CANCELED'
    | 'BUYER_AGREED'
    | 'SELLER_AGREED'
    | 'PAYMENT_PENDING'
    | 'PAID'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'DISPUTED_REQUESTED'
    | 'DISPUTED'
    | 'RETURN_INITIATED'
    | 'RETURNED';
  createdAt: string;
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
