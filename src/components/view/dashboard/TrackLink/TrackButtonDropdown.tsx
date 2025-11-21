'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Edit2, X, Clock, Truck, AlertTriangle, ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { OrderDetails } from '@/types/order';
import { SimpleOrder } from './index';
// API imports removed - components are now invoked directly without API calls
import EditOrderModal from './EditOrderModal';
import RaiseDispute from './RaiseDispute';
import RejectOrderModal from './RejectOrderModal';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getSingleOrder } from '@/lib/actions/order/order.actions';

interface TrackButtonDropdownProps {
  order: SimpleOrder | OrderDetails;
  onOrderUpdate: () => void;
}

interface DropdownItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => Promise<void>;
  enabled: boolean;
  disabledReason?: string;
}

export default function TrackButtonDropdown({ order, onOrderUpdate }: TrackButtonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [detailedOrder, setDetailedOrder] = useState<OrderDetails | null>(null);
  const mountedComponentsRef = useRef<{ [key: string]: boolean }>({});
  const router = useRouter();

  // Debounce rapid clicks
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get activation state based on order status
  const getActivationState = useCallback(() => {
    const status = order.status;
    const isBeforeAgreement = ['PENDING', 'INITIATED', 'CREATED'].includes(status.toUpperCase());
    const isNotShipped = !['SHIPPING', 'IN_TRANSIT', 'DELIVERY', 'DELIVERED'].includes(
      status.toUpperCase()
    );
    const isShipped = ['SHIPPING', 'IN_TRANSIT', 'DELIVERY'].includes(status.toUpperCase());
    const isFailedOrDelayed = ['FAILED', 'DELAYED', 'DISPUTED'].includes(status.toUpperCase());

    return {
      editOrder: isBeforeAgreement,
      cancelOrder: isNotShipped,
      viewTimeline: true,
      trackDelivery: isShipped,
      raiseDispute: isFailedOrDelayed,
    };
  }, [order.status]);

  const activationState = getActivationState();

  // Handle dropdown item click with loading state
  const handleItemClick = useCallback(async (itemId: string, action: () => Promise<void>) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(async () => {
      try {
        setIsLoading(itemId);
        await action();
        setIsOpen(false);
      } catch (error) {
        console.error(`Error executing ${itemId}:`, error);
        // Error handling is done in individual actions
      } finally {
        setIsLoading(null);
      }
    }, 100);
  }, []);

  // Edit Order action - fetches detailed order data and opens EditOrderModal
  const handleEditOrder = useCallback(async () => {
    try {
      setIsLoading('editOrder');
      const response = await getSingleOrder(order.id);
      if (response?.success && response?.data) {
        setDetailedOrder(response.data);
        setShowEditModal(true);
      } else {
        toast.error('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(null);
    }
  }, [order.id]);

  // Cancel Order action - invokes RejectOrderModal component directly
  const handleCancelOrder = useCallback(async () => {
    try {
      setShowCancelModal(true);
    } catch (error) {
      toast.error('Failed to open cancel order modal');
    }
  }, []);

  // View Timeline action - invokes timeline view component
  const handleViewTimeline = useCallback(async () => {
    router.push(`track-links/${order.transactionType}/${order.id}`);
  }, [order]);

  // Track Delivery action - invokes tracking component directly
  const handleTrackDelivery = useCallback(async () => {
    router.push(`tracking/order/${order.id}`);
  }, [order.id]);

  // Raise Dispute action - invokes RaiseDispute component directly
  const handleRaiseDispute = useCallback(async () => {
    try {
      setShowDisputeModal(true);
      toast.success('Raise dispute modal opened');
    } catch (error) {
      toast.error('Failed to open dispute modal');
    }
  }, []);

  // Handle successful order update
  const handleOrderUpdateSuccess = useCallback(() => {
    onOrderUpdate();
    toast.success('Order updated successfully');
  }, [onOrderUpdate]);

  // Dropdown items configuration
  const dropdownItems: DropdownItem[] = [
    {
      id: 'editOrder',
      label: 'Edit Order',
      icon: <Edit2 className="w-4 h-4" />,
      action: handleEditOrder,
      enabled: activationState.editOrder,
      disabledReason: 'Order is past the agreement stage',
    },
    {
      id: 'cancelOrder',
      label: 'Cancel Order',
      icon: <X className="w-4 h-4" />,
      action: handleCancelOrder,
      enabled: activationState.cancelOrder,
      disabledReason: 'Order has already been shipped',
    },
    {
      id: 'viewTimeline',
      label: 'View Timeline',
      icon: <Clock className="w-4 h-4" />,
      action: handleViewTimeline,
      enabled: activationState.viewTimeline,
    },
    {
      id: 'trackDelivery',
      label: 'Track Delivery',
      icon: <Truck className="w-4 h-4" />,
      action: handleTrackDelivery,
      enabled: activationState.trackDelivery,
      disabledReason: 'Order has not been shipped yet',
    },
    {
      id: 'raiseDispute',
      label: 'Raise Dispute',
      icon: <AlertTriangle className="w-4 h-4" />,
      action: handleRaiseDispute,
      enabled: activationState.raiseDispute,
      disabledReason: 'Order status does not indicate failure or delay',
    },
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (isOpen && !target.closest(`#order-${order.id}-track`)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, order.id]);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            id={`order-${order.id}-track`}
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-[#333333] hover:bg-gray-100"
            aria-label={`Track Order ${order.id}`}
            aria-haspopup="menu"
            aria-expanded={isOpen}
          >
            Track
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 bg-white" role="menu" align="start" sideOffset={4}>
          {dropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              role="menuitem"
              className={cn(
                'flex items-center gap-3 cursor-pointer bg-white',
                !item.enabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={!item.enabled}
              onClick={() => item.enabled && handleItemClick(item.id, item.action)}
              title={!item.enabled ? item.disabledReason : undefined}
            >
              {isLoading === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : item.icon}
              <span className="text-sm">{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Order Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {detailedOrder && (
            <EditOrderModal
              order={detailedOrder}
              onClose={() => {
                setShowEditModal(false);
                setDetailedOrder(null);
              }}
              onSuccess={() => {
                handleOrderUpdateSuccess();
                setShowEditModal(false);
                setDetailedOrder(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {order && (
            <RejectOrderModal
              orderId={order?.id || ''}
              onClose={() => setShowCancelModal(false)}
              onSuccess={() => {
                handleOrderUpdateSuccess();
                setShowCancelModal(false);
              }}
              orderDetails={
                order
                  ? {
                      orderNumber: order.id,
                      transactionType: order.transactionType,
                      amount: order.amount.toString(),
                    }
                  : undefined
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Raise Dispute Modal */}
      <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {order && (
            <RaiseDispute
              handleClosed={() => setShowDisputeModal(false)}
              handleCurrentStepChange={() => {}}
              handleShowRiseDispute={() => setShowDisputeModal(false)}
              currentStepChange={0}
              handleIsDisputed={(isDisputed) => {
                if (isDisputed) {
                  handleOrderUpdateSuccess();
                }
              }}
              userRole="buyer"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
