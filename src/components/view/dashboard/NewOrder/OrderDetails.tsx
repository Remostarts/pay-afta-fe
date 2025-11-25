'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  Shield,
  Clock,
  FileText,
  Truck,
  Phone,
  Mail,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
  Download,
  Printer,
} from 'lucide-react';
import { TCreateOrderInput } from '@/lib/validations/newOrder.validation';

interface OrderDetailsProps {
  orderData: TCreateOrderInput;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

interface OrderStatus {
  code: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed';
  label: string;
  description: string;
  timestamp?: Date;
}

interface TimelineEvent {
  id: string;
  status: string;
  timestamp: Date;
  description: string;
  icon: React.ReactNode;
}

export default function OrderDetails({
  orderData,
  onClose,
  onConfirm,
  isSubmitting = false,
}: OrderDetailsProps) {
  // State management for interactive elements
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic-info', 'items'])
  );
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({
    code: 'confirmed',
    label: 'Order Confirmed',
    description: 'Your order has been successfully created and is ready for processing',
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate totals with memoization for performance
  const totals = useMemo(() => {
    const itemTotal = orderData.items.reduce((total, item) => total + Number(item.price || 0), 0);
    const escrowFee = itemTotal * 0.025; // 2.5% fee
    const totalAmount = itemTotal + escrowFee;

    return {
      itemTotal,
      escrowFee,
      totalAmount,
      taxRate: 0.075, // 7.5% VAT
      taxAmount: itemTotal * 0.075,
    };
  }, [orderData.items]);

  // Generate order number and timeline data
  const orderNumber = useMemo(() => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `POA-${timestamp}-${random}`;
  }, []);

  const orderTimeline = useMemo<TimelineEvent[]>(
    () => [
      {
        id: '1',
        status: 'Order Created',
        timestamp: new Date(),
        description: 'Order has been created and is ready for confirmation',
        icon: <FileText className="w-4 h-4" />,
      },
      {
        id: '2',
        status: 'Payment Pending',
        timestamp: new Date(Date.now() + 60000),
        description: 'Waiting for payment confirmation from counterparty',
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: '3',
        status: 'Processing',
        timestamp: new Date(Date.now() + 300000),
        description: 'Order is being processed by our team',
        icon: <Package className="w-4 h-4" />,
      },
    ],
    []
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date with timezone awareness
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return {
      short: d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      long: d.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Animation handler
  const handleConfirm = async () => {
    setIsAnimating(true);
    setTimeout(() => {
      onConfirm();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
    >
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden animate-scaleIn">
        <div className="flex flex-col h-full max-h-[95vh]">
          {/* Header */}
          <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-800/10 rounded-xl">
                  <Package className="w-6 h-6 text-primary-800" />
                </div>
                <div>
                  <h1
                    id="order-details-title"
                    className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    Order Details
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Order #{orderNumber}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Close order details"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </header>

          {/* Status Bar */}
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200">
                    {orderStatus.label}
                  </span>
                </div>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {orderStatus.description}
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <Clock className="w-4 h-4" />
                <span>Updated {formatDate(new Date()).short}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6">
              {/* Basic Information Section */}
              <CollapsibleSection
                id="basic-info"
                title="Transaction Details"
                icon={<User className="w-5 h-5" />}
                isExpanded={expandedSections.has('basic-info')}
                onToggle={() => toggleSection('basic-info')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <InfoCard label="Transaction Type" value={orderData.transactionType} />
                  <InfoCard label="Payment Type" value={orderData.paymentType} />
                  <InfoCard
                    label="Counter Party Contact"
                    value={orderData.counterpartyEmailOrPhoneNo}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <InfoCard
                    label={orderData.initiatorRole === 'Buyer' ? 'Invoice Date' : 'Delivery Date'}
                    value={formatDate(orderData.invoiceDate).long}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                  <InfoCard
                    label="Order Number"
                    value={orderNumber}
                    icon={<FileText className="w-4 h-4" />}
                  />
                  <InfoCard
                    label="Total Amount"
                    value={formatCurrency(totals.totalAmount)}
                    highlight
                    icon={<CreditCard className="w-4 h-4" />}
                  />
                </div>
              </CollapsibleSection>

              {/* Items Section */}
              <CollapsibleSection
                id="items"
                title={`Items (${orderData.items.length})`}
                icon={<Package className="w-5 h-5" />}
                isExpanded={expandedSections.has('items')}
                onToggle={() => toggleSection('items')}
              >
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <ItemCard
                      key={index}
                      item={item}
                      index={index}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Order Timeline */}
              <CollapsibleSection
                id="timeline"
                title="Order Timeline"
                icon={<Clock className="w-5 h-5" />}
                isExpanded={expandedSections.has('timeline')}
                onToggle={() => toggleSection('timeline')}
              >
                <div className="space-y-4">
                  {orderTimeline.map((event, index) => (
                    <TimelineItem
                      key={event.id}
                      event={event}
                      isLast={index === orderTimeline.length - 1}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Shipping Information */}
              <CollapsibleSection
                id="shipping"
                title="Shipping & Delivery"
                icon={<Truck className="w-5 h-5" />}
                isExpanded={expandedSections.has('shipping')}
                onToggle={() => toggleSection('shipping')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <InfoCard
                      label="Delivery Address"
                      value="Lagos, Nigeria"
                      icon={<MapPin className="w-4 h-4" />}
                    />
                    <InfoCard
                      label="Estimated Delivery"
                      value={formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).long}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                  <div className="space-y-4">
                    <InfoCard
                      label="Shipping Method"
                      value="Standard Delivery"
                      icon={<Truck className="w-4 h-4" />}
                    />
                    <InfoCard
                      label="Tracking Available"
                      value="Yes"
                      icon={<ExternalLink className="w-4 h-4" />}
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Item Details */}
              {orderData.detailAboutItem && (
                <CollapsibleSection
                  id="item-details"
                  title="Item Details & Description"
                  icon={<FileText className="w-5 h-5" />}
                  isExpanded={expandedSections.has('item-details')}
                  onToggle={() => toggleSection('item-details')}
                >
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {orderData.detailAboutItem}
                    </p>
                  </div>
                </CollapsibleSection>
              )}

              {/* Payment Milestones */}
              {orderData.milestones && orderData.milestones.length > 0 && (
                <CollapsibleSection
                  id="milestones"
                  title="Payment Milestones"
                  icon={<CreditCard className="w-5 h-5" />}
                  isExpanded={expandedSections.has('milestones')}
                  onToggle={() => toggleSection('milestones')}
                >
                  <div className="space-y-4">
                    {orderData.milestones.map((milestone, index) => (
                      <MilestoneCard
                        key={index}
                        milestone={milestone}
                        index={index}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                      />
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Pricing Breakdown */}
              <CollapsibleSection
                id="pricing"
                title="Payment Summary"
                icon={<CreditCard className="w-5 h-5" />}
                isExpanded={expandedSections.has('pricing')}
                onToggle={() => toggleSection('pricing')}
              >
                <div className="space-y-4">
                  <PriceRow label="Subtotal" value={formatCurrency(totals.itemTotal)} />
                  <PriceRow label="VAT (7.5%)" value={formatCurrency(totals.taxAmount)} />
                  <PriceRow
                    label={
                      <span className="inline-flex items-center gap-2">
                        Escrow Service Fee (2.5%)
                        <Info className="w-4 h-4 text-gray-400" />
                      </span>
                    }
                    value={formatCurrency(totals.escrowFee)}
                  />
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <PriceRow
                      label="Total Amount"
                      value={formatCurrency(totals.totalAmount)}
                      isTotal
                    />
                  </div>
                  {orderData.transactionFee && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Transaction fee responsibility:{' '}
                          <span className="font-medium">{orderData.transactionFee}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              {/* Validation Status */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      All information validated and ready for submission
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Your order has been reviewed and is ready to be processed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 min-h-[44px]"
              disabled={isSubmitting}
              aria-label="Cancel order creation"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>

            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-green-800 hover:bg-green-800/90 disabled:bg-gray-400 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 min-h-[44px] transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Confirm and send order"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Confirm & Send</span>
                </>
              )}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

function CollapsibleSection({
  id,
  title,
  icon,
  children,
  isExpanded,
  onToggle,
}: CollapsibleSectionProps) {
  return (
    <section className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 text-primary-800 dark:text-primary-400">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        id={`section-${id}`}
        className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
      >
        <div className="p-4 pt-0">{children}</div>
      </div>
    </section>
  );
}

// Info Card Component
interface InfoCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

function InfoCard({ label, value, icon, highlight }: InfoCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-colors duration-200 ${
        highlight
          ? 'border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-center space-x-2 mb-2">
        {icon && (
          <span
            className={
              highlight
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400'
            }
          >
            {icon}
          </span>
        )}
        <p
          className={`text-xs font-medium uppercase tracking-wide ${
            highlight
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {label}
        </p>
      </div>
      <p
        className={`font-semibold ${
          highlight
            ? 'text-primary-900 dark:text-primary-100 text-lg'
            : 'text-gray-900 dark:text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// Item Card Component
interface ItemCardProps {
  item: {
    name: string;
    price: string | number;
    quantity: string | number;
  };
  index: number;
  formatCurrency: (amount: number) => string;
}

function ItemCard({ item, index, formatCurrency }: ItemCardProps) {
  const subtotal = Number(item.price || 0) * Number(item.quantity || 1);

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-700 dark:text-primary-400 text-sm font-bold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Item {index + 1}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <InfoCard label="Quantity" value={String(item.quantity)} />
        <InfoCard label="Unit Price" value={formatCurrency(Number(item.price || 0))} />
        <InfoCard label="Subtotal" value={formatCurrency(subtotal)} highlight />
      </div>
    </div>
  );
}

// Timeline Item Component
interface TimelineItemProps {
  event: TimelineEvent;
  isLast: boolean;
  formatDate: (date: Date | string) => { short: string; long: string };
}

function TimelineItem({ event, isLast, formatDate }: TimelineItemProps) {
  return (
    <div className="flex space-x-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
          {event.icon}
        </div>
        {!isLast && <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 dark:text-white">{event.status}</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(event.timestamp).short}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
      </div>
    </div>
  );
}

// Milestone Card Component
interface MilestoneCardProps {
  milestone: {
    title: string;
    amount: string | number;
    deliveryDate: Date | string;
  };
  index: number;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => { short: string; long: string };
}

function MilestoneCard({ milestone, index, formatCurrency, formatDate }: MilestoneCardProps) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-400 text-sm font-bold">
            {index + 1}
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoCard label="Amount" value={formatCurrency(Number(milestone.amount || 0))} highlight />
        <InfoCard label="Due Date" value={formatDate(milestone.deliveryDate).short} />
      </div>
    </div>
  );
}

// Price Row Component
interface PriceRowProps {
  label: React.ReactNode;
  value: string;
  isTotal?: boolean;
}

function PriceRow({ label, value, isTotal }: PriceRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span
        className={`font-medium ${isTotal ? 'text-lg text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
      >
        {label}
      </span>
      <span
        className={`font-bold ${isTotal ? 'text-xl text-primary-800 dark:text-primary-200' : 'text-gray-900 dark:text-white'}`}
      >
        {value}
      </span>
    </div>
  );
}
