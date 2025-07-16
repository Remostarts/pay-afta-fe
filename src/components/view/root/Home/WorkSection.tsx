import Image from 'next/image';

export default function WorksSection() {
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center bg-white px-4  md:py-14">
        <div className="mb-12 flex flex-col items-center justify-center">
          <h2 className="text-navy-blue text-center font-playfair text-5xl font-bold text-[#03045B] md:text-7xl">
            How It Works
          </h2>
          <p className="text-center font-inter text-xl lg:w-[50%]">
            PayAfta uses advanced encryption and security to protect your money, holding funds
            safely until both parties meet their obligations. Your trusted partner for worry-free
            transactions.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Step 1 */}
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/buyer-seller.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-[#F8F8F8] p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Buyer and seller agree to terms
              </h3>
              <p className="font-inter text-gray-800">
                When you make a purchase or engage in a transaction, both parties agree to use
                PayAfta for payment.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/buyer-submits.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Buyer submits payment to PayAfta
              </h3>
              <p className="font-inter text-gray-800">
                The buyer makes a payment to the seller’s PayAfta wallet. The funds are securely
                held by PayAfta.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/seller-delivers.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Seller delivers order to buyer
              </h3>
              <p className="font-inter text-gray-800">
                The seller ships the product or provides the service as agreed.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Step 4 */}
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/buyer-approves.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                Buyer approves goods or services
              </h3>
              <p className="font-inter text-gray-800">
                Once the buyer receives the goods or services and confirms their satisfaction,
                PayAfta releases the funds to the seller.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative pt-8">
            <div className="relative z-10 mx-auto -mb-8 flex size-16 items-center justify-center rounded-full">
              <Image
                src="/assets/root/home/Payafta-releases.svg"
                alt="Buyer and Seller"
                width={50}
                height={50}
              />
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-50 p-6 pt-12 text-center">
              <h3 className="font-inter text-lg font-semibold text-gray-900">
                PayAfta releases payment to seller
              </h3>
              <p className="font-inter text-gray-800">
                If everything is as expected, the funds are released to the seller. If not, PayAfta
                can help mediate any disputes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Image
            alt="video frame"
            src="/assets/root/home/videoFrame.png"
            width={1280}
            height={400}
          />
        </div>
      </div>
    </>
  );
}
