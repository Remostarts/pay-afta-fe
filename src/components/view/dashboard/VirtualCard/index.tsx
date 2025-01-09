import CardDetail from './CardDetail';
import CardRepresentation from './CardRepresentation';
import CreatVirtualCard from './CreatVirtualCard';
import TransactionHistory from './TransactionHistory';

import { ReHeading } from '@/components/re-ui/ReHeading';

export default function VirtualCard() {
  return (
    <section className="rounded-lg bg-white p-4">
      <ReHeading heading="Virtual Card" className="mb-4 text-xl font-semibold" />
      <div className="w-full md:flex md:items-center md:justify-around">
        <div className="h-64 w-full rounded-lg md:w-1/3 ">
          <CardRepresentation />
        </div>
        <div className="mt-4 w-full md:mt-0 md:w-2/5">
          {/* process to create a Virtual Card  */}
          <CreatVirtualCard />

          {/* process to display a Virtual Card details and withdraw money */}
          {/* <CardDetail /> */}
        </div>
      </div>
      <div className="mt-8">
        <TransactionHistory />
      </div>
    </section>
  );
}
