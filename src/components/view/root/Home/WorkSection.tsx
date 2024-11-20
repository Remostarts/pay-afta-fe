import Image from 'next/image';

export default function WorksSection() {
  return (
    <>
      <div className="container mx-auto bg-white px-4 py-20 md:py-32">
        <div className="mb-12">
          <h2 className="text-navy-blue text-center font-playfair text-5xl font-bold text-[#03045B] md:text-7xl">
            How It Works
          </h2>
          <p className="text-center font-inter text-xl">
            We utilize state-of-the-art encryption and security measures to protect your financial
            transactions, ensuring that your money is held securely until both parties meet their
            obligations. Payafta is your trusted partner for worry-free financial transactions
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          {/* Step 1 */}
          <div className="flex flex-col items-center space-y-4 rounded-md border border-gray-300 p-3">
            <div className="rounded-full bg-sky-100 p-4">
              <Image
                src="/assets/root/home/buyer-seller.svg"
                alt="Buyer and Seller"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-inter text-lg font-medium">Buyer and Seller Agree to Terms</h3>
            <p className="text-center font-inter text-gray-600">
              When you make a purchase or engage in a transaction, both parties agree to use Payafta
              for payment.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center space-y-4 rounded-md border border-gray-300 p-3">
            <div className="rounded-full bg-sky-100 p-4">
              <Image
                src="/assets/root/home/buyer-submits.svg"
                alt="Buyer Submits"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-inter text-lg font-medium">Buyer Submits Payment to Payafta</h3>
            <p className="text-center font-inter text-gray-600">
              The buyer makes a payment to the seller&apos;s Payafta wallet. The funds are securely
              held by Payafta.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center space-y-4 rounded-md border border-gray-300 p-3">
            <div className="rounded-full bg-sky-100 p-4">
              <Image
                src="/assets/root/home/seller-delivers.svg"
                alt="Seller Delivers"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-inter text-lg font-medium">Seller Delivers Order to Buyer</h3>
            <p className="text-center font-inter text-gray-600">
              The seller ships the product or provides the service as agreed.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center space-y-4 rounded-md border border-gray-300 p-3">
            <div className="rounded-full bg-sky-100 p-4">
              <Image
                src="/assets/root/home/buyer-approves.svg"
                alt="Buyer Approves"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-inter text-lg font-medium">Buyer Approves Goods or Services</h3>
            <p className="text-center font-inter text-gray-600">
              Once the buyer receives the goods or services and confirms their satisfaction, Payafta
              releases the funds to the seller.
            </p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center space-y-4 rounded-md border border-gray-300 p-3">
            <div className="rounded-full bg-sky-100 p-4">
              <Image
                src="/assets/root/home/payafta-releases.svg"
                alt="Payafta Releases"
                width={32}
                height={32}
              />
            </div>
            <h3 className="font-inter text-lg font-medium">PayAfta Releases Payment to Seller</h3>
            <p className="text-center font-inter text-gray-600">
              If everything is as expected, the funds are released to the seller. If not, Payafta
              can help mediate any disputes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
