'use client';

import { useState } from 'react';

import SelectCategory from './SelectCategory';
import SignupForm from './SignupForm';
import LogisticSignupForm from './LogisticSignupForm';

export default function SignUp() {
  const [selectedCategory, setSelectedCategory] = useState('');

  function handleSelectedCategory(value: any) {
    setSelectedCategory(value);
  }

  console.log(selectedCategory);

  return (
    <section>
      {selectedCategory === '' ? (
        <SelectCategory handleCategory={handleSelectedCategory} />
      ) : selectedCategory === 'individual' ? (
        <SignupForm />
      ) : (
        <LogisticSignupForm />
      )}
    </section>
  );
}
