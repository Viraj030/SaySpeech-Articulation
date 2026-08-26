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
    
    // For sentences, keep the original behavior of highlighting all instances, 
    // but enhance it to catch alternative spellings for specific sounds
    if (position === 'sentence') {
      let pattern = target;
      
      // Handle alternative spellings for specific sounds in sentences
      switch (target.toLowerCase()) {
        case 'j': pattern = 'j|dge|g(?=e|i|y)'; break;
        case 'f': pattern = 'f|ff|ph'; break;
        case 'k': pattern = 'k|ck|c(?=[aou|l|r])|c\\b'; break;
        case 's': pattern = 's|ss|c(?=e|i|y)'; break;
        case 'z': pattern = 'z|zz|s(?=\\b|e\\b)'; break;
        case 'ch': pattern = 'ch|tch'; break;
        case 'sh': pattern = 'sh|ti(?=on)|ci(?=al)'; break;
        case 'l': pattern = 'l|ll'; break;
        case 'r': pattern = 'r|rr|wr'; break;
        case 'm': pattern = 'm|mm|mb'; break;
        case 'n': pattern = 'n|nn|kn'; break;
        case 'p': pattern = 'p|pp'; break;
        case 'b': pattern = 'b|bb'; break;
        case 't': pattern = 't|tt'; break;
        case 'd': pattern = 'd|dd'; break;
        case 'g': pattern = 'g|gg'; break;
      }

      const regex = new RegExp(`(${pattern})`, 'gi');
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, i) => {
            // We need to check if this part is a match. 
            // Since we split by the regex, the matched parts will be at odd indices (1, 3, 5...).
            const isMatch = i % 2 !== 0;
            return isMatch ? (
              <span key={i} className="text-orange-500">{part}</span>
            ) : (
              <span key={i}>{part}</span>
            )
          })}
        </>
      );
    }

    // For initial, medial, and final words, highlight only the target sound at the correct position
    const lowerWord = text.toLowerCase();
    const lowerTarget = target.toLowerCase();
    
    let start = -1;
    let length = 0;

    if (position === 'initial') {
      const targetLen = ['ch', 'sh', 'th'].includes(lowerTarget) ? 2 : 1;
      if (lowerTarget === 'k' && lowerWord.startsWith('c')) {
        start = 0;
        length = 1;
      } else if (lowerWord.startsWith(lowerTarget)) {
        start = 0;
        length = lowerTarget.length;
      } else {
        start = 0;
        length = targetLen;
      }
    } else if (position === 'final') {
      if (lowerTarget === 'b') {
        start = lowerWord.lastIndexOf('b');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'ch') {
        start = lowerWord.lastIndexOf('ch');
        length = start !== -1 ? 2 : 0;
      } else if (lowerTarget === 'd') {
        start = lowerWord.lastIndexOf('d');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'f') {
        if (lowerWord.includes('ff')) {
          start = lowerWord.lastIndexOf('ff');
          length = 2;
        } else {
          start = lowerWord.lastIndexOf('f');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'g') {
        if (lowerWord.includes('gg')) {
          start = lowerWord.lastIndexOf('gg');
          length = 2;
        } else {
          start = lowerWord.lastIndexOf('g');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'j') {
        if (lowerWord.includes('dge')) {
          start = lowerWord.lastIndexOf('dge');
          length = 3;
        } else {
          start = lowerWord.lastIndexOf('g');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'k') {
        if (lowerWord.includes('ck')) {
          start = lowerWord.lastIndexOf('ck');
          length = 2;
        } else {
          start = lowerWord.lastIndexOf('k');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'l') {
        if (lowerWord.includes('ll')) {
          start = lowerWord.lastIndexOf('ll');
          length = 2;
        } else {
          start = lowerWord.lastIndexOf('l');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'm') {
        if (lowerWord.includes('mb')) {
          start = lowerWord.lastIndexOf('mb');
          length = 2;
        } else {
          start = lowerWord.lastIndexOf('m');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'n') {
        start = lowerWord.lastIndexOf('n');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'p') {
        start = lowerWord.lastIndexOf('p');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'r') {
        start = lowerWord.lastIndexOf('r');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 's') {
        if (lowerWord.endsWith('ss')) {
          start = lowerWord.lastIndexOf('ss');
          length = 2;
        } else if (lowerWord.endsWith('ce')) {
          start = lowerWord.lastIndexOf('c');
          length = 1;
        } else if (lowerWord.endsWith('se')) {
          start = lowerWord.lastIndexOf('s');
          length = 1;
        } else {
          start = lowerWord.lastIndexOf('s');
          length = start !== -1 ? 1 : 0;
        }
      } else if (lowerTarget === 'sh') {
        start = lowerWord.lastIndexOf('sh');
        length = start !== -1 ? 2 : 0;
      } else if (lowerTarget === 't') {
        start = lowerWord.lastIndexOf('t');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'th') {
        start = lowerWord.lastIndexOf('th');
        length = start !== -1 ? 2 : 0;
      } else if (lowerTarget === 'v') {
        start = lowerWord.lastIndexOf('v');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'y') {
        start = lowerWord.lastIndexOf('y');
        length = start !== -1 ? 1 : 0;
      } else if (lowerTarget === 'z') {
        if (lowerWord.endsWith('zz')) {
          start = lowerWord.lastIndexOf('zz');
          length = 2;
        } else {
          start = lowerWord.lastIndexOf('z');
          length = start !== -1 ? 1 : 0;
        }
      }
    } else if (position === 'medial') {
      let candidates: string[] = [];
      if (lowerTarget === 'b') candidates = ['bb', 'b'];
      else if (lowerTarget === 'ch') candidates = ['ch'];
      else if (lowerTarget === 'd') candidates = ['dd', 'd'];
      else if (lowerTarget === 'f') candidates = ['ff', 'ph', 'f'];
      else if (lowerTarget === 'g') candidates = ['gg', 'gh', 'g'];
      else if (lowerTarget === 'h') candidates = ['h'];
      else if (lowerTarget === 'j') candidates = ['dg', 'j', 'g', 'd'];
      else if (lowerTarget === 'k') candidates = ['ck', 'k', 'c'];
      else if (lowerTarget === 'l') candidates = ['ll', 'l'];
      else if (lowerTarget === 'm') candidates = ['mm', 'm'];
      else if (lowerTarget === 'n') candidates = ['nn', 'n'];
      else if (lowerTarget === 'p') candidates = ['pp', 'p'];
      else if (lowerTarget === 'r') candidates = ['rr', 'r'];
      else if (lowerTarget === 's') candidates = ['ss', 'c', 's'];
      else if (lowerTarget === 'sh') candidates = ['sh', 'ss'];
      else if (lowerTarget === 't') candidates = ['tt', 't'];
      else if (lowerTarget === 'th') candidates = ['th'];
      else if (lowerTarget === 'v') candidates = ['v'];
      else if (lowerTarget === 'y') {
        if (lowerWord === 'onion') candidates = ['i'];
        else if (lowerWord === 'costume') candidates = ['u'];
        else candidates = ['y'];
      }
      else if (lowerTarget === 'z') candidates = ['zz', 'z', 's'];

      for (const cand of candidates) {
        const idx = lowerWord.indexOf(cand, 1);
        if (idx !== -1) {
          start = idx;
          length = cand.length;
          break;
        }
      }
    }

    if (start !== -1 && length > 0) {
      const before = text.slice(0, start);
      const highlighted = text.slice(start, start + length);
      const after = text.slice(start + length);
      return (
        <>
          <span>{before}</span>
          <span className="text-orange-500">{highlighted}</span>
          <span>{after}</span>
        </>
      );
    }

    // Fallback: simple replace if no match
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
          onError={(e) => {
            e.currentTarget.src = '/images/Matka.png';
          }}
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
