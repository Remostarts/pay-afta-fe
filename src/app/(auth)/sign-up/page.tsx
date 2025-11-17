import { Metadata } from 'next';

import SignupEmailOrSocialAuth from './SignupEmailOrSocialAuth';

export const metadata: Metadata = {
  title: 'Signup',
  description: 'sign up to your account',
};

export default function Page() {
  return (
    <section>
      <SignupEmailOrSocialAuth />
    </section>
  );
}
