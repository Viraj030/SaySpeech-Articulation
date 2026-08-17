import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  word?: string;
  sentence?: string;
  image: string;
  targetSound: string;
  position: 'initial' | 'medial' | 'final' | 'sentence';
}

export default function ArticulationCard({ word, sentence, image, targetSound, position }: Props) {
  
  // Highlight the target sound in the word or sentence
  const renderHighlightedText = (text: string, target: string) => {
    if (!text || !target) return text;
    
    // We do a simple case-insensitive replace, wrapping the target sound in a span
    // Note: In a real app, phoneme highlighting can be tricky. This is a basic string match.
    const regex = new RegExp(`(${target})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === target.toLowerCase() ? (
            <span key={i} className="text-orange-500">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <motion.div
      initial={{ scale: 0, y: 80, rotate: -10, opacity: 0 }}
      animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20, 
        delay: 0.1 
      }}
      className="relative z-20 flex flex-col items-center justify-center gap-6"
    >
      {/* Golden Glow Behind Image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-amber-300/30 blur-3xl rounded-full -z-10" />

      {/* Articulation Image */}
      <motion.div 
        className="w-56 h-56 md:w-72 md:h-72 rounded-3xl bg-white border-4 border-amber-200 shadow-2xl p-4 overflow-hidden flex items-center justify-center"
      >
        <img 
          src={image} 
          alt={word || sentence || 'Articulation'} 
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Word / Sentence Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`bg-white/95 backdrop-blur-sm rounded-3xl border-4 border-amber-200 shadow-xl px-6 py-4 md:px-8 md:py-5 ${position === 'sentence' ? 'max-w-[90vw] md:max-w-2xl w-full' : 'max-w-[90vw] md:max-w-md'} text-center mx-auto`}
        style={position === 'sentence' ? { borderRadius: '2rem 2rem 2rem 0' } : {}} // Speech bubble style for sentence
      >
        <div className={`font-black text-slate-800 break-words whitespace-normal ${position === 'sentence' ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug md:leading-tight' : 'text-4xl sm:text-5xl md:text-6xl uppercase tracking-wider'}`}>
          {position === 'sentence' && sentence ? (
            renderHighlightedText(sentence, targetSound)
          ) : word ? (
            renderHighlightedText(word, targetSound)
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
