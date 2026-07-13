import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArticulationItem } from '@/types/articulation';
import Matka from './Matka';
import ArticulationCard from './ArticulationCard';
import { useMatkaSounds } from '@/hooks/useMatkaSounds';

interface Props {
  item: ArticulationItem;
  onNext: () => void;
  onReadyForNext: (ready: boolean) => void;
  isAnimatingNext: boolean;
}

export default function MatkaActivityScreen({ item, onNext, onReadyForNext, isAnimatingNext }: Props) {
  const [tapCount, setTapCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { playCrack, playBreak } = useMatkaSounds();

  // Reset when item changes
  useEffect(() => {
    setTapCount(0);
    setIsLocked(false);
    onReadyForNext(false);
  }, [item, onReadyForNext]);

  const handleTap = () => {
    if (isLocked) return;

    if (tapCount === 0) {
      // First tap
      setIsLocked(true);
      playCrack();
      setTapCount(1);

      // Unlock after shake animation
      setTimeout(() => {
        setIsLocked(false);
      }, 500);
    } else if (tapCount === 1) {
      // Second tap
      setIsLocked(true);
      playBreak();
      setTapCount(2);

      // Allow next button to be clicked after reveal
      setTimeout(() => {
        onReadyForNext(true);
      }, 1000);
    }
  };

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
      {/* Background Artwork */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/image5.png')" }}
      />
      <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-[2px]" />

      <AnimatePresence mode="wait">
        {!isAnimatingNext && (
          <motion.div
            key="activity-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-4xl mx-auto"
          >
            {/* If matka is not fully broken, show Matka */}
            {tapCount < 2 && (
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-[-5px]">
                <Matka tapCount={tapCount} onTap={handleTap} />
              </div>
            )}

            {/* When matka breaks, show pieces animating out (handled by Matka) and ArticulationCard */}
            {tapCount === 2 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-start pt-8">
                  <Matka tapCount={tapCount} onTap={() => { }} />
                </div>
                <ArticulationCard
                  word={item.word}
                  sentence={item.sentence}
                  image={item.image}
                  targetSound={item.targetSound}
                  position={item.position}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
