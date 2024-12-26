import Image from 'next/image';

export default function EscrowPaymentsSection() {
  return (
    <section className="container mx-auto grid grid-cols-1 items-center gap-12 rounded-xl bg-[#E9F5FB] px-4 py-12 md:grid-cols-2 md:px-8">
      <div>
        <h2 className="text-navy-blue mb-6 text-3xl font-bold md:text-4xl">
          Set Up Escrow Payments With Payafta
        </h2>
        <ul className="space-y-4 text-gray-600">
          <li className="flex items-center gap-3 font-inter">
            <span>
              <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
            </span>
            Create a Payafta account: Sign up by providing the required personal and financial
            information.
          </li>
          <li className="flex items-center gap-3 font-inter">
            <span>
              <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
            </span>
            Verification: Verify your account through the provided verification process.
          </li>
          <li className="flex items-center gap-3 font-inter">
            <span>
              <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
            </span>
            Initiate a Transaction: When you&apos;re ready to make a purchase or engage in a
            transaction, both parties agree to use Payafta for payment.
          </li>
          <li className="flex items-center gap-3 font-inter">
            <span>
              <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
            </span>
            Secure the Funds: The buyer&apos;s payment is securely held by Payafta, and the seller
            is notified to proceed.
          </li>
          <li className="flex items-center gap-3 font-inter">
            <span>
              <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
            </span>
            Transaction Completion: Once the buyer receives the goods or services and confirms their
            satisfaction, Payafta releases the funds to the seller.
          </li>
        </ul>
      </div>
      <div>
        <Image
          src="/assets/root/home/Device.png"
          alt="Phone"
          width={400}
          height={597}
          className="mx-auto"
        />
      </div>
    </section>
  );
}
