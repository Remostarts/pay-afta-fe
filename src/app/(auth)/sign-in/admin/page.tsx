import { Metadata } from 'next';

import { SigninForm } from '@/components/view/auth/sign-in/SigninForm';

export const metadata: Metadata = {
  title: 'Signin',
  description: 'sign in to your account',
};

const SigninPage = () => {
  return (
    <section className="m-auto w-full p-5 md:w-2/5">
      <SigninForm />
    </section>
  );
};

export default SigninPage;
