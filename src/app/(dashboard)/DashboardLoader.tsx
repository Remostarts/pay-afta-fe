'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function DashboardLoader() {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Simulate loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + Math.random() * 15, 100);
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  // Animated dots for loading text
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center space-y-6 rounded-xl shadow-lg p-8 bg-white border border-gray-200 relative overflow-hidden"
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-cyan-50/30 pointer-events-none" />

        {/* Spinner Container with Progress Ring */}
        <div className="relative">
          {/* Pulsing background glow */}
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-100/60 blur-xl"
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Main spinner ring */}
          <div className="relative h-16 w-16">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-200" />

            {/* Animated spinner */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            {/* Progress percentage in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-xs font-bold text-blue-600"
                key={Math.floor(progress / 10)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center relative z-10">
          <motion.p
            className="text-lg font-semibold text-blue-800 font-inter"
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.8, 1, 0.8],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Loading your dashboard{dots}
          </motion.p>
          <p className="text-sm text-gray-500 mt-1">
            Please wait while we get things ready for you.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs space-y-2 relative z-10">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />

            {/* Shimmer effect */}
            {!reduceMotion && progress < 100 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </div>

          {/* Progress text */}
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Setting up...</span>
            <motion.span
              key={Math.floor(progress / 5)}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-medium text-blue-600"
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </div>

        {/* Optional: Status indicators */}
        <div className="flex gap-1.5 relative z-10">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: progress > i * 25 ? ['#3B82F6', '#06B6D4', '#3B82F6'] : '#D1D5DB',
                scale: progress > i * 25 ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
