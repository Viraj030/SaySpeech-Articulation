import React from 'react';

interface Props {
  onStart: () => void;
}

export default function BreakAndSayWelcome({ onStart }: Props) {
  return (
    <div className="w-full h-full relative cursor-pointer" onClick={onStart}>
      <img
        src="/images/cover-img.png"
        alt="Say Speech"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}
