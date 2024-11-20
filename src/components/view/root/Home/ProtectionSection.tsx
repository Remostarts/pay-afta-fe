import Image from 'next/image';

export default function ProtectionSection() {
  return (
    <>
      <section className="bg-navy-blue">
        <div className="container mx-auto px-4">
          {/* Buyer Section  */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Left: Content */}
            <div className="space-y-6">
              <Image
                src="/assets/root/home/buyer-protection.png"
                alt="buyer protection"
                width={600}
                height={600}
                priority
              />
            </div>

            {/* Right: Content  */}
            <div className="space-y-6">
              <h1 className="font-playfair text-5xl font-bold leading-tight text-[#03045B] md:text-8xl">
                buyer protection with payAfta
              </h1>
              <p className="font-inter text-lg">
                Payafta takes buyer protection seriously. We&apos;re here to ensure that you receive
                what you paid for. Our process guarantees that your money is held securely until you
                confirm your satisfaction. If you encounter any issues with your purchase, our team
                is ready to assist and, if necessary, facilitate refunds. Your peace of mind is our
                top priority.
              </p>
            </div>
          </div>

          {/* Seller Section  */}
          <div className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div>
              <h1 className="font-playfair text-5xl font-bold leading-tight text-[#03045B] md:text-8xl">
                seller protection with payAfta
              </h1>
              <p className="font-inter text-lg">
                Sellers, we&apos;ve got your back too. Payafta provides seller protection by
                ensuring ensuring that you receive payment once you fulfill your part of the deal.
                You can trust us to hold the buyer&apos;s funds securely until the transaction is
                complete. We&apos;re to making your online sales as smooth and secure as possible.
              </p>
            </div>
            <div>
              <div className="relative justify-self-end">
                <Image
                  src="/assets/root/home/seller-protection.png"
                  alt="seller protection"
                  width={600}
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
