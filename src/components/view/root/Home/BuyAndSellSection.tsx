import Image from 'next/image';

export default function BuyAndSellSection() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-8 md:py-20">
      <h2 className="mb-12 text-center font-playfair text-5xl font-bold text-[#03045B] md:text-7xl">
        What Can You Buy And Sell Using PayAfta?
      </h2>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:justify-center">
        <div className="rounded-lg bg-[#E8FDEF] p-4 md:flex md:w-full md:flex-col md:items-center">
          <h3 className="mb-4 font-inter text-xl font-semibold">Physical Products</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              General Merchandise
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Electronics (Phones, Laptops, Gadgets)
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Automobile (Cars, Bikes, Accessories)
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Jewelry, Watches, and Fashion
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Beauty (Skincare, Makeup) and more...
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-[#E6E7FE] p-4 md:flex md:w-full md:flex-col md:items-center ">
          <h3 className="mb-4 font-inter text-2xl font-semibold">Services</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Freelance Services (Design, Writing, etc.)
            </li>

            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Home (Cleaning, Repairs, Renovations)
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Virtual Assistance
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Marketing and Creative Services
            </li>
            <li className="flex items-center gap-3 font-inter">
              <span>
                <Image src="/assets/root/home/check.svg" alt="check" width={16} height={16} />
              </span>
              Real Estate (Buy, Sell, Rent, etc.) and more...
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
