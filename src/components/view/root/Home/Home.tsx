import HeroSection from './HeroSection';
import WorksSection from './WorkSection';
import ProtectionSection from './ProtectionSection';
import BuyAndSellSection from './BuyAndSellSection';
import EscrowPaymentsSection from './EscrowPaymentsSection';
import Faqs from './Faq';

export default function Home() {
  return (
    <>
      <section>
        <HeroSection />

        {/* How it works  */}
        <WorksSection />

        {/* Protection Section  */}
        <ProtectionSection />

        {/* Buy And Sell Section  */}
        <BuyAndSellSection />

        {/* Payments Section  */}
        <EscrowPaymentsSection />

        {/* Faq Section  */}
        <Faqs />
      </section>
    </>
  );
}
