import Image from 'next/image';

const images = [
  { name: 'secure', image: '/assets/root/home/secure.png' },
  { name: 'complaint', image: '/assets/root/home/PCI complaint.png' },
  { name: 'support', image: '/assets/root/home/support.png' },
];

export default function BuyAndSellSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
        {/* Heading */}
        <h2 className="mb-16 font-playfair text-4xl font-bold text-[#03045B] md:text-5xl lg:text-6xl">
          What Can You Buy And <br className="hidden md:block" /> Sell Using PayAfta?
        </h2>

        {/* Two-column layout */}
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          {/* Physical Products */}
          <div className="w-full max-w-sm rounded-2xl bg-[#E8FDEF] px-6 py-8 text-left shadow-sm md:w-1/2">
            <h3 className="mb-4 font-inter text-xl font-semibold text-[#03045B]">
              Physical Products
            </h3>
            <ul className="space-y-3 text-[15px] text-[#03045B]/90">
              {[
                'General Merchandise',
                'Electronics (Phones, Laptops, Gadgets)',
                'Automobile (Cars, Bikes, Accessories)',
                'Jewelry, Watches, and Fashion',
                'Beauty (Skincare, Makeup) and more...',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Image
                    src="/assets/root/home/check.svg"
                    alt="check"
                    width={18}
                    height={18}
                    className="mt-1"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="w-full max-w-sm rounded-2xl bg-[#E6E7FE] px-6 py-8 text-left shadow-sm md:w-1/2">
            <h3 className="mb-4 font-inter text-xl font-semibold text-[#03045B]">Services</h3>
            <ul className="space-y-3 text-[15px] text-[#03045B]/90">
              {[
                'Freelance Services (Design, Writing, etc.)',
                'Home (Cleaning, Repairs, Renovations)',
                'Virtual Assistance',
                'Marketing and Creative Services',
                'Real Estate (Buy, Sell, Rent, etc.) and more...',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Image
                    src="/assets/root/home/check.svg"
                    alt="check"
                    width={18}
                    height={18}
                    className="mt-1"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col flex-wrap items-center justify-center gap-8 md:flex-row md:justify-between">
          {images.map((item, idx) => (
            <div key={idx} className="flex w-full max-w-xs justify-center md:w-[45%] lg:w-[30%]">
              <Image
                alt={item.name}
                src={item.image}
                width={432}
                height={432}
                className="h-auto w-full rounded-xl object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
