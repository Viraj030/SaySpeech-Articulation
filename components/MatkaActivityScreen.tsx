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
  const { playBreak } = useMatkaSounds();

  // Reset when item changes
  useEffect(() => {
    setTapCount(0);
    setIsLocked(false);
    onReadyForNext(false);
  }, [item, onReadyForNext]);

  const handleTap = () => {
    if (isLocked) return;

    if (tapCount === 0) {
      setIsLocked(true);
      playBreak();
      setTapCount(2);

      // Show broken matka for 400ms, then reveal object
      setTimeout(() => {
        setTapCount(3); // State 3 shows the object
        onReadyForNext(true);
      }, 400);
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
            className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto"
          >
            {/* Matka Container: Stays during tap 0, 1, 2, and fades out in tap 3 */}
            {tapCount <= 3 && (
              <motion.div
                className={`absolute inset-0 flex flex-col items-center justify-start ${tapCount === 3 ? 'pointer-events-none' : ''}`}
                animate={{ opacity: tapCount === 3 ? 0 : 1 }}
                transition={{ duration: 0.4 }}
              >
                <Matka tapCount={Math.min(tapCount, 2)} onTap={handleTap} />
              </motion.div>
            )}

            {/* When matka breaks and delay finishes, show ArticulationCard with pop-out animation */}
            {tapCount === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.1, y: -250 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
              >
                <ArticulationCard
                  word={item.word}
                  sentence={item.sentence}
                  image={item.image}
                  targetSound={item.targetSound}
                  position={item.position}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
