'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

export function useMatkaSounds() {
  const crackSoundRef = useRef<Howl | null>(null);
  const breakSoundRef = useRef<Howl | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    crackSoundRef.current = new Howl({
      src: ['/sounds/matka-crack.mp3'],
      preload: true,
      onend: () => { isPlayingRef.current = false; }
    });

    breakSoundRef.current = new Howl({
      src: ['/sounds/matka-break.mp3'],
      preload: true,
      onend: () => { isPlayingRef.current = false; }
    });

    return () => {
      crackSoundRef.current?.unload();
      breakSoundRef.current?.unload();
    };
  }, []);

  const playCrack = () => {
    if (!crackSoundRef.current || isPlayingRef.current) return;
    isPlayingRef.current = true;
    crackSoundRef.current.play();
  };

  const playBreak = () => {
    if (!breakSoundRef.current || isPlayingRef.current) return;
    isPlayingRef.current = true;
    breakSoundRef.current.play();
  };

  return { playCrack, playBreak };
}
