// Mock data for testing delivery tracking functionality
// This provides realistic sample data for various delivery scenarios

import { DeliveryStatus } from '@/types/order';

export interface MockDeliveryData {
  id: string;
  orderNumber: string;
  status: DeliveryStatus;
  currentStep: string;
  totalCost: number;
  seller: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  order: {
    orderNumber: string;
    buyer: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    deliveryDate: string;
  };
  pickupAddress: string;
  dropoffAddress: string;
  timeline: {
    step: string;
    note?: string;
    timestamp?: string;
    status: string;
  }[];
}

// Generate sample timeline based on status
function generateTimeline(status: DeliveryStatus): MockDeliveryData['timeline'] {
  const now = new Date();
  const baseTimeline = [
    {
      step: 'ORDER_RECEIVED',
      note: 'Order has been received by logistics partner',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED',
    },
    {
      step: 'PAYMENT_CONFIRMED',
      note: 'Payment has been confirmed',
      timestamp: new Date(now.getTime() - 45 * 60 * 60 * 1000).toISOString(),
      status: 'COMPLETED',
    },
    {
      step: 'PACKAGE_PICKED_UP',
      note: 'Package picked up from seller',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      status: status === 'PAID' ? 'COMPLETED' : status === 'ACCEPTED' ? 'PENDING' : 'COMPLETED',
    },
    {
      step: 'IN_TRANSIT',
      note: 'Package is on the way to destination',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      status:
        status === 'IN_TRANSIT' || status === 'DELIVERED' || status === 'FAILED'
          ? 'COMPLETED'
          : 'PENDING',
    },
    {
      step: 'DELIVERED',
      note:
        status === 'FAILED'
          ? 'Delivery failed - customer not available'
          : 'Package delivered successfully',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      status: status === 'DELIVERED' ? 'COMPLETED' : status === 'FAILED' ? 'FAILED' : 'PENDING',
    },
  ];

  return baseTimeline.filter((item) => item.timestamp !== undefined);
}

// Realistic Nigerian addresses
const nigerianAddresses = {
  pickup: [
    '123 Victoria Island, Lagos, Lagos State, Nigeria',
    '45 Ajah Market Street, Lekki, Lagos State, Nigeria',
    '67 Allen Avenue, Ikeja, Lagos State, Nigeria',
    '89 Ado Bayero Mall, Kano, Kano State, Nigeria',
    '12 Wuse Market Area, Abuja, FCT, Nigeria',
  ],
  dropoff: [
    '456 Surulere, Lagos, Lagos State, Nigeria',
    '78 Garki Market, Abuja, FCT, Nigeria',
    '34 Jos Market, Jos, Plateau State, Nigeria',
    '56 Port Harcourt Market, Port Harcourt, Rivers State, Nigeria',
    '23 Benin City Market, Benin, Edo State, Nigeria',
  ],
};

const nigerianNames = {
  firstNames: [
    'Adebayo',
    'Chioma',
    'Ibrahim',
    'Fatima',
    'Oluwaseun',
    'Ngozi',
    'Khalil',
    'Aisha',
    'Emeka',
    'Bisi',
  ],
  lastNames: [
    'Okafor',
    'Johnson',
    'Mohammed',
    'Adeolu',
    'Nwosu',
    'Bakare',
    'Sani',
    'Okoye',
    'Aliyu',
    'Chukwu',
  ],
  businesses: [
    'TechHub Nigeria',
    'Lagos Electronics',
    'Kano Textiles',
    'Abuja Provisions',
    'Port Harcourt Hardware',
  ],
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Mock data for different delivery scenarios
export const mockDeliveryData: Record<string, MockDeliveryData> = {
  // Active delivery - In Transit
  DEL001: {
    id: 'DEL001',
    orderNumber: 'ORD-2024-001',
    status: 'IN_TRANSIT',
    currentStep: 'IN_TRANSIT',
    totalCost: 2500,
    seller: {
      firstName: getRandomElement(nigerianNames.firstNames),
      lastName: getRandomElement(nigerianNames.lastNames),
      phone: '+234 803 123 4567',
      email: 'seller@techhub.ng',
    },
    order: {
      orderNumber: 'ORD-2024-001',
      buyer: {
        firstName: getRandomElement(nigerianNames.firstNames),
        lastName: getRandomElement(nigerianNames.lastNames),
        phone: '+234 807 987 6543',
        email: 'buyer@gmail.com',
      },
      deliveryDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: nigerianAddresses.pickup[0],
    dropoffAddress: nigerianAddresses.dropoff[0],
    timeline: generateTimeline('IN_TRANSIT'),
  },

  // Recent pickup - Picked Up
  DEL002: {
    id: 'DEL002',
    orderNumber: 'ORD-2024-002',
    status: 'PICKED_UP',
    currentStep: 'PICKED_UP',
    totalCost: 1800,
    seller: {
      firstName: 'Adebayo',
      lastName: 'Okafor',
      phone: '+234 805 234 5678',
      email: 'abuja@electronics.ng',
    },
    order: {
      orderNumber: 'ORD-2024-002',
      buyer: {
        firstName: 'Chioma',
        lastName: 'Nwosu',
        phone: '+234 806 345 6789',
        email: 'chioma@yahoo.com',
      },
      deliveryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: nigerianAddresses.pickup[1],
    dropoffAddress: nigerianAddresses.dropoff[1],
    timeline: generateTimeline('PICKED_UP'),
  },

  // Payment confirmed - Ready for pickup
  DEL003: {
    id: 'DEL003',
    orderNumber: 'ORD-2024-003',
    status: 'PAID',
    currentStep: 'PAYMENT',
    totalCost: 3200,
    seller: {
      firstName: 'Ibrahim',
      lastName: 'Mohammed',
      phone: '+234 807 456 7890',
      email: 'ibrahim@kano-textiles.com',
    },
    order: {
      orderNumber: 'ORD-2024-003',
      buyer: {
        firstName: 'Ngozi',
        lastName: 'Bakare',
        phone: '+234 808 567 8901',
        email: 'ngozi.hotmail.com',
      },
      deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: nigerianAddresses.pickup[2],
    dropoffAddress: nigerianAddresses.dropoff[2],
    timeline: generateTimeline('PAID'),
  },

  // Successfully delivered
  DEL004: {
    id: 'DEL004',
    orderNumber: 'ORD-2024-004',
    status: 'DELIVERED',
    currentStep: 'DELIVERY',
    totalCost: 1500,
    seller: {
      firstName: 'Oluwaseun',
      lastName: 'Okoye',
      phone: '+234 809 678 9012',
      email: 'olu@lagos-provisions.ng',
    },
    order: {
      orderNumber: 'ORD-2024-004',
      buyer: {
        firstName: 'Bisi',
        lastName: 'Aliyu',
        phone: '+234 810 789 0123',
        email: 'bisi@outlook.com',
      },
      deliveryDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: nigerianAddresses.pickup[3],
    dropoffAddress: nigerianAddresses.dropoff[3],
    timeline: generateTimeline('DELIVERED'),
  },

  // Failed delivery
  DEL005: {
    id: 'DEL005',
    orderNumber: 'ORD-2024-005',
    status: 'FAILED',
    currentStep: 'FAILED',
    totalCost: 2800,
    seller: {
      firstName: 'Khalil',
      lastName: 'Sani',
      phone: '+234 811 890 1234',
      email: 'khalil@portharcourt-hardware.ng',
    },
    order: {
      orderNumber: 'ORD-2024-005',
      buyer: {
        firstName: 'Fatima',
        lastName: 'Chukwu',
        phone: '+234 812 901 2345',
        email: 'fatima@gmail.com',
      },
      deliveryDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: nigerianAddresses.pickup[4],
    dropoffAddress: nigerianAddresses.dropoff[4],
    timeline: generateTimeline('FAILED'),
  },

  // High-value delivery
  DEL006: {
    id: 'DEL006',
    orderNumber: 'ORD-2024-006',
    status: 'IN_TRANSIT',
    currentStep: 'IN_TRANSIT',
    totalCost: 15000,
    seller: {
      firstName: 'Adebayo',
      lastName: 'Johnson',
      phone: '+234 813 012 3456',
      email: 'abu.johnson@luxury.ng',
    },
    order: {
      orderNumber: 'ORD-2024-006',
      buyer: {
        firstName: 'Chioma',
        lastName: 'Okafor',
        phone: '+234 814 123 4567',
        email: 'chioma.okoye@wealthy.ng',
      },
      deliveryDate: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: '78 Victoria Island Executive Suites, Lagos, Lagos State, Nigeria',
    dropoffAddress: '45 Banana Island, Ikoyi, Lagos, Lagos State, Nigeria',
    timeline: generateTimeline('IN_TRANSIT'),
  },

  // International shipping simulation
  DEL007: {
    id: 'DEL007',
    orderNumber: 'ORD-2024-007',
    status: 'IN_TRANSIT',
    currentStep: 'IN_TRANSIT',
    totalCost: 8500,
    seller: {
      firstName: 'Ibrahim',
      lastName: 'Mohammed',
      phone: '+234 815 234 5678',
      email: 'ibrahim.mohammed@abuja-international.ng',
    },
    order: {
      orderNumber: 'ORD-2024-007',
      buyer: {
        firstName: 'Ngozi',
        lastName: 'Nwosu',
        phone: '+234 816 345 6789',
        email: 'ngozi.nwosu@connect.ng',
      },
      deliveryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    },
    pickupAddress: '123 Nnamdi Azikiwe International Airport, Abuja, FCT, Nigeria',
    dropoffAddress: '56 Murtala Muhammed International Airport, Lagos, Lagos State, Nigeria',
    timeline: [
      ...generateTimeline('IN_TRANSIT').slice(0, 2),
      {
        step: 'AIRPORT_PROCESSING',
        note: 'Package processed at departure airport',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED',
      },
      {
        step: 'IN_TRANSIT',
        note: 'Package in transit between airports',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'COMPLETED',
      },
      {
        step: 'ARRIVAL_PROCESSING',
        note: 'Package arriving at destination airport',
        status: 'PENDING',
      },
      {
        step: 'LOCAL_DELIVERY',
        note: 'Final mile delivery',
        status: 'PENDING',
      },
    ],
  },
};

// Function to get mock data by delivery ID
export function getMockDeliveryById(id: string): MockDeliveryData | null {
  return mockDeliveryData[id] || null;
}

// Function to check if delivery ID should use mock data
export function isMockDelivery(id: string): boolean {
  return id in mockDeliveryData;
}
