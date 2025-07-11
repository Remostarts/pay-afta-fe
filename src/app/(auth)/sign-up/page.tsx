import Image from 'next/image';
import { Metadata } from 'next';

import SignupForm from '@/components/view/auth/sign-up/SignupForm';
import SelectCategory from '@/components/view/auth/sign-up/SelectCategory';
import SignUp from '@/components/view/auth/sign-up';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'sign up to your account',
};

export default function Page() {
  return (
    <section>
      <SignUp />
    </section>
  );
}
