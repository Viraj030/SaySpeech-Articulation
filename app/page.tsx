'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Import Components
import GameLayout from '@/components/GameLayout';
import BreakAndSayWelcome from '@/components/BreakAndSayWelcome';
import SoundSelectionScreen from '@/components/SoundSelectionScreen';
import PositionSelectionScreen from '@/components/PositionSelectionScreen';
import MatkaActivityScreen from '@/components/MatkaActivityScreen';
import PracticeOptionsScreen from '@/components/PracticeOptionsScreen';

// Import Data
import { articulationData } from '@/data/articulationData';

type ActivityScreen = 'welcome' | 'soundSelection' | 'positionSelection' | 'practice' | 'practiceOptions';
type Position = 'initial' | 'medial' | 'final' | 'sentence';

export default function BreakAndSayActivity() {
  const [currentScreen, setCurrentScreen] = useState<ActivityScreen>('welcome');
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const [isReadyForNext, setIsReadyForNext] = useState(false);
  const [isAnimatingNext, setIsAnimatingNext] = useState(false);

  // Derive current items
  const currentItems = selectedSound && selectedPosition
    ? articulationData[selectedSound]?.[selectedPosition] || []
    : [];

  const currentItem = currentItems[currentItemIndex];
  const totalItems = currentItems.length; // usually 10

  // ── Navigation Handlers ──

  const handleStart = () => {
    setCurrentScreen('soundSelection');
  };

  const handleSelectSound = (sound: string) => {
    setSelectedSound(sound);
    setCurrentScreen('positionSelection');
  };

  const handleSelectPosition = (position: Position) => {
    setSelectedPosition(position);
    setCurrentItemIndex(0);
    setIsReadyForNext(false);
    setCurrentScreen('practice');
  };

  const handleNextItem = () => {
    if (!isReadyForNext) return;

    setIsAnimatingNext(true);

    setTimeout(() => {
      if (currentItemIndex < totalItems - 1) {
        setCurrentItemIndex(prev => prev + 1);
        setIsReadyForNext(false);
        setIsAnimatingNext(false);
      } else {
        // After 10th item, show practice options
        setIsAnimatingNext(false);
        setCurrentScreen('practiceOptions');
      }
    }, 400); // Wait for exit animation
  };

  const handleHome = () => {
    setCurrentScreen('welcome');
    setSelectedSound(null);
    setSelectedPosition(null);
    setCurrentItemIndex(0);
  };

  // Practice Options Handlers
  const handlePracticeAgain = () => {
    setCurrentItemIndex(0);
    setIsReadyForNext(false);
    setCurrentScreen('practice');
  };

  const handleChoosePosition = () => {
    setSelectedPosition(null);
    setCurrentScreen('positionSelection');
  };

  const handleChooseSound = () => {
    setSelectedSound(null);
    setSelectedPosition(null);
    setCurrentScreen('soundSelection');
  };

  // ── Rendering ──

  const handlePrev = () => {
    if (currentScreen === 'soundSelection') {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'positionSelection') {
      setCurrentScreen('soundSelection');
      setSelectedPosition(null);
    } else if (currentScreen === 'practice') {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(prev => prev - 1);
        setIsReadyForNext(false); // require tap again
      } else {
        setCurrentScreen('positionSelection');
      }
    } else if (currentScreen === 'practiceOptions') {
      setCurrentScreen('practice');
      setCurrentItemIndex(totalItems - 1);
    }
  };

  // Determine header title
  let activityName = 'Say Speech';
  if (currentScreen === 'practice' && selectedSound && selectedPosition) {
    activityName = `${selectedSound} Sound • ${selectedPosition}`;
  }

  // Determine Arrow States
  const handleNextAction = () => {
    if (currentScreen === 'welcome') {
      handleStart();
    } else if (currentScreen === 'practice') {
      handleNextItem();
    }
  };

  const isNextDisabled = () => {
    if (currentScreen === 'soundSelection') return true; // Must pick from grid
    if (currentScreen === 'positionSelection') return true; // Must pick from grid
    if (currentScreen === 'practice') return !isReadyForNext;
    if (currentScreen === 'practiceOptions') return true;
    return false;
  };

  const isPrevDisabled = currentScreen === 'welcome';

  return (
    <GameLayout
      activityName={activityName}
      currentStepIndex={currentItemIndex}
      totalSteps={currentScreen === 'practice' ? totalItems : 0}
      onNext={handleNextAction}
      onPrev={handlePrev}
      disableNext={isNextDisabled()}
      disablePrev={isPrevDisabled}
      onHome={handleHome}
      hideHeader={false}
      hideFooter={false}
      hideHome={currentScreen === 'welcome'}
      isWide={true}
    >
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <BreakAndSayWelcome onStart={handleStart} />
          </motion.div>
        )}

        {currentScreen === 'soundSelection' && (
          <motion.div
            key="soundSelection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <SoundSelectionScreen onSelectSound={handleSelectSound} />
          </motion.div>
        )}

        {currentScreen === 'positionSelection' && selectedSound && (
          <motion.div
            key="positionSelection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <PositionSelectionScreen
              selectedSound={selectedSound}
              onSelectPosition={handleSelectPosition}
            />
          </motion.div>
        )}

        {currentScreen === 'practice' && currentItem && (
          <motion.div
            key="practice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <MatkaActivityScreen
              item={currentItem}
              onNext={handleNextItem}
              onReadyForNext={setIsReadyForNext}
              isAnimatingNext={isAnimatingNext}
            />
          </motion.div>
        )}

        {currentScreen === 'practiceOptions' && selectedSound && selectedPosition && (
          <motion.div
            key="practiceOptions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <PracticeOptionsScreen
              sound={selectedSound}
              position={selectedPosition}
              onPracticeAgain={handlePracticeAgain}
              onChoosePosition={handleChoosePosition}
              onChooseSound={handleChooseSound}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </GameLayout>
  );
}
