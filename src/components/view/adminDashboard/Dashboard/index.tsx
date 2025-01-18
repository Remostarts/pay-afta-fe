import AnalysisChart from './AnalysisChart';
import StatsSection from './StatsSection';
import TransactionsChart from './TransactionsChart';

export default function Dashboard() {
  return (
    <div>
      <StatsSection />
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <TransactionsChart />
        </div>
        <div>
          <AnalysisChart />
        </div>
      </div>
    </div>
  );
}
