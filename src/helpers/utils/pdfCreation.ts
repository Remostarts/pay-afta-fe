import { jsPDF } from 'jspdf';
import type { OrderDetails } from '@/types/order';

type AgreementPdfVersion = 'pending' | 'signed';

// Error class for PDF generation errors
export class PdfGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'PdfGenerationError';
  }
}

// Input validation interface
interface ValidateOrderInput {
  id: string;
  amount: number;
  buyer: { firstName?: string | null; lastName?: string | null; email?: string };
  seller: { firstName?: string | null; lastName?: string | null; email?: string };
  transactionType: string;
}

const formatCurrency = (value?: number | null): string => {
  if (value == null || isNaN(value)) return '';
  try {
    return `₦${value.toLocaleString('en-NG')}`;
  } catch {
    return `₦${value}`;
  }
};

const getFullName = (user?: { firstName?: string | null; lastName?: string | null }): string => {
  if (!user) return '—';
  const names = [user.firstName, user.lastName].filter(Boolean);
  return names.length > 0 ? names.join(' ') : '—';
};

const getItemName = (order?: OrderDetails | null): string => {
  if (!order) return 'Item / Service';

  // Use detailAboutItem if available, fallback to transactionType
  if (
    order.detailAboutItem &&
    typeof order.detailAboutItem === 'string' &&
    order.detailAboutItem.trim()
  ) {
    return order.detailAboutItem;
  }

  if (order.transactionType && typeof order.transactionType === 'string') {
    return `${order.transactionType} / Service`;
  }

  return 'Item / Service';
};

const getToday = (): string => {
  try {
    return new Date().toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return new Date().toLocaleDateString();
  }
};

// Input validation function
const validateOrderInput = (order: OrderDetails): ValidateOrderInput => {
  if (!order) {
    throw new PdfGenerationError('Order details are required');
  }

  if (!order.id) {
    throw new PdfGenerationError('Order ID is required');
  }

  if (typeof order.amount !== 'number' || isNaN(order.amount)) {
    throw new PdfGenerationError('Valid order amount is required');
  }

  if (!order.buyer) {
    throw new PdfGenerationError('Buyer information is required');
  }

  if (!order.seller) {
    throw new PdfGenerationError('Seller information is required');
  }

  return {
    id: order.id,
    amount: order.amount,
    buyer: {
      firstName: order.buyer.firstName,
      lastName: order.buyer.lastName,
      email: order.buyer.email,
    },
    seller: {
      firstName: order.seller.firstName,
      lastName: order.seller.lastName,
      email: order.seller.email,
    },
    transactionType: order.transactionType || 'Product',
  };
};

/**
 * Unsigned / pre-acceptance agreement (first layout)
 */
export const GeneratePendingAgreementPdf = (order: OrderDetails): void => {
  try {
    // Validate input
    const validatedOrder = validateOrderInput(order);

    const doc = new jsPDF('p', 'pt', 'a4');
    const marginX = 40;
    let y = 60;

    const buyerName = getFullName(validatedOrder.buyer);
    const sellerName = getFullName(validatedOrder.seller);
    const itemName = getItemName(order);
    const amount = formatCurrency(validatedOrder.amount);
    const agreementId = validatedOrder.id ?? '—';

    // HEADER
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(3, 4, 91); // deep blue-ish
    doc.text('PayAfta', marginX, y);
    doc.setTextColor(0, 0, 0);
    doc.text('Agreement', marginX + 100, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Agreement ID: ${agreementId}`, 400, 60);
    doc.text(`Effective Date: ${getToday()}`, 400, 75);

    // INTRO
    y += 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('This Escrow Agreement ("Agreement") is entered into between:', marginX, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    const introLines = doc.splitTextToSize(
      `Buyer: ${buyerName}, registered on PayAfta\n` +
        `and\nSeller: ${sellerName}, registered on PayAfta.`,
      520
    );
    doc.text(introLines, marginX, y);
    y += introLines.length * 14 + 10;

    // PURPOSE
    doc.setFont('helvetica', 'bold');
    doc.text('The Purpose', marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    const purpose = doc.splitTextToSize(
      'The purpose of this Agreement is to facilitate a secure transaction between the Parties using PayAfta’s escrow service. Funds will be held in escrow until the Buyer confirms satisfactory delivery of the item or service.',
      520
    );
    doc.text(purpose, marginX, y);
    y += purpose.length * 14 + 20;

    // TRANSACTION DETAILS
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Details', marginX, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    const rows: [string, string][] = [
      ['Item/Service', itemName],
      ['Effective Date', getToday()],
      ['Quantity', '1 Unit'],
      ['Total Escrow Amount', amount],
      ['Delivery Deadline', '—'],
      ['Payment Time', 'One Time'],
    ];
    rows.forEach(([label, value]) => {
      doc.text(label, marginX, y);
      doc.text(value, 380, y);
      y += 16;
    });
    y += 10;

    // OBLIGATIONS, RELEASE, FUNDS, etc. – condensed but follows your layout
    const section = (title: string, body: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(title, marginX, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(body, 520);
      doc.text(lines, marginX + 10, y);
      y += lines.length * 14 + 12;
    };

    section(
      'Obligation of the parties',
      '• Seller agrees to deliver the goods/services in accordance with the agreed terms.\n' +
        '• Buyer agrees to inspect and confirm receipt upon delivery, or raise a return/refund request within the stated review period.'
    );

    section(
      'Escrow Release Conditions',
      '• Funds will remain in escrow until Buyer confirms delivery or a dispute is resolved in accordance with PayAfta’s policies.'
    );

    section(
      'Dispute and Resolution',
      'If a dispute arises, both parties agree to cooperate with PayAfta’s resolution process. PayAfta reserves the right to make a final decision based on transaction data and communication records.'
    );

    section(
      'Cancellation and Refund',
      'The Buyer may cancel only under valid circumstances. Refunds will be processed back into the Buyer’s PayAfta wallet subject to PayAfta’s policies.'
    );

    // ACCEPTANCE & SIGNATURE
    doc.setFont('helvetica', 'bold');
    doc.text('Acceptance and Signature', marginX, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    const acceptance = doc.splitTextToSize(
      'By checking the acceptance box in the PayAfta application, each party agrees to the terms outlined above. This serves as a digital signature under applicable e-signature laws.',
      520
    );
    doc.text(acceptance, marginX, y);
    y += acceptance.length * 14 + 20;

    doc.text(`Buyer: ${buyerName}`, marginX, y);
    doc.text(`Seller: ${sellerName}`, marginX + 260, y);

    doc.save(`escrow-agreement-${agreementId || 'pending'}.pdf`);
  } catch (error) {
    console.error('Error generating pending agreement PDF:', error);
    throw new PdfGenerationError('Failed to generate pending agreement PDF', error);
  }
};

/**
 * Signed / post-acceptance confirmation (second layout)
 */
export function GenerateSignedAgreementPdf(order: OrderDetails): void {
  try {
    // Validate input
    const validatedOrder = validateOrderInput(order);

    const doc = new jsPDF('p', 'pt', 'a4');
    const marginX = 40;
    let y = 60;

    const buyerName = getFullName(validatedOrder.buyer);
    const sellerName = getFullName(validatedOrder.seller);
    const itemName = getItemName(order);
    const amount = formatCurrency(validatedOrder.amount);
    const agreementId = validatedOrder.id ?? '—';

    // HEADER
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(3, 4, 91);
    doc.text('PayAfta', marginX, y);
    doc.setTextColor(0, 0, 0);
    doc.text('Agreement', marginX + 100, y);
    y += 30;

    // CONFIRMATION
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Agreement Confirmation', marginX, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(
      'This is to confirm that the following agreement has been successfully signed by both parties.',
      520
    );
    doc.text(lines, marginX, y);
    y += lines.length * 14 + 16;

    // BASIC INFO
    const infoRows: [string, string][] = [
      ['Agreement Title', 'Product/Service Sales Agreement'],
      ['Agreement Date', getToday()],
      ['Status', 'Signed and Confirmed'],
    ];
    infoRows.forEach(([label, value]) => {
      doc.text(label, marginX, y);
      doc.text(value, 340, y);
      y += 16;
    });
    y += 20;

    // SELLER
    doc.setFont('helvetica', 'bold');
    doc.text('Seller Information', marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${sellerName}`, marginX, y);
    y += 14;
    doc.text(`Email: ${validatedOrder.seller.email || '—'}`, marginX, y);
    y += 14;
    doc.text('Role: Seller', marginX, y);
    y += 20;

    // BUYER
    doc.setFont('helvetica', 'bold');
    doc.text('Buyer Information', marginX, y);
    y += 16;
    doc.setFont('helvetica', 'normal');
    doc.text(`Full Name: ${buyerName}`, marginX, y);
    y += 14;
    doc.text(`Email: ${validatedOrder.buyer.email || '—'}`, marginX, y);
    y += 14;
    doc.text('Role: Buyer', marginX, y);
    y += 24;

    // TRANSACTION DETAILS
    doc.setFont('helvetica', 'bold');
    doc.text('Transaction Details', marginX, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    const txRows: [string, string][] = [
      ['Item/Service', itemName],
      ['Effective Date', getToday()],
      ['Quantity', '1 Unit'],
      ['Total Escrow Amount', amount],
      ['Delivery Deadline', '—'],
      ['Payment Time', 'One Time'],
    ];
    txRows.forEach(([label, value]) => {
      doc.text(label, marginX, y);
      doc.text(value, 340, y);
      y += 16;
    });
    y += 20;

    const bullet = doc.splitTextToSize(
      '• The agreement is now legally binding.\n' +
        '• Funds will be held in escrow until delivery is confirmed.\n' +
        '• Buyer and seller will be notified via email for shipping updates and payment events.',
      520
    );
    doc.text(bullet, marginX, y);

    doc.save(`escrow-agreement-${agreementId}-signed.pdf`);
  } catch (error) {
    console.error('Error generating signed agreement PDF:', error);
    throw new PdfGenerationError('Failed to generate signed agreement PDF', error);
  }
}
