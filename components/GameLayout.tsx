import React from 'react';
import { Home, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export interface GameLayoutProps {
  children: React.ReactNode;
  currentStepIndex: number;
  totalSteps: number;
  activityName: string;
  onNext?: () => void;
  onPrev?: () => void;
  onHome?: () => void;
  onReset?: () => void;
  disableNext?: boolean;
  disablePrev?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideHome?: boolean;
  isWide?: boolean;
  resetLabel?: string;
}

export default function GameLayout({
  children,
  currentStepIndex,
  totalSteps,
  activityName,
  onNext,
  onPrev,
  onHome,
  onReset,
  disableNext = false,
  disablePrev = false,
  hideHeader = false,
  hideFooter = false,
  hideHome = false,
  isWide = false,
  resetLabel = 'Reset'
}: GameLayoutProps) {
  const isFinalStep = totalSteps > 0 && currentStepIndex === totalSteps - 1;

  return (
    <div style={{ backgroundColor: 'var(--bg-outer)' }} className="h-[100dvh] w-screen flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden select-none font-sans antialiased">
      <div className={`relative w-full ${isWide ? 'max-w-5xl' : 'max-w-4xl'} h-full flex items-center justify-center`}>
        
        {/* Main Game Container */}
        <div 
          className="w-full h-full rounded-[24px] sm:rounded-[32px] flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300" 
          style={{ backgroundColor: 'var(--top-bar)', border: '8px solid var(--game-border)' }}
        >
          {/* Top Bar */}
          {!hideHeader && (
            <header className="relative flex items-center px-4 pt-3.5 pb-2.5 min-h-[56px] sm:min-h-[68px] shrink-0 select-none">
              {!hideHome && (
                <button
                  onClick={onHome}
                  className="flex items-center gap-1.5 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 z-10"
                  style={{
                    backgroundColor: 'var(--btn-red)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    color: 'white',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 6px 0px'
                  }}
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </button>
              )}

              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none select-none z-0">
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <span className="text-[#fef08a] font-black text-[15px] sm:text-[22px] tracking-tighter shrink-0 select-none">彡</span>
                  <h1 className="text-sm sm:text-2xl font-black text-white font-display drop-shadow-md text-center truncate tracking-widest uppercase">
                    {activityName}
                  </h1>
                  <span className="text-[#fef08a] font-black text-[15px] sm:text-[22px] tracking-tighter shrink-0 select-none">彡</span>
                </div>
              </div>

              {/* Progress Tag (Top Right inside header) */}
              {totalSteps > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 px-3 py-1 rounded-full text-white font-bold text-sm border-2 border-white/30 backdrop-blur-sm shadow-sm z-10 flex items-center justify-center pointer-events-none">
                  {currentStepIndex + 1} / {totalSteps}
                </div>
              )}

              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all uppercase shrink-0 z-10 ml-auto"
                  style={{
                    backgroundColor: 'var(--btn-blue)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    color: 'white',
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 6px 0px'
                  }}
                  title={resetLabel}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">{resetLabel}</span>
                </button>
              )}
            </header>
          )}

          {/* Content Area */}
          <main className="flex-1 flex items-center justify-center relative min-h-0 w-full overflow-hidden bg-white">
            <div className="flex-1 flex flex-col w-full h-full opacity-100 transform-none">
              <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden select-none p-0 relative">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Prev Button (Left) */}
        {!hideFooter && (
          <button
            onClick={onPrev}
            disabled={disablePrev}
            className="absolute -left-3 sm:-left-6 md:-left-20 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 active:translate-y-[calc(-50%+3px)] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all disabled:cursor-not-allowed w-12 h-12 sm:w-14 sm:h-14 shadow-lg scale-75 sm:scale-100"
            style={{
              backgroundColor: disablePrev ? 'rgb(160, 160, 160)' : 'var(--btn-red)',
              borderRadius: '50%',
              color: 'white',
              opacity: disablePrev ? 0.4 : 1,
              boxShadow: disablePrev ? 'none' : 'rgba(0, 0, 0, 0.15) 0px 6px 0px'
            }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3px] -ml-1" />
          </button>
        )}

        {/* Next Button (Right) */}
        {!hideFooter && (
          <button
            onClick={onNext}
            disabled={disableNext}
            className="absolute -right-3 sm:-right-6 md:-right-20 top-1/2 -translate-y-1/2 flex items-center justify-center z-30 active:translate-y-[calc(-50%+3px)] active:shadow-[0_3px_0_rgba(0,0,0,0.15)] transition-all disabled:cursor-not-allowed w-12 h-12 sm:w-14 sm:h-14 shadow-lg scale-75 sm:scale-100"
            style={{
              backgroundColor: disableNext ? 'rgb(160, 160, 160)' : '#009688', // Teal as per snippet image logic
              borderRadius: '50%',
              color: 'white',
              opacity: disableNext ? 0.4 : 1,
              boxShadow: disableNext ? 'none' : 'rgba(0, 0, 0, 0.15) 0px 6px 0px'
            }}
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[3px] -mr-1" />
          </button>
        )}
      </div>
    </div>
  );
}
