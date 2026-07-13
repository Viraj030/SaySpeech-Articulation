import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Target, Moon, MessageCircle } from 'lucide-react';

interface Props {
  selectedSound: string;
  onSelectPosition: (position: 'initial' | 'medial' | 'final' | 'sentence') => void;
}

export default function PositionSelectionScreen({ selectedSound, onSelectPosition }: Props) {
  const positions = [
    {
      id: 'initial',
      title: 'INITIAL',
      description: 'Sound at the beginning',
      icon: <Sun className="w-8 h-8" />,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-200 hover:border-amber-400'
    },
    {
      id: 'medial',
      title: 'MEDIAL',
      description: 'Sound in the middle',
      icon: <Target className="w-8 h-8" />,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-200 hover:border-rose-400'
    },
    {
      id: 'final',
      title: 'FINAL',
      description: 'Sound at the end',
      icon: <Moon className="w-8 h-8" />,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200 hover:border-indigo-400'
    },
    {
      id: 'sentence',
      title: 'SENTENCE',
      description: 'Practise the sound in a sentence',
      icon: <MessageCircle className="w-8 h-8" />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200 hover:border-emerald-400'
    }
  ] as const;

  return (
    <div className="flex-1 w-full h-full relative flex flex-col p-6 overflow-hidden">
      {/* Background artwork */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/game-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-white/60 z-0 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-3xl w-full mx-auto flex flex-col gap-6 lg:gap-10 py-4 h-full justify-center">

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center justify-center px-6 py-2 bg-orange-100 text-orange-700 font-black rounded-full uppercase tracking-widest text-sm border border-orange-200">
            {selectedSound} SOUND
          </div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Choose Sound Position
          </h2>
          <p className="text-lg font-bold text-slate-500">
            Where would you like to practise the sound?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {positions.map((pos, i) => (
            <motion.button
              key={pos.id}
              onClick={() => onSelectPosition(pos.id)}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-white rounded-3xl p-5 flex items-start gap-5 text-left border-2 shadow-sm hover:shadow-lg transition-all group ${pos.border}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${pos.bg} ${pos.color} group-hover:scale-110 transition-transform`}>
                {pos.icon}
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-xl font-black text-slate-800 tracking-wide uppercase">
                  {pos.title}
                </span>
                <span className="font-bold text-slate-500">
                  {pos.description}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

      </div>
    </div>
  );
}
