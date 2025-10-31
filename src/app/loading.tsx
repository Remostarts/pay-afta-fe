'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export default function Loading() {
  const reduceMotion = useReducedMotion();
  const particleRadius = 100;
  const ringSizes = [200, 280, 360];
  const rippleDelays = [0, 0.8, 1.6, 2.4];

  const customEase = 'easeOut'; // Smooth easeOut for premium fluidity
  const pulseEase = 'easeInOut'; // Subtle back ease for breathing effects

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden relative">
      {/* === Background Ambient Light === */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-cyan-50/30"
        animate={reduceMotion ? {} : { opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: customEase }}
      />

      <div className="relative flex flex-col items-center justify-center space-y-10">
        {/* === Enhanced Layered Rotating Rings === */}
        {ringSizes.map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-blue-200/40 backdrop-blur-sm"
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={
              reduceMotion
                ? { scale: 1, opacity: 0.4 }
                : {
                    rotate: i % 2 === 0 ? 360 : -360,
                    scale: [1, 1.03, 1],
                    opacity: [0.2, 0.7, 0.2],
                  }
            }
            transition={{
              rotate: {
                duration: 20 + i * 3,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: pulseEase,
              },
              opacity: {
                duration: 3.5,
                repeat: Infinity,
                ease: customEase,
                delay: i * 0.3,
              },
            }}
          />
        ))}

        {/* === Refined Orbiting Particles with Trails === */}
        {[...Array(12)].map((_, i) => {
          const size = 6 - (i % 3);
          const rotationDuration = 8 + (i % 4) * 0.8;
          const initialAngle = -(i * 30);

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ transform: 'translate(-50%, -50%)', transformOrigin: '50% 50%' }}
              initial={{ rotate: initialAngle }}
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{
                duration: rotationDuration,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              <div
                className="absolute"
                style={{
                  left: `${particleRadius}px`,
                  top: 0,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <motion.div
                  className="rounded-full bg-gradient-to-r from-blue-400/80 via-cyan-400/80 to-blue-600/80 shadow-lg shadow-blue-200/50"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                  animate={
                    reduceMotion
                      ? {}
                      : {
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 1, 0.3],
                        }
                  }
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: pulseEase,
                    delay: (i * 0.15) % 1,
                  }}
                >
                  <motion.div
                    className="absolute rounded-full bg-gradient-to-r from-blue-500/80 to-cyan-400/80"
                    style={{
                      width: '100%',
                      height: '100%',
                      top: `-${40 + (i % 6) * 8}px`,
                      left: '-50%',
                    }}
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            scale: [1, 0.6, 1],
                            opacity: [1, 0.2, 1],
                          }
                    }
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: customEase,
                      delay: 0.3,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}

        {/* === Smooth Ripple Waves with Gradient === */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 bg-gradient-to-r from-blue-200/10 via-cyan-200/5 to-blue-300/10 backdrop-blur-sm"
            style={{
              width: 140,
              height: 140,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              reduceMotion
                ? { scale: 1, opacity: 0.3 }
                : {
                    scale: [0, 4],
                    opacity: [0.6, 0],
                  }
            }
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: rippleDelays[i],
              ease: [0.45, 0, 0.55, 1], // Fluid elastic expansion
            }}
          />
        ))}

        {/* === Dynamic Inner Glow Aura === */}
        <motion.div
          className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-blue-300/40 via-cyan-400/30 to-blue-600/20 blur-3xl"
          animate={
            reduceMotion
              ? {}
              : {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.9, 0.3],
                  rotate: [0, 3, -3, 0],
                }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: customEase,
          }}
        />

        {/* === Premium Center Logo Container === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1.5,
            ease: [0.25, 0.46, 0.45, 0.94], // Refined entrance ease
            delay: 0.3,
          }}
          className="relative z-10"
        >
          <motion.div
            className="rounded-full bg-white/90 backdrop-blur-lg p-8 shadow-2xl shadow-blue-100/60 border border-white/30"
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.06, 1],
                    rotate: [0, 0.5, -0.5, 0],
                    y: [0, -1, 1, 0],
                    boxShadow: [
                      '0 0 30px rgba(59,130,246,0.2)',
                      '0 0 50px rgba(56,189,248,0.3)',
                      '0 0 30px rgba(59,130,246,0.2)',
                    ],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: customEase,
              scale: { duration: 2.5, repeat: Infinity, ease: pulseEase },
              rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <motion.div
              animate={
                reduceMotion
                  ? {}
                  : {
                      scale: [1, 1.02, 1],
                      rotate: [0, -0.3, 0.3, 0],
                    }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: customEase,
              }}
            >
              <Image
                src="/logo.svg"
                alt="Company Logo"
                width={100}
                height={100}
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* === Enhanced Text with Sophisticated Shimmer === */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: customEase }}
        >
          <motion.span
            className="relative text-lg font-semibold text-gray-700 tracking-wide"
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: [0.6, 1, 0.6],
                    y: [0, -0.5, 0.5, 0],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: pulseEase,
            }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              Initializing experience...
            </span>
            {/* === Text Shimmer Effect === */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent bg-clip-text text-transparent"
              animate={reduceMotion ? {} : { x: [-120, 120] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: customEase,
                delay: 0.8,
              }}
            />
          </motion.span>
        </motion.div>

        {/* === Progress Indicator === */}
        <motion.div
          className="w-32 h-1 bg-gray-200/60 rounded-full overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            animate={
              reduceMotion
                ? {}
                : {
                    scaleX: [0, 0.8, 1],
                    transformOrigin: 'left center',
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: customEase,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
