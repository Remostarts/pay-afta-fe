type TFaq = {
  id: string;
  question: string;
  answer: string;
};

export const Faq: TFaq[] = [
  {
    id: '1',
    question: 'What happens in case of a dispute?',
    answer:
      'In the event of a dispute, PayAfta provides a resolution process to help user reach a fair and satisfactory outcome. Users can initiate a dispute through through their PayAfta account, providing relevant details and supporting documents. PayAfta will investigate the dispute and word towards a resolution that benefits all parties involved.',
  },
  {
    id: '2',
    question: 'How do I contact PayAfta support?',
    answer: `If you need assistance or have question, our dedicated customer support team is here to help. You can contact PayAfta support through the following method:
    • Email: To be provided
    • Phone: To be provided
    • Live Chat: Visit the PayAfta website or app to engage in real-time chat with our support team.    
    `,
  },
  {
    id: '3',
    question: 'What happens if I request for delivery time extension and buyer ignores it?',
    answer:
      'When requesting a time extension as a seller with goods in transit, clear and transparent communication with the buyer is crucial. Explain the reasons for the extension, provide necessary information, and reaffirm your commitment to completing the transaction. If the buyer does not grant the extension, consider involving a neutral third party for mediation(PayAfta Support).',
  },
  {
    id: '4',
    question: 'What are the other benefits of using Payafta for my financial transactions?',
    answer: `
• Money-Back Guarantee: If the product or service doesn't meet the agreed-upon conditions, you have the assurance of a money-back guarantee.
• Payment Security: When a buyer makes a payment through PayAfta, you can be confident that the funds are secure and genuine.
• No Chargebacks: Say goodbye to the risk of chargebacks. PayAfta offers a layer of protection that helps you avoid these challenges.
• Dispute Resolution: In case of any disputes, our team will provide you with fair and impartial mediation.
 `,
  },
];
