import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Crosshair, Music } from 'lucide-react';

interface Props {
  sound: string;
  position: string;
  onPracticeAgain: () => void;
  onChoosePosition: () => void;
  onChooseSound: () => void;
}

export default function PracticeOptionsScreen({ sound, position, onPracticeAgain, onChoosePosition, onChooseSound }: Props) {
  return (
    <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 bg-slate-50">
      
      {/* Optional confetti can be fired when this screen mounts if desired */}
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative z-10 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border-4 border-emerald-100 max-w-xl w-full text-center flex flex-col items-center gap-8"
      >
        
        <div className="flex flex-col gap-3 items-center">
          <div className="text-6xl mb-2">🌟</div>
          <h2 className="text-4xl md:text-5xl font-black text-emerald-600 tracking-tight uppercase">
            Great Practising!
          </h2>
          <p className="text-lg md:text-xl font-bold text-slate-500">
            You practised the <span className="text-emerald-700 uppercase">{sound} Sound</span> in the <span className="text-emerald-700 uppercase">{position}</span> position.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full mt-4">
          <motion.button
            onClick={onPracticeAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-emerald-500 text-white font-black rounded-2xl text-lg shadow-[0_4px_0_rgb(5,150,105)] hover:shadow-[0_2px_0_rgb(5,150,105)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-emerald-400"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            Practice Again
          </motion.button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              onClick={onChoosePosition}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl text-sm shadow-[0_4px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-slate-200"
            >
              <Crosshair className="w-5 h-5 stroke-[3]" />
              Choose Position
            </motion.button>

            <motion.button
              onClick={onChooseSound}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full px-4 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl text-sm shadow-[0_4px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-slate-200"
            >
              <Music className="w-5 h-5 stroke-[3]" />
              Choose Sound
            </motion.button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
