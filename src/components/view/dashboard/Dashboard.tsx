import FundWallet from './FundWallet';
import PaymentConfirmation from './PaymentConfirmation';
import ProfileHeader from './ProfileHeader';
import RecentTrackLink from './RecentTrackLink';
import RecentTransactions from './RecentTransactions';
import StatsSection from './StatsSection';
import WalletServices from './WalletServices';
import WithdrawFund from './WithdrawFund';

export default function Dashboard() {
  return (
    <section>
      <div className="hidden lg:m-6 lg:block">
        <ProfileHeader />
      </div>
      <div className="lg:m-6">
        <StatsSection />
      </div>
      <div className="lg:m-6">
        <WalletServices />
      </div>
      <div className="grid lg:m-6 lg:grid-cols-2 lg:gap-2">
        <RecentTrackLink />
        <RecentTransactions />
      </div>
      {/* <div className="grid lg:m-6 lg:grid-cols-2 lg:gap-2">
        <WithdrawFund />
        <PaymentConfirmation />
      </div> */}
    </section>
  );
}
