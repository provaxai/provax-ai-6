import React from 'react';

interface LogoProps {
  variant?: 'compact' | 'full' | 'shield';
  className?: string;
  theme?: 'dark' | 'light';
}

export default function Logo({ variant = 'full', className = '', theme = 'dark' }: LogoProps) {
  const isFull = variant === 'full';
  const isCompact = variant === 'compact';

  // Core Theme Colors
  const textColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const logoXColor = theme === 'light' ? '#0F172A' : '#FFFFFF';

  // The Majestic Golden Owl & Circuit Wings Vector (Directly matches the provided attachment)
  const LogoIcon = (
    <svg
      viewBox="0 0 200 200"
      className={`${isCompact ? 'w-10 h-10' : 'w-28 h-28 sm:w-36 sm:h-36'} filter drop-shadow-md shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Supreme reflective Metallic Gold Gradient for Dark Mode (matching Mockup Image) */}
        <linearGradient id="owlLogoGold" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF4D0" /> {/* Bright gold forehead highlights */}
          <stop offset="30%" stopColor="#E6C485" /> {/* Elegant soft gold */}
          <stop offset="60%" stopColor="#BE9755" /> {/* Rich bronze shadow tone */}
          <stop offset="85%" stopColor="#A27E43" /> {/* Deep luxury burnished gold */}
          <stop offset="100%" stopColor="#E9CA90" /> {/* Gleaming lower accents */}
        </linearGradient>

        {/* Dynamic Dark Charcoal / Metallic Slate Gradient for Light Mode */}
        <linearGradient id="owlLogoSlate" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Dynamic select colors matching dark theme / light theme dynamically to adapt perfectly */}
      <g 
        stroke={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* --- HEAD OUTER FRAME / CHEEKS --- */}
        {/* Left Cheek curve */}
        <path d="M 32,96 C 32,118 42,136 54,148" />
        {/* Right Cheek curve */}
        <path d="M 168,96 C 168,118 158,136 146,148" />

        {/* --- MAJESTIC HORNS & EAR TUFTS --- */}
        {/* Left outer horn peak */}
        <path d="M 32,96 C 24,62 16,36 15,16" />
        {/* Left inner horn down-swoop joining first eyebrow */}
        <path d="M 15,16 C 36,32 60,48 76,56" />

        {/* Right outer horn peak */}
        <path d="M 168,96 C 176,62 184,36 185,16" />
        {/* Right inner horn down-swoop joining second eyebrow */}
        <path d="M 185,16 C 164,32 140,48 124,56" />

        {/* --- FOREHEAD dome ring --- */}
        <path d="M 38,48 C 66,28 134,28 162,48" strokeWidth="1.6" opacity="0.85" />

        {/* --- INTELLECTUAL SYMMETRICAL EYEBROWS / EYE-CREST --- */}
        {/* Left brow swoop down to nose point */}
        <path d="M 15,16 C 45,45 80,72 100,92" strokeWidth="2.8" />
        {/* Right brow swoop down to nose point */}
        <path d="M 185,16 C 155,45 120,72 100,92" strokeWidth="2.8" />

        {/* --- GLOWING CIRCULAR SPECTACLES (EYE FRAMES) --- */}
        {/* Left Eye sphere */}
        <circle cx="70" cy="94" r="21" strokeWidth="2.2" />
        {/* Left pupil */}
        <circle cx="70" cy="94" r="7" fill={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} stroke="none" />

        {/* Right Eye sphere */}
        <circle cx="130" cy="94" r="21" strokeWidth="2.2" />
        {/* Right pupil */}
        <circle cx="130" cy="94" r="7" fill={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} stroke="none" />

        {/* --- ELEGANT DIAMOND BEAK (Nose) --- */}
        <path d="M 100,88 L 109,99 L 100,111 L 91,99 Z" fill={theme === 'light' ? 'url(#owlLogoSlate)' : 'url(#owlLogoGold)'} strokeWidth="1" />

        {/* --- OPEN KNOWLEDGE STRATEGIC BOOK (Support Base) --- */}
        {/* Center Spine spline */}
        <line x1="100" y1="140" x2="100" y2="176" strokeWidth="2.8" />

        {/* Left pages wiring - Top level leaf */}
        <path d="M 100,143 C 85,128 58,128 42,138" />
        {/* Left mid leaf */}
        <path d="M 100,150 C 85,135 58,135 42,145" />
        {/* Left bottom pages */}
        <path d="M 100,157 C 85,142 58,142 42,152" />
        {/* Left cover profile spline */}
        <path d="M 100,165 C 83,148 54,148 38,159 L 38,149 C 54,138 83,138 100,155 Z" strokeWidth="2" fill={theme === 'light' ? '#0f172a' : '#070a13'} fillOpacity="0.25" />

        {/* Right pages wiring - Top level leaf */}
        <path d="M 100,143 C 115,128 142,128 158,138" />
        {/* Right mid leaf */}
        <path d="M 100,150 C 115,135 142,135 158,145" />
        {/* Right bottom pages */}
        <path d="M 100,157 C 115,142 142,142 158,152" />
        {/* Right cover profile spline */}
        <path d="M 100,165 C 117,148 146,148 162,159 L 162,149 C 146,138 117,138 100,155 Z" strokeWidth="2" fill={theme === 'light' ? '#0f172a' : '#070a13'} fillOpacity="0.25" />
      </g>
    </svg>
  );

  if (variant === 'shield') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  return (
    <div className={`flex ${isCompact ? 'flex-row items-center gap-2.5 sm:gap-3.5' : 'flex-col items-center justify-center text-center'} ${className} select-none`}>
      {/* Icon portion */}
      <div className="relative shrink-0">
        {LogoIcon}
        {isCompact && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full border border-slate-950 animate-pulse" />
        )}
      </div>

      {/* Typography portion */}
      {isCompact ? (
        <div className="flex flex-col text-left select-text">
          <div className="flex items-center gap-1">
            <span className={`font-sans font-black tracking-widest text-base sm:text-lg leading-none ${textColor}`}>
              PROVA
            </span>
            
            {/* Split Style Sleek X */}
            <div className="flex font-extrabold text-[#F59E0B] text-lg sm:text-xl leading-none font-sans select-none items-center">
              <span style={{ color: logoXColor }} className="opacity-95">X</span>
              <span className="text-[#F59E0B] -ml-1">X</span>
            </div>

            <span className="font-extrabold text-[11px] sm:text-xs text-[#EA580C] leading-none font-mono tracking-wider ml-0.5 self-end pb-0.5">
              AI
            </span>
          </div>
          <span className="text-[8px] sm:text-[9.5px] font-sans font-black text-slate-400 hover:text-slate-350 tracking-widest leading-none uppercase mt-1 transition-colors">
            OPERAÇÕES PRF
          </span>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center text-center max-w-sm sm:max-w-xl">
          <div className="flex items-center justify-center select-text">
            <span className={`font-sans font-black text-3xl sm:text-4xl md:text-5xl tracking-wider leading-none ${textColor}`}>
              PROVA
            </span>
            
            {/* Premium X Logo from Attachment */}
            <div className="flex font-black text-4xl sm:text-5xl md:text-6xl leading-none ml-1 relative">
              <span style={{ color: logoXColor }} className="opacity-20 absolute select-none">X</span>
              {/* Combine dark-side of X and golden-side of X for gorgeous design */}
              <span className="text-[#050B14] dark:text-white filter drop-shadow">X</span>
              <span className="text-[#F59E0B] -ml-5 sm:-ml-7 filter drop-shadow-md">X</span>
            </div>

            <span className="font-sans font-black text-lg sm:text-xl md:text-2xl text-[#F59E0B] leading-none ml-2 tracking-wider">
              AI
            </span>
          </div>

          {/* Slogan with Two Golden Horizontal Lines directly matching the provided image style */}
          <div className="w-full flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-[#F59E0B]" />
            <span className="text-[8.5px] sm:text-[10px] md:text-[11px] font-sans font-extrabold uppercase tracking-widest text-[#F59E0B] whitespace-nowrap">
              INTELIGÊNCIA ESTRATÉGICA PARA APROVAÇÃO
            </span>
            <div className="h-[1px] flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-[#F59E0B]" />
          </div>

          {/* Core Strategic Values Indicators (Target, Brain, Results) inside full layout */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 pt-3 border-t border-slate-500/10 text-slate-500 font-sans font-bold text-[9px] sm:text-[11px] uppercase tracking-widest">
            <div className="flex items-center gap-1.5 focus-indigo-400 hover:text-[#FBBF24] transition-colors">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              <span>Estratégia</span>
            </div>
            
            <div className="text-slate-500/30 font-light select-none">|</div>
            
            <div className="flex items-center gap-1.5 hover:text-[#FBBF24] transition-colors">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Foco</span>
            </div>

            <div className="text-slate-500/30 font-light select-none">|</div>

            <div className="flex items-center gap-1.5 hover:text-[#FBBF24] transition-colors">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Resultados</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
