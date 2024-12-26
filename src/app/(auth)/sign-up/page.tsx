import Image from 'next/image';
import { Metadata } from 'next';

import SignupForm from '@/components/view/auth/sign-up/SignupForm';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'sign up to your account',
};

export default function Page() {
  return (
    <section>
      <SignupForm />
    </section>
  );
}
