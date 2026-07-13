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
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Choose Your Target Sound</h2>
            <p className="text-lg font-bold text-slate-500">Which sound would you like to practise?</p>
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {availableSounds.map((sound, i) => (
            <motion.button
              key={sound}
              onClick={() => onSelectSound(sound)}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 hover:border-orange-300 hover:shadow-md hover:shadow-orange-100 p-6 flex flex-col items-center justify-center gap-3 transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-3xl font-black uppercase group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                {sound}
              </div>
              <span className="font-bold text-slate-600 uppercase tracking-wide group-hover:text-orange-600">
                {sound} Sound
              </span>
            </motion.button>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
