import Image from 'next/image';

export default function EscrowPaymentsSection() {
  return (
    <section className="mx-auto max-w-8xl rounded-3xl bg-[#E9F5FB] px-6 py-16 md:px-12 md:py-20 lg:px-20">
      <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
        {/* Left Section */}
        <div className="w-full md:w-1/2">
          <h2 className="mb-8 font-playfair text-3xl font-extrabold leading-tight text-[#03045B] md:text-4xl lg:text-5xl">
            Set Up Escrow Payments with PayAfta
          </h2>

          <ul className="space-y-5 text-[16px] leading-relaxed text-[#03045B]/90 font-inter">
            <li className="flex items-start gap-3">
              <Image
                src="/assets/root/home/check.svg"
                alt="check"
                width={20}
                height={20}
                className="mt-1"
              />
              <span>
                <strong>Create a PayAfta account:</strong> Sign up by providing the required
                personal and financial information.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Image
                src="/assets/root/home/check.svg"
                alt="check"
                width={20}
                height={20}
                className="mt-1"
              />
              <span>
                <strong>Verification:</strong> Verify your account through the provided verification
                process.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Image
                src="/assets/root/home/check.svg"
                alt="check"
                width={20}
                height={20}
                className="mt-1"
              />
              <span>
                <strong>Initiate a Transaction:</strong> When you're ready to make a purchase or
                engage in a transaction, both parties agree to use PayAfta for payment.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Image
                src="/assets/root/home/check.svg"
                alt="check"
                width={20}
                height={20}
                className="mt-1"
              />
              <span>
                <strong>Secure the Funds:</strong> The buyer's payment is securely held by PayAfta,
                and the seller is notified to proceed.
              </span>
            </li>

            <li className="flex items-start gap-3">
              <Image
                src="/assets/root/home/check.svg"
                alt="check"
                width={20}
                height={20}
                className="mt-1"
              />
              <span>
                <strong>Transaction Completion:</strong> Once the buyer receives the goods or
                services and confirms their satisfaction, PayAfta releases the funds to the seller.
              </span>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/root/home/iPhone 12 Pro mockup.png"
            alt="Phone mockup"
            width={420}
            height={700}
            className="mx-auto w-[80%] max-w-[400px] object-contain drop-shadow-xl md:w-full"
          />
        </div>
      </div>
    </section>
  );
}
