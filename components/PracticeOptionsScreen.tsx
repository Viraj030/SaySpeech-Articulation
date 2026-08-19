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
  const isSpecialSound = ['CV', 'CVCV', 'Multisyllabic', 'VC'].includes(sound);

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-6 bg-slate-50">

      {/* Optional confetti can be fired when this screen mounts if desired */}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative z-10 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border-4 border-emerald-100 max-w-lg w-full text-center flex flex-col items-center gap-6"
      >

        <div className="flex flex-col gap-2 items-center">
          <div className="text-5xl mb-1">🌟</div>
          <h2 className="text-3xl md:text-4xl font-black text-emerald-600 tracking-tight uppercase">
            Great Practising!
          </h2>
          <p className="text-base md:text-lg font-bold text-slate-500">
            You practised the <span className="text-emerald-700 uppercase">{sound} Sound</span>
            {!isSpecialSound && (
              <> in the <span className="text-emerald-700 uppercase">{position}</span> position.</>
            )}
            {isSpecialSound && '.'}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <motion.button
            onClick={onPracticeAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-emerald-500 text-white font-black rounded-2xl text-base shadow-[0_4px_0_rgb(5,150,105)] hover:shadow-[0_2px_0_rgb(5,150,105)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-emerald-400"
          >
            <RotateCcw className="w-5 h-5 stroke-[3]" />
            Practice Again
          </motion.button>

          <div className={`grid ${isSpecialSound ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
            {!isSpecialSound && (
              <motion.button
                onClick={onChoosePosition}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full px-3 py-3 bg-slate-100 text-slate-700 font-black rounded-2xl text-xs sm:text-sm shadow-[0_4px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-slate-200"
              >
                <Crosshair className="w-5 h-5 stroke-[3]" />
                Choose Sound Position
              </motion.button>
            )}

            <motion.button
              onClick={onChooseSound}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full px-3 py-3 bg-slate-100 text-slate-700 font-black rounded-2xl text-xs sm:text-sm shadow-[0_4px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all uppercase tracking-wide border-2 border-slate-200"
            >
              <Music className="w-5 h-5 stroke-[3]" />
              Choose Target Sound
            </motion.button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
