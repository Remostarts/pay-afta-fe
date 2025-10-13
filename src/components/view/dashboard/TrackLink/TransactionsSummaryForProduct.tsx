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

import { Button } from '@/components/ui/button';
import { getOrder } from '@/lib/actions/order/order.actions';
import { toast } from 'sonner';
import { OrderDetails } from '@/types/order';
import { useGeneral } from '@/context/generalProvider';
import TransactionSummarySkeleton from './TransactionSummarySkeleton';

interface TransactionsSummaryProps {
  onBack: () => void;
  id: string;
}

export type UserRole = 'buyer' | 'seller' | null;

export default function TransactionsSummaryForProduct({ onBack, id }: TransactionsSummaryProps) {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [showRiseDispute, setShowRiseDispute] = useState<boolean>(false);
  const [isReturn, setIsReturn] = useState<boolean>(false); // Tracks if product is in return stage
  const [isRefunded, setIsRefunded] = useState<boolean>(false); // Tracks if refund is processed
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const { user } = useGeneral();
  const [userRole, setUserRole] = useState<UserRole>(null);
  console.log(
    '🌼 🔥🔥 TransactionsSummaryForProduct 🔥🔥 userRole🌼',
    userRole,
    'buyerId',
    order?.buyerId,
    'sellerId',
    order?.sellerId,
    'userId',
    user?.id
  );
  const [progressLoading, setProgressLoading] = useState<boolean>(false);

  // Handler for Accept button in Delivery
  const handleAcceptDelivery = () => {
    setCurrentStep(5); // Move to Completed stage
  };

  // Handler for Reject button in Delivery - starts return process
  const handleRejectDelivery = () => {
    setIsReturn(true); // Move to Return stage
    // Stay on step 4 but show return component instead
  };

  // Handler for refund request from RequestRefund component
  const handleRefundRequested = () => {
    setIsReturn(true); // Set return state to true
    // Stay on current step but show ReturnProduct component
  };

  // Handler for completing the return process
  const handleReturnCompleted = () => {
    setIsRefunded(true); // Mark as refunded
    setCurrentStep(5); // Move to Refunded stage
  };

  async function loadOrder() {
    if (!id) return;
    setProgressLoading(true);
    try {
      const response = await getOrder(id);
      console.log('🌼 🔥🔥 loadOrder 🔥🔥 response🌼', response);
      if (response?.success) {
        setUserRole((prev) =>
          user?.id === response?.data?.buyerId
            ? 'buyer'
            : user?.id === response?.data?.sellerId
              ? 'seller'
              : null
        );
        setOrder(response?.data);
        setCurrentStep(response?.data?.currentStep + 1);
      } else {
        toast.error(response?.error || 'failed to load order');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'failed to load order');
    } finally {
      setProgressLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

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
          <div className={`rounded-md bg-white p-4 max-w-3xl`}>
            <button className="flex items-center justify-center " onClick={onBack}>
              <ChevronLeft size={20} />
              <h1 className="font-inter text-xl font-bold text-gray-700"> Escrow Summary</h1>
            </button>
            <h4 className={`text-red-500 ${progressLoading ? 'animate-pulse' : 'hidden'}`}>
              loading ....
            </h4>
            <div className="mb-5 flex items-center justify-between">
              <p className="font-inter text-gray-500">Transactions ID: {id}</p>
              <p className="font-inter text-gray-500">November 3, 2024, 18:25</p>
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
                setProgressLoading={setProgressLoading}
                progressLoading={progressLoading}
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
                setProgressLoading={setProgressLoading}
                progressLoading={progressLoading}
              />
            ) : currentStep === 3 ? (
              <ConfirmShipping
                handleCurrentStepChange={setCurrentStep}
                currentStepChange={currentStep}
                userRole={userRole}
                showActions={true}
              />
            ) : currentStep === 4 ? (
              isReturn ? (
                <ReturnProduct
                  handleCurrentStepChange={setCurrentStep}
                  handleShowRiseDispute={setShowRiseDispute}
                  handleReturnCompleted={handleReturnCompleted} // Handle return completion
                  handleIsRequestRefund={() => {}} // TODO: Implement logic if needed
                  currentStepChange={currentStep}
                  userRole={userRole}
                  showActions={true}
                />
              ) : (
                <Delivery
                  handleCurrentStepChange={setCurrentStep}
                  handleShowRiseDispute={setShowRiseDispute}
                  handleAcceptDelivery={handleAcceptDelivery} // Handle Accept
                  handleRejectDelivery={handleRejectDelivery} // Handle Reject
                  handleIsRequestRefund={() => {}} // Add empty handler for now
                  handleRefundRequested={handleRefundRequested} // Updated handler for refund requests
                  currentStepChange={currentStep}
                  userRole={userRole}
                  showActions={true}
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
              <Summary
                userRole={userRole}
                showActions={true}
                name="Paul Simeon"
                paymentMethod="One Time Payment"
                deliveryDate="November 24, 2023"
                item="Lorem ipsum dolor sit amet consectetur. Id scelerisque condimentum sagittis accumsan viverra est scelerisque volutpat eleifend. Non placerat viverra hac mi in lorem."
                quantity={70}
                price={300000}
              />
            ) : (
              <TransactionSummary />
            )}
          </div>
        </section>
      )}
    </div>
  );
}
