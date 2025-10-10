export type TFaq = {
  id: string;
  question: string;
  answer: string[];
};

export const PricingFaq: TFaq[] = [
  {
    id: '1',
    question: "How are PayAfta's fees calculated?",
    answer: [
      'We charge flat fees for transparency. For example:',
      '₦1,000–₦9,999 = ₦250',
      '₦10,000–₦49,999 = ₦500',
      'No hidden percentages or surprises.',
    ],
  },
  {
    id: '2',
    question: 'Why does PayAfta charge flat fees for small transactions?',
    answer: [
      'This flat fee covers essential costs like:',
      '• Payment processing',
      '• 24/7 customer support',
      '• Dispute resolution services',
      '• Still cheaper than losing money to fraud!',
    ],
  },
  {
    id: '3',
    question: 'Do you offer discounts for high-volume transactions?',
    answer: [
      'Yes! Contact our Sales Team for:',
      '• Transactions above ₦1,000,000',
      '• Custom rates for marketplaces, freelancers, or exporters',
    ],
  },
  {
    id: '4',
    question: 'What’s included in the fee?',
    answer: [
      'Every transaction covers:',
      '✅ Escrow account management',
      '✅ Secure payment processing',
      '✅ Dedicated transaction monitoring',
      '✅ Free dispute resolution',
    ],
  },
  {
    id: '5',
    question: 'How do I pay the fee?',
    answer: [
      'PayAfta offers flexible fee payment options agreed upon by both parties:',
      '• Buyer-Paid: Fees are added to the transaction amount and paid upfront.',
      '• Seller-Paid: Fees are automatically deducted from the released payment.',
      "• Split Fee: Buyer pays their portion upfront; seller's share is deducted at release.",
      'The payment responsibility is confirmed before the transaction is initiated.',
    ],
  },
];
