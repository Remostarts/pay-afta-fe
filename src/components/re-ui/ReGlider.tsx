'use client';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface ReGlideProps {
  children: ReactNode;
  index: number;
  formStep: number;
}

export const ReGlider = ({ formStep, index = 0, children }: ReGlideProps) => {
  const search = useSearchParams();
  // const search = searchParams.get('fs');
  // const formStep = search ? parseInt(search) : 0;
  if (search.get('fs') === '2') {
    formStep = 2;
  }
  if (search.get('fsin') === '3') {
    formStep = 3;
  }

  let translateX = -(formStep * 100);

  if (index !== 0) {
    translateX = index * 100 - formStep * 100;
  }

  return (
    <motion.div
      // className={cn('space-y-3', {
      //   hidden: formStep !== index,
      // })}
      animate={{
        translateX: `${translateX}%`,
      }}
      transition={{
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};
