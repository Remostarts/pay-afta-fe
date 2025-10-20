'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import Summary from './Summary';
import TransactionSummary from './TransactionSummary';
import MakePayment from './MakePayment';
import ConfirmShipping from './ConfirmShipping';
import Delivery from './Delivery';
import ReturnProduct from './ReturnProduct';
import TransactionsDispute from './TransactionsDispute';
import OrderAgreement from './OrderAgreement';
import StepperForProduct from './StepperForProduct';

import { toast } from 'sonner';
import { getOrder } from '@/lib/actions/order/order.actions';
import { useGeneral } from '@/context/generalProvider';
import { useSocket } from '@/context/socketProvider';
import TransactionSummarySkeleton from './TransactionSummarySkeleton';
import { OrderDetails } from '@/types/order';

interface TransactionsSummaryProps {
  onBack: () => void;
  id: string;
}

export type UserRole = 'buyer' | 'seller' | null;

export default function TransactionsSummaryForProduct({ onBack, id }: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [showRiseDispute, setShowRiseDispute] = useState<boolean>(false);
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const { user } = useGeneral();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);

  const { socket } = useSocket();

  // Load order from API
  async function loadOrder() {
    if (!id) return;
    setProgressLoading(true);
    try {
      const response = await getOrder(id);
      if (response?.success) {
        setUserRole(
          user?.id === response.data.buyerId
            ? 'buyer'
            : user?.id === response.data.sellerId
              ? 'seller'
              : null
        );
        setOrder(response.data);
        setCurrentStep(response.data.currentStep + 1);
      } else {
        toast.error(response?.error || 'Failed to load order');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load order');
    } finally {
      setProgressLoading(false);
    }
  }

  // Listen to real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdated = (updatedOrder: OrderDetails) => {
      console.log('🚀 Real-time order update received:', updatedOrder);
      setOrder(updatedOrder);
      setCurrentStep(updatedOrder.currentStep + 1);
      toast.success('Order progress updated in real-time!');
    };

    socket.on('order_updated', handleOrderUpdated);

    return () => {
      socket.off('order_updated', handleOrderUpdated);
    };
  }, [socket]);

  useEffect(() => {
    loadOrder();
  }, [id]);

  // Delivery handlers
  const handleAcceptDelivery = () => setCurrentStep(5);
  const handleRejectDelivery = () => setIsReturn(true);
  const handleRefundRequested = () => setIsReturn(true);
  const handleReturnCompleted = () => {
    setIsRefunded(true);
    setCurrentStep(5);
  };

  return (
    <div>
      {progressLoading ? (
        <TransactionSummarySkeleton />
      ) : (
        <section
          className={
            currentStep === 1 ? 'grid grid-rows-2 lg:flex lg:gap-10' : 'flex flex-col gap-4'
          }
        >
          <div className="rounded-md bg-white p-4 max-w-3xl">
            <button className="flex items-center justify-center" onClick={onBack}>
              <ChevronLeft size={20} />
              <h1 className="font-inter text-xl font-bold text-gray-700">Escrow Summary</h1>
            </button>
            <div className="mb-5 flex items-center justify-between">
              <p className="font-inter text-gray-500">Transactions ID: {id}</p>
              <p className="font-inter text-gray-500">
                {order?.deliveryDate
                  ? new Date(order.deliveryDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--'}
              </p>
            </div>

            <StepperForProduct
              currentStep={currentStep}
              isDisputed={showRiseDispute}
              isReturn={isReturn}
              isRefunded={isRefunded}
            />

            {currentStep === 1 ? (
              <OrderAgreement
                handleCurrentStepChange={setCurrentStep}
                currentStepChange={currentStep}
                userRole={userRole}
                showActions={userRole === 'buyer'}
                order={order ?? null}
                loadOrder={loadOrder}
              />
            ) : currentStep === 2 ? (
              <MakePayment
                handleCurrentStepChange={setCurrentStep}
                currentStepChange={currentStep}
                userRole={userRole}
                isProduct={true}
                showActions={userRole === 'buyer'}
                order={order ?? null}
                loadOrder={loadOrder}
              />
            ) : currentStep === 3 ? (
              <ConfirmShipping
                handleCurrentStepChange={setCurrentStep}
                currentStepChange={currentStep}
                userRole={userRole}
                showActions={userRole === 'seller'}
                // showActions={true}
              />
            ) : currentStep === 4 ? (
              isReturn ? (
                <ReturnProduct
                  handleCurrentStepChange={setCurrentStep}
                  handleShowRiseDispute={setShowRiseDispute}
                  handleReturnCompleted={handleReturnCompleted}
                  handleIsRequestRefund={() => {}}
                  currentStepChange={currentStep}
                  userRole={userRole}
                  showActions={true}
                />
              ) : (
                <Delivery
                  handleCurrentStepChange={setCurrentStep}
                  handleShowRiseDispute={setShowRiseDispute}
                  handleAcceptDelivery={handleAcceptDelivery}
                  handleRejectDelivery={handleRejectDelivery}
                  handleIsRequestRefund={() => {}}
                  handleRefundRequested={handleRefundRequested}
                  currentStepChange={currentStep}
                  userRole={userRole}
                  showActions={userRole === 'buyer'}
                  // showActions={true}
                />
              )
            ) : currentStep === 5 ? (
              showRiseDispute ? (
                <TransactionsDispute />
              ) : isRefunded ? (
                <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                  <h2 className="mb-2 text-lg font-semibold">Transaction Refunded</h2>
                  <p className="text-sm font-medium text-gray-700">
                    Refund processed successfully! The product has been returned and payment has
                    been refunded to the buyer account.
                  </p>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                  <h2 className="mb-2 text-lg font-semibold">Transaction Completed</h2>
                  <p className="text-sm font-medium text-gray-700">
                    Congratulations! Transaction complete, product/service delivered & accepted.
                    Payment released, marking a successful and seamless process.
                  </p>
                </div>
              )
            ) : (
              <p>NULL</p>
            )}
          </div>

          <div className="rounded-md max-w-xl bg-white p-4">
            {currentStep === 1 ? (
              order && (
                <Summary
                  userRole={userRole}
                  showActions={true}
                  name={
                    userRole === 'buyer'
                      ? `${order?.seller?.firstName} ${order?.seller?.lastName}`
                      : `${order?.buyer?.firstName} ${order?.buyer?.lastName}`
                  }
                  paymentMethod={order?.paymentType}
                  deliveryDate={new Date(order?.deliveryDate).toLocaleDateString()}
                  item={order?.detailAboutItem}
                  quantity={order?.milestones?.length || 1}
                  price={order?.amount}
                />
              )
            ) : (
              <TransactionSummary order={order ?? null} />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
