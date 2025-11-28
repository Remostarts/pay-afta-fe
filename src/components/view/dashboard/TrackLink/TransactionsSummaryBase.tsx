'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import StepperForProduct from './StepperForProduct';
import StepperForService from './StepperForService';
import OrderAgreement from './OrderAgreement';
import MakePayment from './MakePayment';
import Delivery from './Delivery';
import OrderShipped from './OrderShipped';
import Summary from './Summary';
import TransactionSummary from './TransactionSummary';
import TransactionsDispute from './TransactionsDispute';
import TransactionSummarySkeleton from './TransactionSummarySkeleton';

import { toast } from 'sonner';
import { getSingleOrder, updateOrderProgress } from '@/lib/actions/order/order.actions';
import { useGeneral } from '@/context/generalProvider';
import { useSocket } from '@/context/socketProvider';
import { OrderDetails } from '@/types/order';
import { UpdateOrderProgressDTO } from '@/lib/validations/order';
import { getStepByOrderType } from '@/helpers/utils/stepLogic';

export type UserRole = 'buyer' | 'seller' | null;
export type TransactionType = 'product' | 'service';

interface TransactionsSummaryBaseProps {
  onBack: () => void;
  id: string;
  type: TransactionType;
}

export default function TransactionsSummaryBase({
  onBack,
  id,
  type,
}: TransactionsSummaryBaseProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showRiseDispute, setShowRiseDispute] = useState<boolean>(false);
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [isRefunded, setIsRefunded] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [progressLoading, setProgressLoading] = useState<boolean>(false);

  const { user, loadUserData } = useGeneral();
  const { socket } = useSocket();

  // ---------------- Load Order ----------------
  async function loadOrder() {
    if (!id) return;
    setProgressLoading(true);

    try {
      if (!user) await loadUserData();

      const res = await getSingleOrder(id);
      if (res?.success) {
        const orderData = res.data;
        setOrder(orderData);

        // Determine user role
        const role: UserRole =
          user?.id === orderData.buyerId
            ? 'buyer'
            : user?.id === orderData.sellerId
              ? 'seller'
              : null;
        setUserRole(role);

        // Determine correct step based on type
        const step = getStepByOrderType(orderData, type);
        setCurrentStep(step);

        if (orderData.status === 'DISPUTED') setShowRiseDispute(true);
      } else {
        toast.error(res?.error || 'Failed to load order');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load order');
    } finally {
      setProgressLoading(false);
    }
  }

  // ---------------- Socket Updates ----------------
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdated = (updatedOrder: OrderDetails) => {
      setOrder(updatedOrder);
      const step = getStepByOrderType(updatedOrder, type);
      setCurrentStep(step);

      if (updatedOrder.status === 'DISPUTED') setShowRiseDispute(true);
      toast.success('Order progress updated in real-time!');
    };

    socket.on('order_updated', handleOrderUpdated);

    return () => {
      socket.off('order_updated', handleOrderUpdated);
    };
  }, [socket, type]);

  // ---------------- Initial Load ----------------
  useEffect(() => {
    const init = async () => {
      if (!user) await loadUserData();
      await loadOrder();
    };
    init();
  }, [id, user]);

  // ---------------- Delivery Handlers ----------------
  const handleAcceptDelivery = async () => {
    try {
      const finalStep = type === 'product' ? 5 : 4;
      const res = await updateOrderProgress(
        {
          status: 'COMPLETED',
          step: finalStep,
          notes: 'Buyer confirmed delivery.',
          userId: user?.id,
        } as UpdateOrderProgressDTO,
        order?.id as string
      );
      setOrder(res);
      setCurrentStep(finalStep);
      toast.success('Delivery accepted!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to accept delivery');
    }
  };

  const handleRejectDelivery = () => {
    setIsReturn(true);
    setShowRiseDispute(true);
  };

  const handleRefundRequested = () => setIsReturn(true);

  const handleReturnCompleted = () => {
    setIsRefunded(true);
    const finalStep = type === 'product' ? 5 : 4;
    setCurrentStep(finalStep);
  };

  // ---------------- UI Rendering ----------------
  if (progressLoading) return <TransactionSummarySkeleton />;

  const isProductFlow = type === 'product';
  const maxStep = isProductFlow ? 5 : 4;

  return (
    <div>
      <section
        className={currentStep === 1 ? 'grid grid-rows-2 lg:flex lg:gap-10' : 'flex flex-col gap-4'}
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

          {/* Stepper - Product or Service */}
          {isProductFlow ? (
            <StepperForProduct
              currentStep={currentStep}
              isDisputed={showRiseDispute}
              isReturn={isReturn}
              isRefunded={isRefunded}
            />
          ) : (
            <StepperForService
              currentStep={currentStep}
              isDisputed={showRiseDispute}
              isReturn={isReturn}
              isRefunded={isRefunded}
            />
          )}

          {/* ---------------- Step 1: Agreement ---------------- */}
          {currentStep === 1 && (
            <OrderAgreement
              handleCurrentStepChange={setCurrentStep}
              currentStepChange={currentStep}
              userRole={userRole}
              showActions={userRole === 'buyer'}
              order={order ?? null}
              loadOrder={loadOrder}
              userId={user?.id as string}
            />
          )}

          {/* ---------------- Step 2: Payment ---------------- */}
          {currentStep === 2 && (
            <MakePayment
              handleCurrentStepChange={setCurrentStep}
              currentStepChange={currentStep}
              userRole={userRole}
              isProduct={isProductFlow}
              showActions={userRole === 'buyer'}
              order={order ?? null}
              userId={user?.id as string}
              loadOrder={loadOrder}
            />
          )}

          {/* ---------------- Step 3: Product=Shipping | Service=Delivery ---------------- */}
          {currentStep === 3 && (
            <>
              {isProductFlow ? (
                <OrderShipped
                  userRole={userRole}
                  order={order ?? null}
                  userId={user?.id as string}
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
                  userId={user?.id as string}
                />
              )}
            </>
          )}

          {/* ---------------- Step 4: Product=Delivery | Service=Completed ---------------- */}
          {currentStep === 4 && (
            <>
              {isProductFlow ? (
                !isReturn && (
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
                    userId={user?.id as string}
                  />
                )
              ) : (
                <>
                  {showRiseDispute ? (
                    <TransactionsDispute />
                  ) : isRefunded ? (
                    <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                      <h2 className="mb-2 text-lg font-semibold">Transaction Refunded</h2>
                      <p className="text-sm font-medium text-gray-700">
                        Refund processed successfully! Payment has been refunded to the buyer.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                      <h2 className="mb-2 text-lg font-semibold">Transaction Completed</h2>
                      <p className="text-sm font-medium text-gray-700">
                        Congratulations! Transaction complete, {order?.transactionType} delivered &
                        accepted.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ---------------- Step 5: Product Final Step ---------------- */}
          {currentStep === 5 && isProductFlow && (
            <>
              {showRiseDispute ? (
                <TransactionsDispute />
              ) : isRefunded ? (
                <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                  <h2 className="mb-2 text-lg font-semibold">Transaction Refunded</h2>
                  <p className="text-sm font-medium text-gray-700">
                    Refund processed successfully! Payment has been refunded to the buyer.
                  </p>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                  <h2 className="mb-2 text-lg font-semibold">Transaction Completed</h2>
                  <p className="text-sm font-medium text-gray-700">
                    Congratulations! Transaction complete, {order?.transactionType} delivered &
                    accepted.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ---------------- Summary Panel ---------------- */}
        <div className="rounded-md max-w-3xl p-4">
          {currentStep === 1 ? (
            order && (
              <Summary
                userRole={userRole}
                showActions
                name={
                  userRole === 'buyer'
                    ? order?.seller?.firstName
                      ? `${order.seller.firstName} ${order.seller.lastName}`
                      : 'Guest User'
                    : order?.buyer?.firstName
                      ? `${order.buyer.firstName} ${order.buyer.lastName}`
                      : 'Guest User'
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
    </div>
  );
}
