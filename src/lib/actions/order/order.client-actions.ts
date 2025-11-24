'use client';

import { getSingleOrder } from './order.actions';
import { OrderDetails } from '@/types/order';

export interface InvoiceData {
  id: string;
  issueDate: string;
  dueDate: string;
  seller: {
    name: string;
    email: string;
  };
  buyer: {
    name: string;
    email: string;
  };
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    price: number;
  }>;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    deliveryDate: string;
    amount: number;
  }>;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
}

export async function fetchOrderById(orderId: string): Promise<InvoiceData> {
  try {
    const response = await getSingleOrder(orderId);

    console.log(response);

    if (!response?.success || !response?.data) {
      throw new Error(response?.message || 'Failed to fetch order data');
    }

    const orderData: OrderDetails = response.data;

    // Transform OrderDetails to InvoiceData format
    return transformOrderToInvoiceData(orderData);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

function transformOrderToInvoiceData(orderData: OrderDetails): InvoiceData {
  // Calculate totals
  const subtotal = orderData.amount;
  const tax = 0; // Set based on your business logic
  const shipping = 0; // Set based on your business logic
  const total = subtotal + tax + shipping;

  // Transform items
  const items = orderData.items.map((item, index) => ({
    id: `${orderData.id}-item-${index + 1}`,
    description: orderData.detailAboutItem || `Item ${index + 1}`,
    quantity: item.quantity || 1,
    price: subtotal / (item.quantity || 1), // Distribute total across items
  }));

  // Transform milestones
  const milestones = orderData.milestones.map((milestone, index) => ({
    id: milestone.id,
    title: milestone.title,
    description: orderData.detailAboutItem || `${milestone.title} deliverable`,
    deliveryDate: new Date(milestone.deliveryDate).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    amount: parseFloat(milestone.amount),
  }));

  // If no milestones exist, create a default one
  if (milestones.length === 0) {
    milestones.push({
      id: `${orderData.id}-milestone-1`,
      title: 'Full Payment',
      description: orderData.detailAboutItem || 'Complete payment',
      deliveryDate: new Date(orderData.deliveryDate).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      amount: subtotal,
    });
  }

  return {
    id: orderData.id,
    issueDate: new Date(orderData.createdAt).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    dueDate: new Date(orderData.deliveryDate).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    seller: {
      name: `${orderData.seller.firstName} ${orderData.seller.lastName}`,
      email: orderData.seller.email,
    },
    buyer: {
      name: `${orderData.buyer.firstName} ${orderData.buyer.lastName}`,
      email: orderData.buyer.email,
    },
    items,
    milestones,
    totals: {
      subtotal,
      tax,
      shipping,
      total,
    },
  };
}
