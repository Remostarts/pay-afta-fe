import { ReButton } from '@/components/re-ui/ReButton';
import ReRadioGroup from '@/components/re-ui/ReRadio';

export default function PaymentSummary() {
  return (
    <div className=" bg-white p-6 ">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-inter text-xl font-medium">Payment Summary</h2>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-inter text-gray-700">Transaction Amount</span>
          <span className="font-inter text-gray-700">₦334,000.00</span>
        </div>
        <div className="flex justify-between">
          <span className="font-inter text-gray-700">Escrow fee @ 2.5%</span>
          <span className="font-inter text-gray-700">₦1,050.00</span>
        </div>
        <div className="flex justify-between text-lg font-medium">
          <span className="font-inter text-gray-700">Total</span>
          <span className="font-inter text-gray-700">₦335,050.00</span>
        </div>
        <div className="flex flex-col items-center justify-between rounded-lg p-4">
          <span className="font-inter text-gray-800">Select Payment Method</span>
          <ReRadioGroup
            name="paymentMethod"
            options={[
              { label: 'Wallet Balance', value: 'wallet balance' },
              { label: 'Bank Transfer', value: 'bank transfer' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
