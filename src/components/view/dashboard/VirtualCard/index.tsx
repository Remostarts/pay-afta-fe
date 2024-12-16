import CardDetails from './CardDetails';
import CardRepresentation from './CardRepresentation';
import TransactionHistory from './TransactionHistory';

import { ReHeading } from '@/components/re-ui/ReHeading';

export default function VirtualCard() {
  return (
    <section className="rounded-lg bg-white p-4">
      <ReHeading heading="Virtual Card" className="mb-4 text-xl font-semibold" />
      <div className="md:flex md:items-center md:justify-around">
        <CardRepresentation />
        <CardDetails />
      </div>
      <div>
        <TransactionHistory />
      </div>
    </section>
  );
}
