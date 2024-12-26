import { Metadata } from 'next';

import { SigninForm } from '@/components/view/auth/sign-in/SigninForm';

export const metadata: Metadata = {
  title: 'Signin',
  description: 'sign in to your account',
};

const SigninPage = () => {
  return (
    <section>
      <SigninForm />
    </section>
  );
};

export default SigninPage;
