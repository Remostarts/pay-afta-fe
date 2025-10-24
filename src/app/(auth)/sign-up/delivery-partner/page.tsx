import { Metadata } from 'next';

import LogisticSignupForm from '@/components/view/auth/sign-up/LogisticSignupForm';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'sign up to your account',
};

export default function Page() {
  return (
    <section>
      <LogisticSignupForm />
    </section>
  );
}
