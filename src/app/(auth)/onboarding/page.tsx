import IdentityVerification from '@/components/view/auth/onboarding/IdentityVerification';
import Onboarding from '@/components/view/auth/onboarding/Onboarding';
import PersonalKycForm from '@/components/view/auth/onboarding/PersonalKycForm';
import SettlementKycForm from '@/components/view/auth/onboarding/SettlementKycForm';
import TransactionPin from '@/components/view/auth/onboarding/TransactionPin';

export default function Page() {
  return (
    <section>
      <IdentityVerification />
      {/* <Onboarding /> */}
      {/* <PersonalKycForm /> */}
      {/* <SettlementKycForm /> */}
      {/* <TransactionPin /> */}
    </section>
  );
}
