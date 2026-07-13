import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  tapCount: number;
  onTap: () => void;
}

export default function Matka({ tapCount, onTap }: Props) {
  // Fire some subtle dust confetti on breaks
  useEffect(() => {
    if (tapCount === 2) {
      // Subtle dust effect
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e2e8f0', '#cbd5e1', '#b45309'],
        disableForReducedMotion: true,
        gravity: 0.8,
        scalar: 0.8,
      });
    } else if (tapCount === 1) {
      // Tiny dust on crack
      confetti({
        particleCount: 10,
        spread: 30,
        origin: { y: 0.5 },
        colors: ['#e2e8f0', '#b45309'],
        disableForReducedMotion: true,
        gravity: 1,
        scalar: 0.5,
        startVelocity: 15,
      });
    }
  }, [tapCount]);

  const getImageSrc = () => {
    if (tapCount === 0) return '/images/Matka-1.png';
    if (tapCount === 1) return '/images/Matka-2.png';
    return '/images/Matka-3.png';
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <motion.button
        onClick={onTap}
        // Swing animation when intact, shake when cracked, static when broken
        animate={
          tapCount === 0
            ? { rotate: [-2, 2, -2], y: [0, 3, 0] }
            : tapCount === 1
              ? { x: [0, -8, 8, -6, 6, 0], rotate: [0, -3, 3, -2, 2, 0], scale: [1, 1.05, 1] }
              : { rotate: 0, y: 0, scale: 1 }
        }
        transition={
          tapCount === 0
            ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } // continuous swing
            : tapCount === 1
              ? { duration: 0.4 } // quick shake
              : { duration: 0.3 } // reset for broken
        }
        className="relative z-10 w-80 h-80 md:w-96 md:h-96 cursor-pointer focus:outline-none rounded-full"
        disabled={tapCount >= 2}
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={getImageSrc()}
            src={getImageSrc()}
            alt="Matka"
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 w-full h-full object-contain drop-shadow-2xl`}
          />
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
