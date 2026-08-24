import React from 'react';
import { motion } from 'framer-motion';
import { availableSounds } from '@/data/articulationData';

interface Props {
  onSelectSound: (sound: string) => void;
}

export default function SoundSelectionScreen({ onSelectSound }: Props) {
  return (
    <div className="flex-1 w-full h-full relative flex flex-col overflow-hidden">
      {/* Background artwork */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/game-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/60 z-0 backdrop-blur-[1px]" />

      {/* Scrollable Content Area */}
      <div className="relative z-10 w-full h-full overflow-y-auto p-6">
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-6 lg:gap-8 py-4 min-h-full justify-center">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">Choose Your Target Sound</h2>
            <p className="text-base sm:text-lg font-bold text-slate-500">Which sound would you like to practise?</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {availableSounds.map((sound, i) => {
              const isMultisyllabic = sound === 'Multisyllabic';
              const isCVCV = sound === 'CVCV';

              let colSpanClass = 'col-span-1';
              if (isCVCV) colSpanClass = 'col-span-1 sm:col-span-1 md:col-span-1'; // User said "increase width for CVCV", we can make it col-span-2 on mobile

              if (isCVCV) colSpanClass = 'col-span-2 sm:col-span-2 md:col-span-1';

              const circleText = isMultisyllabic ? 'MULTI' : sound;
              const textSizeClass = circleText.length > 2 ? 'text-sm sm:text-base' : 'text-xl';

              return (
                <motion.div
                  key={sound}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 15 }}
                  className={colSpanClass}
                >
                  <motion.button
                    onClick={() => onSelectSound(sound)}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className={`w-full h-full bg-white rounded-xl shadow-sm border-2 border-slate-100 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 p-3 sm:p-4 flex flex-col items-center justify-center gap-2 transition-colors duration-100 group`}
                  >
                    <div className={`h-12 min-w-[3rem] px-3 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-black uppercase group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner ${textSizeClass}`}>
                      {circleText}
                    </div>
                    <span className="font-bold text-[0.8rem] text-slate-600 uppercase tracking-wide group-hover:text-orange-600 text-center">
                      {sound} Sound
                    </span>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
